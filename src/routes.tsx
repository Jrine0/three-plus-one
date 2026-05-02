import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import AdminPage from './pages/AdminPage';
import type { ReactNode } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'Login',
    path: '/login',
    element: <LoginPage />,
    visible: false
  },
  {
    name: 'Dashboard',
    path: '/dashboard',
    element: <DashboardPage />
  },
  {
    name: 'Transactions',
    path: '/transactions',
    element: <TransactionsPage />
  },
  {
    name: 'Admin',
    path: '/admin',
    element: <AdminPage />,
    visible: false
  }
];

export default routes;
