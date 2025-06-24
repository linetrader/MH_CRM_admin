// src/types/User.ts
export interface User {
  id: string;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  status: string; // active, inactive
  referrer: string | null;
  userLevel: string;
  createdAt: string; // createdAt이 포함된 타입
}
