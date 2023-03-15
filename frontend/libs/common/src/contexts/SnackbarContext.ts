/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react';

type Context = {
  open: (_message: string, _variant: string) => void;
};

export const SnackbarContext = React.createContext<Context | null>(null);
