// routes/index.tsx — Exports only a React component for HMR compatibility
import { useRoutes } from 'react-router-dom';
import { routes } from './config';

export default function AppRoutes() {
  return useRoutes(routes);
}

// Re-export routes for any consumers that need the raw config
export { routes } from './config';
