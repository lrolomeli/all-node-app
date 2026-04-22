import selfie from './assets/images/yo.jpg';
import conti from './assets/images/conti.png';
import ppg from './assets/images/PPG.png';
import uag from './assets/images/uag.png';
import iteso from './assets/images/iteso.png';

export const me = 
  {
    logo: selfie,
  }


export const experience = [
  {
    company: 'Self-employed',
    role: 'Freelance Software Engineer',
    dates: 'Jan 2025 — Present',
    logo: null,
    bullets: [
      'Integrated ERP (Odoo) systems with custom APIs and business workflows to support production and operational processes.',
      'Designed data pipelines for production, inventory, and logistics systems, improving operational efficiency through automation and data-driven tools.',
      'Developed internal platforms enabling real-time access to structured business data and documentation.',
      'Collaborated with cross-functional teams (production and warehouse) to align software solutions with business needs.',
      'Developed automation scripts and data processing tools using Python.',
      'Containerized applications using Docker and Docker Compose and deployed in cloud-like environments.',
    ],
  },
  {
    company: 'Continental Automotive',
    role: 'Software Engineer',
    dates: 'May 2022 — Aug 2024',
    logo: conti,
    bullets: [
      'Developed high-reliability software systems in C/C++ for real-time environments (FreeRTOS, OSEK).',
      'Applied system design and performance optimization to reduce failures related to energy consumption by 15%.',
      'Validated system behavior using CI/CD pipelines and Hardware-in-the-Loop (HIL).',
      'Collaborated with cross-functional teams to ensure system integration, reliability, and quality.',
    ],
  },
  {
    company: 'Plasticos Plasa de Guadalajara',
    role: 'Technical Manager',
    dates: 'Jan 2020 — May 2022',
    logo: ppg,
    bullets: [
      'Engineered automated data pipelines using Google Apps Script and Python to transform operational data into production-ready outputs.',
      'Maintained and optimized industrial machinery ensuring continuous production.',
      'Integrated PLC systems with sensors and actuators to improve production cycle times.',
      'Bridged software and hardware systems to enable better data visibility and decision-making.',
    ],
  },
]

export const education = [
  {
    school: 'Universidad Autónoma de Guadalajara',
    degree: "Master's Degree in Computer Science",
    dates: 'May 2023 — May 2025',
    logo: uag,
    description: 'GPA: 9.7. Specialization in data-driven predictive systems using Industrial IoT.',
  },
  {
    school: 'ITESO — Instituto Tecnológico de Estudios Superiores de Occidente',
    degree: "Bachelor's Degree in Electronics Engineering",
    dates: 'Aug 2014 — Dec 2019',
    logo: iteso,
    description: 'GPA: 8.1. Focus on Embedded Software, Control, and Communication Systems.',
  },
]

export const skills = [
  { icon: '💻', title: 'Programming',     tags: ['Python', 'JavaScript', 'C/C++', 'Java', 'Bash', 'SQL'] },
  { icon: '🎨', title: 'Frontend',        tags: ['React', 'HTML/CSS', 'Tailwind', 'Bootstrap'] },
  { icon: '⚙️', title: 'Backend',         tags: ['Node.js / Express', 'REST APIs', 'PostgreSQL', 'Scripting & Automation'] },
  { icon: '📊', title: 'Data',            tags: ['Data Pipelines', 'Data Transformation', 'Structured/Unstructured Data', 'Basic Analysis'] },
  { icon: '☁️', title: 'Cloud & DevOps', tags: ['Docker', 'Docker Compose', 'AWS Basics', 'Nginx', 'CI/CD'] },
  { icon: '🛠',  title: 'Tools & Methods',tags: ['Git/GitHub', 'Jenkins', 'VSCode', 'JIRA', 'Agile/Scrum'] },
  { icon: '🔧', title: 'Embedded',        tags: ['FreeRTOS', 'OSEK RTOS', 'ARM Cortex', 'Bare-metal', 'PCB Design', '3D Printing'] },
  { icon: '🌍', title: 'Languages',       tags: ['Spanish — Native', 'English — Professional'] },
]

export const projects = [
  {
    title: 'Grocery Ordering Platform',
    tech: 'React · Node.js · PostgreSQL · JWT/Firebase · Docker',
    dates: 'Jan 2025 — Present',
    description: 'Full-stack web application to coordinate weekly grocery orders with role-based admin dashboard, REST APIs, and self-hosted deployment via Docker, Nginx, and Cloudflare.',
    links: [],
  },
  {
    title: 'Inventory WebApp',
    tech: 'Python · Flask · SQLite · Docker',
    dates: 'Jan 2026 — Present',
    description: 'Dockerized web inventory service for a cosmetic enterprise with full CRUD operations.',
    links: [{ label: 'View on GitHub →', href: 'https://github.com/luisrlppg/inventory-PPG' }],
  },
  {
    title: 'Self-Hosted WebApp',
    tech: 'Zero Trust Tunnels · NodeJS & ExpressJS',
    dates: 'Aug 2022 — Present',
    description: 'Personal webapp self-hosted on a Linux Nginx server, exposed to the internet via Cloudflare zero trust tunnels.',
    links: [
      { label: 'View on GitHub →', href: 'https://github.com/lrolomeli/all-node-app' },
      { label: 'Visit Web App →', href: 'https://luisrlp.com' },
    ],
  },
  {
    title: 'Frontend-Only Intranet',
    tech: 'JS · CSS · HTML · Docker',
    dates: 'Jan 2025 — Jan 2026',
    description: 'Dockerized web interface portal to access important information within the company.',
    links: [{ label: 'View on GitHub →', href: 'https://github.com/luisrlppg/inventory-PPG' }],
  },
  {
    title: 'Chat App (Java RMI)',
    tech: 'Java · RMI · Distributed Systems',
    dates: 'Oct 2023 — Dec 2023',
    description: 'Client-server chat application built with Java RMI for distributed communication.',
    links: [{ label: 'View on GitHub →', href: 'https://github.com/lrolomeli/javaRMI-Chat' }],
  },
  {
    title: 'Fingerprint Payment',
    tech: 'Java · Swing · SQL Server · MVC',
    dates: 'Aug 2019 — Sep 2019',
    description: 'Proof of concept for digital payment using fingerprint scanner with Digital Persona SDK.',
    links: [{ label: 'View on GitHub →', href: 'https://github.com/lrolomeli/HuellaDigitalMetodoPago' }],
  },
]

export const certifications = [
  { icon: '📜', title: 'SAFe 6.0 for Teams / DevOps', tags: ['Scaled Agile', 'Apr 2024'] },
]

export const about = [
  { icon: '⚡', title: 'Sports',   tags: ['Volleyball', 'Soccer', 'Running', 'Calisthenics', 'Gym'] },
  { icon: '📺', title: 'TV Shows', tags: ['Seinfeld', 'Demon Slayer', 'Avatar TLA'] },
  { icon: '🎮', title: 'Games',    tags: ['Maplestory', 'Super Mario', 'Pokemon'] },
  { icon: '🎵', title: 'Art',      tags: ['Piano'] },
]
