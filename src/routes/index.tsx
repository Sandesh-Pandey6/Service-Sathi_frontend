import { Navigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import HomePage from '@/pages/HomePage';

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
