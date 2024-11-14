import {Button, Text, useTheme} from 'react-native-paper';
import {PasswordInput, Stack, StringInput} from '../../../components';
import {useLinkTo} from '../../../../charon';
import {useForm} from 'react-hook-form';
import {TouchableOpacity, View, KeyboardAvoidingView} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {supabase} from '../../../lib/supabase';
import {deleteTestsFromMaestro} from '../../../service/resetMaestroAccount';
import {useQueryClient} from '@tanstack/react-query';

type FormValues = {
  email: String;
  password: String;
};

export default function AuthPage() {
  const linkTo = useLinkTo();

  const {
    control,
    handleSubmit,
    setError,
    formState: {errors},
  } = useForm<FormValues>({
    defaultValues: {email: '', password: ''},
  });

  const queryClient = useQueryClient();

  const onSubmit = async (data: FormValues) => {
    if (data.email.toString().toLowerCase() == 'maestro@gmail.com') {
      await deleteTestsFromMaestro();
    }
    const {error} = await supabase.auth.signInWithPassword({
      email: data.email.toString(),
      password: data.password.toString(),
    });
    if (error) {
      setError('email', {
        type: 'loginFail',
        message: error.message,
      });
      setError('password', {
        type: 'loginFail',
        message: error.message,
      });
    } else {
      linkTo('/main/home');
    }
  };

  const {bottom} = useSafeAreaInsets();

  return (
    <Stack
      style={{
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
      }}>
      <StringInput
        rules={{
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Invalid email address',
          },
        }}
        label="Email"
        accessibilityLabel="Email"
        required
        name="email"
        control={control}
      />
      <PasswordInput
        accessibilityLabel="Password"
        name="password"
        control={control}
      />
      <Button
        style={{width: '100%'}}
        mode="contained"
        onPress={handleSubmit(onSubmit)}>
        Sign in
      </Button>
      <View style={{position: 'absolute', bottom: bottom == 0 ? 16 : bottom}}>
        <TouchableOpacity
          onPress={() => {
            linkTo('/auth/registration');
          }}>
          <Text>Register now!</Text>
        </TouchableOpacity>
      </View>
    </Stack>
  );
}
