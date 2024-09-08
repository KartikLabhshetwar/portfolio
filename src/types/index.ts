// Project type
export interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  imageUrl: string;
  liveUrl: string;
  githubUrl: string;
}

// Skill type
export interface Skill {
  name: string;
  level: number;
  icon: string;
}

// Contact form data type
export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

// Navigation item type
export interface NavItem {
  label: string;
  href: string;
}

// Social media link type
export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

// Personal info type
export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  location: string;
  bio: string;
}

