import { useSearchParams } from 'react-router-dom';
import CustomerLogin from './CustomerLogin';
import ProviderLogin from './ProviderLogin';
import AdminLogin from './AdminLogin';

/**
 * Login router — reads ?role= query param and renders the
 * appropriate role-specific login page.
 *
 * /login               → Customer login (default)
 * /login?role=CUSTOMER → Customer login
 * /login?role=PROVIDER → Provider login
 * /login?role=ADMIN    → Admin login
 */
export default function Login() {
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role')?.toUpperCase();

  if (role === 'ADMIN') return <AdminLogin />;
  if (role === 'PROVIDER') return <ProviderLogin />;
  return <CustomerLogin />;
}
