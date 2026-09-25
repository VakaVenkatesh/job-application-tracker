const express = require('express');
const router = express.Router();
const { optionalProtect } = require('../middleware/authMiddleware');
const {
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
} = require('../controllers/applicationController');

// Attach optionalProtect to extract req.user if JWT is provided
router.use(optionalProtect);

// Main CRUD
router.route('/')
  .get(getApplications)
  .post(createApplication);

router.route('/:id')
  .get(getApplication)
  .put(updateApplication)
  .delete(deleteApplication);

// Stage update (drag-and-drop)
router.patch('/:id/stage', updateStage);

// Notes
router.post('/:id/notes', addNote);
router.delete('/:id/notes/:noteId', deleteNote);

// Contacts
router.post('/:id/contacts', addContact);
router.put('/:id/contacts/:contactId', updateContact);
router.delete('/:id/contacts/:contactId', deleteContact);

module.exports = router;
