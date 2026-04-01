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

export interface ServiceCategory {
  id: string;
  name: string;
  providers: number;
  bookings: string | number;
  revenue: string;
  status: 'active' | 'disabled';
}

export interface Booking {
  id: string;
  customer: string;
  provider: string;
  service: string;
  date: string;
  location: string;
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
  status: 'published' | 'hidden' | 'flagged';
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

export const mockServiceCategories: ServiceCategory[] = [
  { id: 'c1', name: 'Electrician', providers: 312, bookings: '1,842', revenue: 'Rs2.1L', status: 'active' },
  { id: 'c2', name: 'Plumber', providers: 248, bookings: '1,423', revenue: 'Rs1.6L', status: 'active' },
  { id: 'c3', name: 'Beautician', providers: 195, bookings: '1,201', revenue: 'Rs98K', status: 'active' },
  { id: 'c4', name: 'Mechanic', providers: 142, bookings: 934, revenue: 'Rs1.1L', status: 'active' },
  { id: 'c5', name: 'Carpenter', providers: 98, bookings: 612, revenue: 'Rs72K', status: 'active' },
  { id: 'c6', name: 'AC Repair', providers: 76, bookings: 441, revenue: 'Rs53K', status: 'active' },
  { id: 'c7', name: 'Painter', providers: 61, bookings: 382, revenue: 'Rs44K', status: 'disabled' },
  { id: 'c8', name: 'Gardener', providers: 44, bookings: 213, revenue: 'Rs25K', status: 'active' },
];

export const mockBookings: Booking[] = [
  { id: 'B5921', customer: 'Anita Sharma', provider: 'Ram Shrestha', service: 'Electrician', date: 'Today 10:00', location: 'Kathmandu', status: 'confirmed', amount: 1050 },
  { id: 'B5920', customer: 'Bikram Karki', provider: 'Sita Tamang', service: 'Beautician', date: 'Today 09:30', location: 'Kathmandu', status: 'completed', amount: 800 },
  { id: 'B5919', customer: 'Priya Gurung', provider: 'Dipesh Magar', service: 'Plumber', date: 'Today 08:15', location: 'Kathmandu', status: 'pending', amount: 950 },
  { id: 'B5918', customer: 'Ramesh Thapa', provider: 'Anita Gurung', service: 'Mechanic', date: 'Yesterday', location: 'Kathmandu', status: 'completed', amount: 1200 },
  { id: 'B5917', customer: 'Sunita Rai', provider: 'Bikram Tamang', service: 'Carpenter', date: 'Yesterday', location: 'Kathmandu', status: 'cancelled', amount: 700 },
  { id: 'B5916', customer: 'Anita Sharma', provider: 'Ram Shrestha', service: 'Electrician', date: 'Today 10:00', location: 'Kathmandu', status: 'confirmed', amount: 1050 },
  { id: 'B5915', customer: 'Bikram Karki', provider: 'Sita Tamang', service: 'Beautician', date: 'Today 09:30', location: 'Kathmandu', status: 'completed', amount: 800 },
  { id: 'B5914', customer: 'Priya Gurung', provider: 'Dipesh Magar', service: 'Plumber', date: 'Today 08:15', location: 'Kathmandu', status: 'pending', amount: 950 },
];

export const mockPayments: Payment[] = [
  { id: 'pay1', transactionId: 'TXN-001-2025', customer: 'Sandesh Pandey', provider: 'Anita Sharma', amount: 2500, method: 'card', status: 'paid', date: '2025-06-10' },
  { id: 'pay2', transactionId: 'TXN-002-2025', customer: 'Rajan KC', provider: 'Nisha Rai', amount: 1800, method: 'wallet', status: 'paid', date: '2025-06-12' },
  { id: 'pay3', transactionId: 'TXN-003-2025', customer: 'Sita Tamang', provider: 'Prabhat Joshi', amount: 3200, method: 'cash', status: 'pending', date: '2025-06-15' },
  { id: 'pay4', transactionId: 'TXN-004-2025', customer: 'Maya Gurung', provider: 'Anita Sharma', amount: 2500, method: 'card', status: 'refunded', date: '2025-06-09' },
  { id: 'pay5', transactionId: 'TXN-005-2025', customer: 'Bikash Thapa', provider: 'Ramesh Bhandari', amount: 1500, method: 'wallet', status: 'pending', date: '2025-06-18' },
];

export const mockReviews: Review[] = [
  { id: 'r1', customer: 'Anita Sharma', provider: 'Ram Shrestha', service: 'Electrician', rating: 5, text: 'Excellent work, very professional!', date: 'Today', status: 'published' },
  { id: 'r2', customer: 'Bikram Karki', provider: 'Sita Tamang', service: 'Beautician', rating: 4, text: 'Good service but slightly late.', date: 'Yesterday', status: 'published' },
  { id: 'r3', customer: 'Priya Gurung', provider: 'Dipesh Magar', service: 'Mechanic', rating: 2, text: 'Not satisfied. Poor quality work.', date: '2 days ago', status: 'flagged' },
  { id: 'r4', customer: 'Ramesh Thapa', provider: 'Anita Gurung', service: 'Electrician', rating: 5, text: 'Very fast and clean. Highly recommend!', date: '3 days ago', status: 'published' },
  { id: 'r5', customer: 'Sunita Rai', provider: 'Bikram Tamang', service: 'Carpenter', rating: 1, text: 'Terrible experience, very rude.', date: '4 days ago', status: 'flagged' },
];
