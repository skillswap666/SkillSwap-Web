export interface User {
  id: string;
  name: string;
  email: string;
  credits: number;
  avatar?: string;
  bio?: string;
  skills: string[];
  totalWorkshopsHosted: number;
  totalWorkshopsAttended: number;
  rating: number;
  joinedAt: string;
}

export interface Facilitator {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
}

export interface Workshop {
  id: string;
  title: string;
  description: string;
  facilitatorId: string;
  facilitator: Facilitator;
  category: string;
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: number; // in minutes
  maxParticipants: number;
  currentParticipants: number;
  creditCost: number;
  creditReward: number; // for facilitator
  date: string;
  time: string;
  location: string;
  isOnline: boolean;
  tags: string[];
  image?: string;
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  participants: User[];
  materials?: string[];
  requirements?: string[];
}

export interface CreditTransaction {
  id: string;
  userId: string;
  workshopId: string;
  type: 'earned' | 'spent';
  amount: number;
  description: string;
  timestamp: string;
}

export interface Review {
  id: string;
  workshopId: string;
  reviewerId: string;
  reviewer: User;
  rating: number;
  comment: string;
  timestamp: string;
}
