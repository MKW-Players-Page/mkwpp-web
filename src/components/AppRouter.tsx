import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';

import App from './App';
import { Pages } from './pages/Pages';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <App />,
      children: [
        ...Object.values(Pages),
        {
          path: '*',
          element: <Navigate to="/" />
        },
      ]
    },
  ],
  {
    basename: '/mkw/',
  }
);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;
