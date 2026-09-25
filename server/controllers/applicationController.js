const Application = require('../models/Application');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get all applications for current user (with filters, search, sorting, pagination)
// @route   GET /api/applications
// @access  Private (Empty array if unauthenticated)
const getApplications = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.json({
      success: true,
      count: 0,
      total: 0,
      page: 1,
      pages: 0,
      data: []
    });
  }

  const { stage, search, sort, page = 1, limit = 50, archived } = req.query;
  const query = { user: req.user._id };

  if (stage && stage !== 'all') query.stage = stage;
  if (archived === 'true') query.isArchived = true;
  else query.isArchived = false;

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { company: { $regex: search, $options: 'i' } },
      { tags: { $regex: search, $options: 'i' } },
      { requiredSkills: { $regex: search, $options: 'i' } }
    ];
  }

  const sortOptions = {};
  if (sort === 'newest') sortOptions.dateApplied = -1;
  else if (sort === 'oldest') sortOptions.dateApplied = 1;
  else if (sort === 'company') sortOptions.company = 1;
  else if (sort === 'next_round') sortOptions.nextRoundDate = 1;
  else if (sort === 'priority') sortOptions.priority = -1;
  else sortOptions.updatedAt = -1;

  const total = await Application.countDocuments(query);
  const applications = await Application.find(query)
    .sort(sortOptions)
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .populate('jobPosting', 'applicantCount salary location jobUrl');

  res.json({
    success: true,
    count: applications.length,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
    data: applications
  });
});

// @desc    Get single application
// @route   GET /api/applications/:id
// @access  Private
const getApplication = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id).populate('jobPosting');
  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }
  res.json({ success: true, data: application });
});

// @desc    Create new application
// @route   POST /api/applications
// @access  Private
const createApplication = asyncHandler(async (req, res) => {
  if (req.user) {
    req.body.user = req.user._id;
  }
  if (!req.body.dateApplied) {
    req.body.dateApplied = new Date();
  }

  const application = await Application.create(req.body);
  res.status(201).json({ success: true, data: application });
});

// @desc    Update application
// @route   PUT /api/applications/:id
// @access  Private
const updateApplication = asyncHandler(async (req, res) => {
  const application = await Application.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }
  res.json({ success: true, data: application });
});

// @desc    Update application stage (for drag-and-drop pipeline)
// @route   PATCH /api/applications/:id/stage
// @access  Private
const updateStage = asyncHandler(async (req, res) => {
  const { stage } = req.body;
  const validStages = ['wishlist', 'applied', 'screening', 'interviewing', 'offer', 'accepted', 'rejected', 'ghosted'];

  if (!stage || !validStages.includes(stage)) {
    res.status(400);
    throw new Error(`Invalid stage. Must be one of: ${validStages.join(', ')}`);
  }

  const updateData = { stage };

  // Auto-set dateApplied when moving to 'applied' stage if not set
  if (stage === 'applied') {
    updateData.dateApplied = new Date();
  }
  // Auto-set dateResponse when moving to screening or later
  if (['screening', 'interviewing', 'offer', 'accepted', 'rejected'].includes(stage)) {
    const app = await Application.findById(req.params.id);
    if (app && !app.dateResponse) {
      updateData.dateResponse = new Date();
    }
  }

  const application = await Application.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true, runValidators: true }
  );

  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }

  res.json({ success: true, data: application });
});

// @desc    Delete application
// @route   DELETE /api/applications/:id
// @access  Private
const deleteApplication = asyncHandler(async (req, res) => {
  const application = await Application.findByIdAndDelete(req.params.id);
  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }
  res.json({ success: true, data: {} });
});

// @desc    Add note to application
// @route   POST /api/applications/:id/notes
// @access  Private
const addNote = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id);
  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }
  application.notes.push({ content: req.body.content });
  await application.save();
  res.status(201).json({ success: true, data: application });
});

// @desc    Delete note from application
// @route   DELETE /api/applications/:id/notes/:noteId
// @access  Private
const deleteNote = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id);
  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }
  application.notes = application.notes.filter(
    (n) => n._id.toString() !== req.params.noteId
  );
  await application.save();
  res.json({ success: true, data: application });
});

// @desc    Add contact to application
// @route   POST /api/applications/:id/contacts
// @access  Private
const addContact = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id);
  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }
  application.contacts.push(req.body);
  await application.save();
  res.status(201).json({ success: true, data: application });
});

// @desc    Update contact
// @route   PUT /api/applications/:id/contacts/:contactId
// @access  Private
const updateContact = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id);
  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }
  const contact = application.contacts.id(req.params.contactId);
  if (!contact) {
    res.status(404);
    throw new Error('Contact not found');
  }
  Object.assign(contact, req.body);
  await application.save();
  res.json({ success: true, data: application });
});

// @desc    Delete contact
// @route   DELETE /api/applications/:id/contacts/:contactId
// @access  Private
const deleteContact = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id);
  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }
  application.contacts = application.contacts.filter(
    (c) => c._id.toString() !== req.params.contactId
  );
  await application.save();
  res.json({ success: true, data: application });
});

module.exports = {
  getApplications,
  getApplication,
  createApplication,
  updateApplication,
  updateStage,
  deleteApplication,
  addNote,
  deleteNote,
  addContact,
  updateContact,
  deleteContact
};
