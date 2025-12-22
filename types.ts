
import { ReactNode } from 'react';

export interface NavLink {
  name: string;
  path: string;
}

export interface Feature {
  title: string;
  description: string;
  icon: ReactNode;
  color: 'cyan' | 'amber' | 'white';
}

export interface ResearchPaper {
  authors: string;
  year: number;
  title: string;
  focus: string;
}

export interface ArchitectureModule {
  id: string;
  name: string;
  hardware: string;
  role: string;
  responsibilities: string[];
}
