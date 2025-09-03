export interface Lead {
  id: string;
  name: string;
  email: string;
  message: string;
  honeypot?: string;
  createdAt: Date;
  ip?: string;
  userAgent?: string;
}