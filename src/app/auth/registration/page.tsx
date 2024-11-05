import {Appbar, Button, Text, useTheme} from 'react-native-paper';
import {PasswordInput, Stack, StringInput} from '../../../components';
import {useForm} from 'react-hook-form';
import {useColorScheme, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {supabase} from '../../../lib/supabase';
import {useContext} from 'react';
import {AuthContext} from '../AuthContext';

type FormValues = {
  name: String;
  surname: String;
  email: String;
  password: String;
  rPassword: String;
};

export default function AuthPage() {
  const {goBack} = useNavigation();

  const {showSnackbar} = useContext(AuthContext);

  const {
    control,
    handleSubmit,
    setError,
    formState: {errors},
  } = useForm<FormValues>({
    defaultValues: {
      name: '',
      surname: '',
      email: '',
      password: '',
      rPassword: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (data.password !== data.rPassword) {
      setError('password', {
        type: 'registerFail',
        message: 'Passwords do not match!',
      });
      setError('rPassword', {
        type: 'registerFail',
        message: 'Passwords do not match!',
      });
      return;
    }
    const {error} = await supabase.auth.signUp({
      email: data.email.toString(),
      password: data.password.toString(),
      options: {
        data: {
          name: data.name.toString(),
          surname: data.surname.toString(),
        },
      },
    });
    if (error) {
      showSnackbar(error.message, 'error');
    } else {
      showSnackbar('Registration successful', 'info');
      goBack();
    }
  };

  return (
    <Stack style={{width: '100%', height: '100%'}}>
      <Appbar.Header elevated>
        <Appbar.BackAction onPress={() => goBack()} />
        <Appbar.Content title="Registration" />
      </Appbar.Header>
      <View
        style={{
          flex: 1,
          marginTop: 24,
          paddingHorizontal: 24,
        }}>
        <StringInput
          accessibilityLabel="Name"
          label="Name"
          required
          name="name"
          control={control}
        />
        <StringInput
          accessibilityLabel="Surname"
          label="Surname"
          required
          name="surname"
          control={control}
        />
        <StringInput
          accessibilityLabel="Email"
          rules={{
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Invalid email address',
            },
          }}
          label="Email"
          required
          name="email"
          control={control}
        />
        <PasswordInput
          accessibilityLabel="Password"
          name="password"
          control={control}
        />
        <PasswordInput
          accessibilityLabel="Repeat password"
          name="rPassword"
          control={control}
        />
        {errors.root?.serverError.type === 'registerFail' && (
          <Text
            style={{
              width: '100%',
              textAlign: 'center',
              padding: 16,
              color: 'red',
            }}>
            {errors.root?.serverError.message}
          </Text>
        )}
        <Button
          style={{width: '100%'}}
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          icon="alien-outline">
          Register
        </Button>
      </View>
    </Stack>
  );
}
