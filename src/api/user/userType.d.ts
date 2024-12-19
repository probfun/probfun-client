export interface User {
  uid: string
  studentId: string
  classId: string
  nickname: string
  gender: string
  email: string
  phone: string
  school: string
  major: string
  grade: number
  avatarUrl: string
  role: integer
}

export interface UserPublic {
  uid: string
  nickname: string
  avatarUrl: string
  studentId: string
}
