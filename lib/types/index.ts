/**
 * User type definition
 */
export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: Date;
}

/**
 * Poll option type definition
 */
export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

/**
 * Poll type definition
 */
export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  createdBy: string; // User ID
  createdAt: Date;
  expiresAt?: Date;
  isActive: boolean;
}

/**
 * Vote type definition
 */
export interface Vote {
  id: string;
  pollId: string;
  optionId: string;
  voterId?: string; // Optional for anonymous votes
  createdAt: Date;
  ipAddress?: string; // For preventing duplicate votes
}

/**
 * Share link type definition
 */
export interface ShareLink {
  id: string;
  pollId: string;
  url: string;
  qrCodeUrl?: string;
  createdAt: Date;
}