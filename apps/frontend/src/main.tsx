import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';

import { AgentChat } from './components/AgentChat';
import { MainLayout } from './components/MainLayout';
import { AbidusAnalysis } from './pages/AbidusAnalysis';
import { Dashboard } from './pages/Dashboard';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <AgentChat />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'abidus-analysis',
        element: <AbidusAnalysis />,
      },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
