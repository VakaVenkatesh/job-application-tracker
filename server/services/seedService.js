const JobPosting = require('../models/JobPosting');
const remotiveService = require('./remotiveService');
const arbeitnowService = require('./arbeitnowService');

// Curated high-caliber job postings across full-time, freelance, contract, and internships
const CURATED_JOBS = [
  {
    title: 'Senior Full Stack Engineer (React / Node / TypeScript)',
    company: 'Stripe',
    companyLogo: 'https://logo.clearbit.com/stripe.com',
    companyWebsite: 'https://stripe.com',
    location: 'Remote - Worldwide',
    salary: '$140,000 - $190,000 / yr',
    jobType: 'full_time',
    category: 'Engineering',
    experienceLevel: 'senior',
    requiredSkills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'GraphQL', 'AWS'],
    tags: ['FinTech', 'High Growth', 'Remote First'],
    description: 'Build mission-critical payment infrastructure and delightful merchant portals powering millions of internet businesses globally. You will design scalable microservices and architect responsive user interfaces.',
    jobUrl: 'https://stripe.com/jobs',
    applicantCount: 42,
    isActive: true
  },
  {
    title: 'Frontend UI/UX Architect (Next.js & Design Systems)',
    company: 'Vercel',
    companyLogo: 'https://logo.clearbit.com/vercel.com',
    companyWebsite: 'https://vercel.com',
    location: 'Remote - North America / EU',
    salary: '$130,000 - $175,000 / yr',
    jobType: 'full_time',
    category: 'Frontend',
    experienceLevel: 'mid',
    requiredSkills: ['React', 'Next.js', 'TypeScript', 'TailwindCSS', 'Framer Motion', 'Web Performance'],
    tags: ['Design Systems', 'Developer Tools', 'Cloud'],
    description: 'Craft world-class developer experiences and dashboard interfaces for millions of web developers. Help push the frontier of modern frontend frameworks and edge rendering.',
    jobUrl: 'https://vercel.com/careers',
    applicantCount: 89,
    isActive: true
  },
  {
    title: 'Freelance AI Web Application Specialist',
    company: 'Anthropic',
    companyLogo: 'https://logo.clearbit.com/anthropic.com',
    companyWebsite: 'https://anthropic.com',
    location: 'Remote',
    salary: '$95 - $140 / hr',
    jobType: 'freelance',
    category: 'AI & Data',
    experienceLevel: 'senior',
    requiredSkills: ['Python', 'FastAPI', 'React', 'Prompt Engineering', 'LangChain', 'Vector DBs'],
    tags: ['Generative AI', 'Freelance Contract', 'High Rate'],
    description: 'Collaborate on prototype AI assistant interfaces, interactive sandbox environments, and LLM benchmarking platforms. Flexible hourly contract with immediate kickoff.',
    jobUrl: 'https://anthropic.com/careers',
    applicantCount: 64,
    isActive: true
  },
  {
    title: 'Backend Systems & Distributed DB Engineer',
    company: 'MongoDB',
    companyLogo: 'https://logo.clearbit.com/mongodb.com',
    companyWebsite: 'https://mongodb.com',
    location: 'Bengaluru, India (Hybrid)',
    salary: '₹28,00,000 - ₹42,00,000 / yr',
    jobType: 'full_time',
    category: 'Backend',
    experienceLevel: 'mid',
    requiredSkills: ['Go', 'C++', 'Distributed Systems', 'MongoDB', 'Kafka', 'Docker'],
    tags: ['Database', 'Core Infrastructure', 'Hybrid'],
    description: 'Work on database kernel optimizations, cloud atlas auto-sharding algorithms, and high-throughput query execution pipelines.',
    jobUrl: 'https://mongodb.com/careers',
    applicantCount: 31,
    isActive: true
  },
  {
    title: 'Mobile App Developer (React Native & Flutter)',
    company: 'Swiggy',
    companyLogo: 'https://logo.clearbit.com/swiggy.com',
    companyWebsite: 'https://swiggy.com',
    location: 'Bengaluru, India',
    salary: '₹22,00,000 - ₹35,00,000 / yr',
    jobType: 'full_time',
    category: 'Mobile',
    experienceLevel: 'mid',
    requiredSkills: ['React Native', 'TypeScript', 'Redux Toolkit', 'Mobile Performance', 'Native Android/iOS'],
    tags: ['Hyperlocal', 'Consumer Tech', 'High Scale'],
    description: 'Ship high-performance consumer app experiences serving over 150 million orders monthly. Optimize startup time, frame rates, and offline resiliency.',
    jobUrl: 'https://swiggy.com/careers',
    applicantCount: 57,
    isActive: true
  },
  {
    title: 'Contract Web3 & Smart Contracts Auditor',
    company: 'Polygon Labs',
    companyLogo: 'https://logo.clearbit.com/polygon.technology',
    companyWebsite: 'https://polygon.technology',
    location: 'Remote',
    salary: '$80 - $125 / hr',
    jobType: 'contract',
    category: 'Blockchain',
    experienceLevel: 'senior',
    requiredSkills: ['Solidity', 'Rust', 'EVM', 'Smart Contract Security', 'Foundry'],
    tags: ['Web3', 'Contract', 'ZK Rollups'],
    description: 'Perform rigorous security audits, formal verification, and gas optimization for next-generation zkEVM protocols and bridges.',
    jobUrl: 'https://polygon.technology/careers',
    applicantCount: 19,
    isActive: true
  },
  {
    title: 'Software Engineering Graduate Intern (Summer 2026)',
    company: 'Microsoft',
    companyLogo: 'https://logo.clearbit.com/microsoft.com',
    companyWebsite: 'https://microsoft.com',
    location: 'Hyderabad / Bengaluru, India',
    salary: '₹85,000 / month Stipend',
    jobType: 'internship',
    category: 'Engineering',
    experienceLevel: 'fresher',
    requiredSkills: ['Data Structures & Algorithms', 'C++', 'Java', 'Python', 'Object Oriented Programming', 'Git'],
    tags: ['Internship', 'Mentorship', 'PPO Opportunity'],
    description: 'Join Azure or Office 365 core teams for an intensive 3-6 month internship. Work with world-class mentors, solve real customer challenges, and gain hands-on production experience.',
    jobUrl: 'https://careers.microsoft.com',
    applicantCount: 184,
    isActive: true
  },
  {
    title: 'Cloud DevOps & Kubernetes Engineer',
    company: 'Razorpay',
    companyLogo: 'https://logo.clearbit.com/razorpay.com',
    companyWebsite: 'https://razorpay.com',
    location: 'Bengaluru, India',
    salary: '₹24,00,000 - ₹38,00,000 / yr',
    jobType: 'full_time',
    category: 'DevOps & Cloud',
    experienceLevel: 'senior',
    requiredSkills: ['AWS', 'Kubernetes', 'Terraform', 'CI/CD', 'Prometheus', 'Golang'],
    tags: ['FinTech', 'DevOps', 'Cloud Native'],
    description: 'Maintain 99.999% availability across payment processing clusters handling billions in monthly transactions. Build automated multi-region failover infrastructure.',
    jobUrl: 'https://razorpay.com/jobs',
    applicantCount: 28,
    isActive: true
  },
  {
    title: 'Freelance Creative Front-end Developer',
    company: 'Figma',
    companyLogo: 'https://logo.clearbit.com/figma.com',
    companyWebsite: 'https://figma.com',
    location: 'Remote',
    salary: '$90 - $130 / hr',
    jobType: 'freelance',
    category: 'Frontend',
    experienceLevel: 'mid',
    requiredSkills: ['Three.js', 'WebGL', 'React', 'GSAP', 'CSS Animations', 'Canvas API'],
    tags: ['Creative Tech', 'Interactive 3D', 'Remote'],
    description: 'Build mind-blowing interactive showcase websites, 3D interactive marketing micro-sites, and dynamic WebGL shaders for brand releases.',
    jobUrl: 'https://figma.com/careers',
    applicantCount: 73,
    isActive: true
  },
  {
    title: 'Associate Product Engineer (React / Python)',
    company: 'Notion',
    companyLogo: 'https://logo.clearbit.com/notion.so',
    companyWebsite: 'https://notion.so',
    location: 'Remote - Global',
    salary: '$110,000 - $145,000 / yr',
    jobType: 'full_time',
    category: 'Engineering',
    experienceLevel: 'junior',
    requiredSkills: ['React', 'TypeScript', 'Python', 'SQLite', 'IndexedDB', 'REST APIs'],
    tags: ['Productivity', 'Collaborative', 'High Impact'],
    description: 'Craft features for Notion calendar, offline synchronization, and workspace collaboration tools used by tens of millions of teams worldwide.',
    jobUrl: 'https://notion.so/careers',
    applicantCount: 112,
    isActive: true
  },
  {
    title: 'AI Research Engineer (LLM Alignment & RAG)',
    company: 'OpenAI',
    companyLogo: 'https://logo.clearbit.com/openai.com',
    companyWebsite: 'https://openai.com',
    location: 'San Francisco, CA / Remote',
    salary: '$190,000 - $260,000 / yr',
    jobType: 'full_time',
    category: 'AI & Data',
    experienceLevel: 'lead',
    requiredSkills: ['PyTorch', 'Python', 'Transformers', 'CUDA', 'Distributed Training', 'RLHF'],
    tags: ['Frontier AI', 'Deep Learning', 'S-Rank'],
    description: 'Work on post-training alignment, reinforcement learning from human feedback, and optimizing memory bandwidth for large multimodal models.',
    jobUrl: 'https://openai.com/careers',
    applicantCount: 245,
    isActive: true
  },
  {
    title: 'Contract Full Stack MERN Developer',
    company: 'Uber',
    companyLogo: 'https://logo.clearbit.com/uber.com',
    companyWebsite: 'https://uber.com',
    location: 'Remote / Hyderabad',
    salary: '$60 - $90 / hr',
    jobType: 'contract',
    category: 'Engineering',
    experienceLevel: 'mid',
    requiredSkills: ['MongoDB', 'Express', 'React', 'Node.js', 'Redis', 'Kafka'],
    tags: ['Mobility', 'MERN Stack', 'Contract'],
    description: 'Develop internal driver operations portals and fleet management analytics dashboards. 6-month contract with extension possibility.',
    jobUrl: 'https://uber.com/careers',
    applicantCount: 46,
    isActive: true
  }
];

/**
 * Seeds the database with curated and live jobs if empty or refreshes listings
 */
async function seedIfEmpty() {
  try {
    const count = await JobPosting.countDocuments();
    if (count > 0) {
      console.log(`📦 Database has ${count} job postings ready.`);
      return false;
    }

    console.log('📡 Seeding database with curated tech opportunities...');
    await JobPosting.insertMany(CURATED_JOBS);
    console.log(`✅ Seeded ${CURATED_JOBS.length} curated opportunities.`);

    // Optionally augment with live Remotive API jobs in background
    try {
      const remotiveJobs = await remotiveService.fetchAndTransform(10);
      if (remotiveJobs && remotiveJobs.length > 0) {
        const transformed = remotiveJobs.map(j => ({
          title: j.title,
          company: j.company,
          companyLogo: j.companyLogo || `https://logo.clearbit.com/${j.company.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
          location: j.location || 'Remote',
          salary: j.salary || 'Competitive',
          jobType: j.jobType || 'full_time',
          category: j.category || 'Engineering',
          experienceLevel: 'mid',
          requiredSkills: j.tags && j.tags.length > 0 ? j.tags : ['JavaScript', 'Web Development'],
          tags: j.tags || [],
          description: j.description || '',
          jobUrl: j.jobUrl || 'https://remotive.com',
          source: 'remotive',
          externalId: j.externalId,
          applicantCount: Math.floor(Math.random() * 30) + 5,
          isActive: true
        }));
        await JobPosting.insertMany(transformed, { ordered: false });
        console.log(`✅ Augmented with ${transformed.length} live remote postings.`);
      }
    } catch (e) {
      console.log('ℹ️ Live API sync skipped (curated jobs active)');
    }

    return true;
  } catch (error) {
    console.error('❌ JobPosting seed error:', error.message);
    return false;
  }
}

module.exports = { seedIfEmpty, CURATED_JOBS };
