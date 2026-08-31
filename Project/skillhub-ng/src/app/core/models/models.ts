export interface Course {
  _id: string;
  title: string;
  instructor: string;
  category: string;
  level: string;
  price: number;
  duration: string;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'student';
  phone?: string;
  imageUrl?: string;
  myCourses?: (string | Course)[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T = unknown> {
  status: 'success' | 'fail' | 'error';
  message?: string;
  token?: string;
  count?: number;
  data?: T;
}
