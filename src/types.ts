export interface User {
  id: string;
  name: string;
  email: string;
  age?: number;
  gender?: string;
  personalityType?: string;
  onboarded: boolean;
  role: 'user' | 'admin';
}

export interface ChatMessage {
  _id: string;
  userId: string;
  message: string;
  sender: 'user' | 'bot';
  sentiment?: string;
  timestamp: string;
}

export interface MoodEntry {
  _id: string;
  userId: string;
  mood: number;
  note: string;
  date: string;
}

export interface Feedback {
  _id: string;
  adminId: string;
  adminName: string;
  message: string;
  timestamp: string;
}
