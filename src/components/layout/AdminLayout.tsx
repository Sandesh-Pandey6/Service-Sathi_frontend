// Thin pass-through so React Router can render admin child pages
// Each admin page now has its own self-contained AdminLayout with sidebar
import { Outlet } from 'react-router-dom';

export default function AdminRouteWrapper() {
  return <Outlet />;
}
