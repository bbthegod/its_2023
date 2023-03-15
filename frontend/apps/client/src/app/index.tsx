import * as React from 'react';
import { Snackbar } from '@its/components';
import '../assets/styles/global.scss';

import Routers from './routes';

function App() {
  return (
    <div className='bg-base-200 h-screen flex flex-col' color-scheme='light'>
      <React.StrictMode>
        <Snackbar>
          <Routers /> 
        </Snackbar>
      </React.StrictMode>
    </div>
  );
}

export default App;
