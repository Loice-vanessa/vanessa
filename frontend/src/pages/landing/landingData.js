export const STATS = [
  { value: '4,800+', label: 'Patients served' },
  { value: '120+',   label: 'Specialist doctors' },
  { value: '98%',    label: 'Appointment kept rate' },
  { value: '24 / 7', label: 'Record access' },
];

export const FEATURES = [
  { icon: 'calendar',    title: 'Smart scheduling',        body: 'Browse real-time doctor availability and book appointments in under a minute — no phone calls, no waiting.' },
  { icon: 'file-text',   title: 'Unified medical records', body: 'Every diagnosis, prescription and clinical note lives in one secure place, accessible whenever you need it.' },
  { icon: 'shield',      title: 'Privacy by design',       body: 'Role-based access ensures patients see only their own data and doctors see only their assigned patients.' },
  { icon: 'stethoscope', title: 'Doctor portal',           body: 'Clinicians manage their schedule, confirm appointments and write records from a single, focused workspace.' },
  { icon: 'activity',    title: 'Health at a glance',      body: 'Dashboards surface what matters — upcoming visits, recent records, and key health stats — instantly.' },
  { icon: 'users',       title: 'Multi-role platform',     body: 'Patients, doctors and administrators each get a tailored experience built around their specific workflow.' },
];

export const STEPS = [
  { n: '01', title: 'Create your account',   body: 'Register as a patient in seconds. Your profile is private and secure from day one.' },
  { n: '02', title: 'Find the right doctor', body: 'Browse specialists by name or discipline and view their live availability calendar.' },
  { n: '03', title: 'Book an appointment',   body: 'Pick a slot that works for you. Confirmation is instant — no back-and-forth.' },
  { n: '04', title: 'Access your records',   body: "After your visit, your doctor writes the record directly into the platform. It's yours to keep." },
];

import doc1 from '../../assets/doc-1.png';
import doc2 from '../../assets/doc-2.png';
import doc3 from '../../assets/doc-3.png';
import doc4 from '../../assets/doc-4.png';

export const DOCTORS = [
  { name: 'Dr. Sarah Mutesi',       spec: 'Cardiology',       qual: 'MD',             img: doc1 },
  { name: 'Dr. James Mugisha',      spec: 'General Practice', qual: 'MBBS',           img: doc2 },
  { name: 'Dr. Aline Umutoni',      spec: 'Pediatrics',       qual: 'MD, Pediatrics', img: doc3 },
  { name: 'Dr. Patrick Niyonsenga', spec: 'Dermatology',      qual: 'MBChB',          img: doc4 },
];
