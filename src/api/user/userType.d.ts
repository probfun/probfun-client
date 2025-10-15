export interface User {
  id: string;
  username: string;
  classId: string;
  realName: string;
  gender: string;
  email: string;
  phone: string;
  school: string;
  major: string;
  grade: number;
  source: number;
  avatarUrl: string;
  role: number;
}

export interface UserPublic {
  id: string;
  realName: string;
  avatarUrl: string;
  username: string;
}
