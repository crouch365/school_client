import type { ReactNode } from 'react';
import { Provider } from 'react-redux';

import { SessionVerifier } from './SessionVerifier';
import { store } from './store';

export const StoreProvider = ({ children }: { children: ReactNode }) => (
  <Provider store={store}>
    <SessionVerifier />
    {children}
  </Provider>
);
