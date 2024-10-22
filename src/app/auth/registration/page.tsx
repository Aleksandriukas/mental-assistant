import {Appbar, Button, Text, useTheme} from 'react-native-paper';
import {Stack, StringInput} from '../../../components';
import {Resolver, useForm} from 'react-hook-form';
import {KeyboardAvoidingView, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {supabase} from '../../../lib/supabase';

type FormValues = {
  name: String;
  surname: String;
  email: String;
  password: String;
  rPassword: String;
};

export default function AuthPage() {
  const {goBack} = useNavigation();

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
      setError('root.serverError', {
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
      setError('root.serverError', {
        type: 'registerFail',
        message: error.message,
      });
    } else {
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
        <StringInput label="Name" required name="name" control={control} />
        <StringInput
          label="Surname"
          required
          name="surname"
          control={control}
        />
        <StringInput label="Email" required name="email" control={control} />
        <StringInput
          label="Password"
          required
          name="password"
          control={control}
        />
        <StringInput
          label="Password"
          required
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
