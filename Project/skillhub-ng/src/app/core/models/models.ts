export interface Course {
  _id: string;
  title: string;
  instructor: string;
  category: string;
  level: string;
  price: number;
  duration: string;
  imageUrl?: string;
  /** Short marketing description shown in the detail panel */
  description?: string;
  /** Bullet-list outcomes shown in the detail panel */
  whatYouWillLearn?: string[];
  /** Prerequisites / requirements */
  requirements?: string[];
  /** Tools / software used in the course */
  tools?: string[];
  /** YouTube video ID or full URL for the preview clip */
  videoUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaymentRecord {
  courseId: string | Course;
  method: string;
  amount: number;
  date: string;
  status: string;
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
  payments?: PaymentRecord[];
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
