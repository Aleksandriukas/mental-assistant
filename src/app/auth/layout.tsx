import {PropsWithChildren, useState} from 'react';
import {Snackbar} from 'react-native-paper';
import {AuthContext} from './AuthContext';

export default function AuthLayout({children}: PropsWithChildren<{}>) {
  const [message, setMessage] = useState<string>('');
  const [visible, setVisible] = useState<boolean>(false);

  const showSnackbar = (message: string, type: 'info' | 'error') => {
    setMessage(message);
    setVisible(true);
  };

  return (
    <AuthContext.Provider value={{showSnackbar}}>
      {children}
      <Snackbar
        theme={{dark: false}}
        visible={visible}
        onDismiss={() => {
          setVisible(false);
        }}
        action={{
          label: 'Close',
          onPress: () => {
            setVisible(false);
          },
        }}>
        {message}
      </Snackbar>
    </AuthContext.Provider>
  );
}
