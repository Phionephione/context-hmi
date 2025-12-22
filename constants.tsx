
import React from 'react';
import { Cpu, Eye, Activity, Zap, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Feature, ResearchPaper, ArchitectureModule } from './types';

export const NAV_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'Problem', path: '/about' },
  { name: 'Architecture', path: '/architecture' },
  { name: 'Simulation', path: '/simulation' },
  { name: 'Methodology', path: '/methodology' },
  { name: 'Results', path: '/results' },
];

export const HIGHLIGHTS: Feature[] = [
  {
    title: 'Real-Time Monitoring',
    description: 'NVIDIA Jetson Nano powered AI models for gaze tracking, drowsiness, and head orientation detection.',
    icon: <Eye className="w-8 h-8" />,
    color: 'cyan'
  },
  {
    title: 'Context Analysis',
    description: 'Raspberry Pi 4 integrating GPS, Speed, and IMU data to evaluate external driving environments.',
    icon: <Activity className="w-8 h-8" />,
    color: 'white'
  },
  {
    title: 'Multi-Modal Alerts',
    description: 'STM32 Nucleo driven haptics and audio feedback for low-latency transition requests.',
    icon: <Zap className="w-8 h-8" />,
    color: 'amber'
  }
];

export const PAIN_POINTS = [
  { title: 'Static Rule Bases', desc: 'Current HMIs ignore the driver’s current cognitive state.' },
  { title: 'Delayed Take-Over (TOR)', desc: 'Transition requests are often too late for effective human reaction.' },
  { title: 'Transparency Gaps', desc: 'Drivers lack clear reasoning behind system-initiated transitions.' },
  { title: 'High Workload', desc: 'Existing systems overwhelm drivers with excessive or vague alerts.' }
];

export const ARCHITECTURE_MODULES: ArchitectureModule[] = [
  {
    id: 'module1',
    name: 'Driver Monitoring',
    hardware: 'NVIDIA Jetson Nano',
    role: 'The "Eyes"',
    responsibilities: [
      'Facial landmark detection via MediaPipe',
      'Eye Gaze Tracking (In-attentiveness detection)',
      'PERCLOS Drowsiness scoring',
      'Head Pose Orientation analysis'
    ]
  },
  {
    id: 'module2',
    name: 'Decision Core',
    hardware: 'Raspberry Pi 4',
    role: 'The "Brain"',
    responsibilities: [
      'Sensor Fusion (GPS + IMU + Speed)',
      'Environmental Complexity Evaluation',
      'Fuzzy Logic for Alert Severity',
      'Data Logging & System Sync'
    ]
  },
  {
    id: 'module3',
    name: 'Feedback Control',
    hardware: 'STM32 Nucleo-F401RE',
    role: 'The "Reflexes"',
    responsibilities: [
      'Low-latency PWM for Haptic Motors',
      'Multi-color RGB Visual Alerts',
      'Frequency-modulated Buzzer tones',
      'Hardware-level Safety Interrupts'
    ]
  }
];

export const LITERATURE_REVIEW: ResearchPaper[] = [
  {
    authors: 'Wintersberger et al.',
    year: 2021,
    title: 'Multi-modal interfaces for transitions',
    focus: 'Combining haptics and visual cues to reduce reaction time.'
  },
  {
    authors: 'Eriksson & Stanton',
    year: 2017,
    title: 'Take-over time variability',
    focus: 'Analysis of how secondary tasks impact transition safety.'
  },
  {
    authors: 'Walch et al.',
    year: 2018,
    title: 'Cooperative HMI Design',
    focus: 'Strategies for establishing trust between driver and vehicle AI.'
  }
];

export const RESULTS_CHECKLIST = [
  'Reduced Take-Over Time (TOR) by ~25%',
  'Increased Driver Trust Score (SATI Scale)',
  'Scalable ARM-based Embedded Architecture',
  'Modular Sensor Integration Framework'
];
