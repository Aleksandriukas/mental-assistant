import {createContext} from 'react';

export const AuthContext = createContext({
  showSnackbar: (message: string, type: 'info' | 'error') => {},
});
