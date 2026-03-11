import { Navigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';

// Pages - placeholder components
const HomePage = () => (
  <div className="container py-5">
    <h1>Service Sathi</h1>
    <p className="lead">Hire trusted home service providers</p>
    <p>Plumber, Electrician, Cleaner, Carpenter, Painter, AC Repair, Appliance Repair & more.</p>
  </div>
);

const ServicesPage = () => (
  <div className="container py-5">
    <h1>Services</h1>
    <p>Browse all available services.</p>
  </div>
);

const LoginPage = () => (
  <div className="container py-5">
    <h1>Login</h1>
    <p>Sign in to your account.</p>
  </div>
);

const RegisterPage = () => (
  <div className="container py-5">
    <h1>Register</h1>
    <p>Create a new account.</p>
  </div>
);

export const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'services', element: <ServicesPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
];
