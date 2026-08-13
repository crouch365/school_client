import { RouterProvider } from 'react-router-dom';

import { router } from '@/app/router/routeConfig';

export const App = () => <RouterProvider router={router} />;
