import * as React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Snackbar } from '@its/components';
import '../assets/styles/global.scss';

import Routers from './routes';

const queryClient = new QueryClient();
function App() {
  return (
    <div className='bg-base-200 min-h-screen flex flex-col' color-scheme='light'>
      <React.StrictMode>
        <QueryClientProvider client={queryClient}>
          <Snackbar>
            <Routers />
          </Snackbar>
        </QueryClientProvider>
      </React.StrictMode>
    </div>
  );
}

export default App;
