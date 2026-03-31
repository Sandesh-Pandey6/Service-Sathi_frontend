// src/data/adminMockData.ts

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: 'CUSTOMER' | 'PROVIDER' | 'ADMIN';
  city: string;
  bookings: number;
  status: 'Active' | 'Inactive' | 'Banned';
  joinedDate: string;
  avatar: string;
}

export interface Provider {
  id: string;
  name: string;
  email: string;
  category: string;
  city: string;
  experience: string;
  rating: number;
  status: 'verified' | 'pending' | 'rejected' | 'suspended';
  totalServices: number;
  jobs: number;
  revenue: string;
  joinedDate: string;
}

export interface Service {
  id: string;
  name: string;
  category: string;
  provider: string;
  price: number;
  status: 'active' | 'inactive';
  bookings: number;
  createdAt: string;
}

export interface Booking {
  id: string;
  customer: string;
  provider: string;
  service: string;
  date: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  amount: number;
}

export interface Payment {
  id: string;
  transactionId: string;
  customer: string;
  provider: string;
  amount: number;
  method: 'card' | 'cash' | 'wallet';
  status: 'paid' | 'pending' | 'refunded';
  date: string;
}

export interface Review {
  id: string;
  customer: string;
  service: string;
  provider: string;
  rating: number;
  text: string;
  date: string;
  status: 'published' | 'hidden' | 'reported';
}

export const mockUsers: User[] = [
  { id: 'u1', name: 'Anita Sharma', email: 'anita@email.com', city: 'Kathmandu', bookings: 14, status: 'Active', joinedDate: 'Jan 2025', avatar: 'AS' },
  { id: 'u2', name: 'Bikram Karki', email: 'bikram@email.com', city: 'Pokhara', bookings: 7, status: 'Active', joinedDate: 'Feb 2025', avatar: 'BK' },
  { id: 'u3', name: 'Priya Gurung', email: 'priya@email.com', city: 'Lalitpur', bookings: 3, status: 'Inactive', joinedDate: 'Mar 2025', avatar: 'PG' },
  { id: 'u4', name: 'Ramesh Thapa', email: 'ramesh@email.com', city: 'Biratnagar', bookings: 21, status: 'Active', joinedDate: 'Jan 2025', avatar: 'RT' },
  { id: 'u5', name: 'Sunita Rai', email: 'sunita@email.com', city: 'Bhaktapur', bookings: 2, status: 'Banned', joinedDate: 'Apr 2025', avatar: 'SR' },
  { id: 'u6', name: 'Deepak KC', email: 'deepak@email.com', city: 'Dharan', bookings: 9, status: 'Active', joinedDate: 'Feb 2025', avatar: 'DK' },
];

export const mockProviders: Provider[] = [
  { id: 'p1', name: 'Ram Shrestha',     email: 'ram@gmail.com',     category: 'Electrician', city: 'Kathmandu',  experience: '6 years', rating: 4.8, status: 'verified',  totalServices: 24, jobs: 142, revenue: 'Rs1.4L', joinedDate: '2025-02-20' },
  { id: 'p2', name: 'Sita Tamang',      email: 'sita@gmail.com',    category: 'Beautician',  city: 'Lalitpur',   experience: '4 years', rating: 4.6, status: 'verified',  totalServices: 18, jobs: 98,  revenue: 'Rs76K',  joinedDate: '2025-03-18' },
  { id: 'p3', name: 'Dipesh Magar',     email: 'dipesh@gmail.com',  category: 'Mechanic',    city: 'Pokhara',    experience: '7 years', rating: 4.9, status: 'pending',   totalServices: 12, jobs: 64,  revenue: 'Rs92K',  joinedDate: '2025-04-22' },
  { id: 'p4', name: 'Anita Gurung',     email: 'anita@gmail.com',   category: 'Electrician', city: 'Biratnagar', experience: '3 years', rating: 4.7, status: 'verified',  totalServices: 9,  jobs: 31,  revenue: 'Rs38K',  joinedDate: '2025-05-10' },
  { id: 'p5', name: 'Bikram Tamang',    email: 'bikram@gmail.com',  category: 'Carpenter',   city: 'Bhaktapur',  experience: '5 years', rating: 4.3, status: 'suspended', totalServices: 7,  jobs: 22,  revenue: 'Rs28K',  joinedDate: '2025-05-18' },
  { id: 'p6', name: 'Sunita KC',        email: 'sunita@gmail.com',  category: 'Plumber',     city: 'Butwal',     experience: '2 years', rating: 3.5, status: 'pending',   totalServices: 3,  jobs: 15,  revenue: 'Rs18K',  joinedDate: '2025-06-01' },
];

export const mockServices: Service[] = [
  { id: 's1', name: 'Home Deep Cleaning', category: 'Cleaning', provider: 'Anita Sharma', price: 2500, status: 'active', bookings: 34, createdAt: '2025-02-21' },
  { id: 's2', name: 'Pipe Leak Repair', category: 'Plumbing', provider: 'Nisha Rai', price: 1800, status: 'active', bookings: 22, createdAt: '2025-03-19' },
  { id: 's3', name: 'Wiring Installation', category: 'Electrical', provider: 'Prabhat Joshi', price: 3200, status: 'inactive', bookings: 11, createdAt: '2025-04-25' },
  { id: 's4', name: 'Furniture Assembly', category: 'Carpentry', provider: 'Ramesh Bhandari', price: 1500, status: 'active', bookings: 18, createdAt: '2025-05-11' },
  { id: 's5', name: 'Interior Painting', category: 'Painting', provider: 'Deepak Karki', price: 4500, status: 'inactive', bookings: 7, createdAt: '2025-05-20' },
];

export const mockBookings: Booking[] = [
  { id: 'b1001', customer: 'Sandesh Pandey', provider: 'Anita Sharma', service: 'Home Deep Cleaning', date: '2025-06-10', status: 'completed', amount: 2500 },
  { id: 'b1002', customer: 'Rajan KC', provider: 'Nisha Rai', service: 'Pipe Leak Repair', date: '2025-06-12', status: 'confirmed', amount: 1800 },
  { id: 'b1003', customer: 'Sita Tamang', provider: 'Prabhat Joshi', service: 'Wiring Installation', date: '2025-06-15', status: 'pending', amount: 3200 },
  { id: 'b1004', customer: 'Maya Gurung', provider: 'Anita Sharma', service: 'Home Deep Cleaning', date: '2025-06-08', status: 'cancelled', amount: 2500 },
  { id: 'b1005', customer: 'Bikash Thapa', provider: 'Ramesh Bhandari', service: 'Furniture Assembly', date: '2025-06-18', status: 'pending', amount: 1500 },
  { id: 'b1006', customer: 'Sandesh Pandey', provider: 'Deepak Karki', service: 'Interior Painting', date: '2025-06-20', status: 'confirmed', amount: 4500 },
];

export const mockPayments: Payment[] = [
  { id: 'pay1', transactionId: 'TXN-001-2025', customer: 'Sandesh Pandey', provider: 'Anita Sharma', amount: 2500, method: 'card', status: 'paid', date: '2025-06-10' },
  { id: 'pay2', transactionId: 'TXN-002-2025', customer: 'Rajan KC', provider: 'Nisha Rai', amount: 1800, method: 'wallet', status: 'paid', date: '2025-06-12' },
  { id: 'pay3', transactionId: 'TXN-003-2025', customer: 'Sita Tamang', provider: 'Prabhat Joshi', amount: 3200, method: 'cash', status: 'pending', date: '2025-06-15' },
  { id: 'pay4', transactionId: 'TXN-004-2025', customer: 'Maya Gurung', provider: 'Anita Sharma', amount: 2500, method: 'card', status: 'refunded', date: '2025-06-09' },
  { id: 'pay5', transactionId: 'TXN-005-2025', customer: 'Bikash Thapa', provider: 'Ramesh Bhandari', amount: 1500, method: 'wallet', status: 'pending', date: '2025-06-18' },
];

export const mockReviews: Review[] = [
  { id: 'r1', customer: 'Sandesh Pandey', service: 'Home Deep Cleaning', provider: 'Anita Sharma', rating: 5, text: 'Excellent service! Very professional and thorough.', date: '2025-06-11', status: 'published' },
  { id: 'r2', customer: 'Rajan KC', service: 'Pipe Leak Repair', provider: 'Nisha Rai', rating: 4, text: 'Good work, fixed the issue quickly.', date: '2025-06-13', status: 'published' },
  { id: 'r3', customer: 'Bikash Thapa', service: 'Furniture Assembly', provider: 'Ramesh Bhandari', rating: 2, text: 'Parts were missing, took too long.', date: '2025-06-19', status: 'reported' },
  { id: 'r4', customer: 'Sita Tamang', service: 'Interior Painting', provider: 'Deepak Karki', rating: 3, text: 'Average work, could be better.', date: '2025-06-14', status: 'hidden' },
  { id: 'r5', customer: 'Maya Gurung', service: 'Home Deep Cleaning', provider: 'Anita Sharma', rating: 5, text: 'Amazing! House looks spotless.', date: '2025-06-09', status: 'published' },
];
