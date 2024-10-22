import {TextInput} from 'react-native-paper';
import {StringInputProps, StringInput} from '../StringInput';
import {useState} from 'react';

export type PasswordInputProps = {} & StringInputProps;

export const PasswordInput = (props: PasswordInputProps) => {
  const [visible, setVisible] = useState(false);

  return (
    <StringInput
      secureTextEntry={!visible}
      label="Password"
      rules={{
        minLength: {
          value: 8,
          message: 'Password must be at least 8 characters',
        },
      }}
      required
      right={
        <TextInput.Icon
          onPress={() => {
            setVisible(old => !old);
          }}
          icon={visible ? 'eye' : 'eye-off'}
        />
      }
      {...props}
    />
  );
};
