import {Appbar, Button, Text, useTheme} from 'react-native-paper';
import {Stack, StringInput} from '../../../components';
import {Resolver, useForm} from 'react-hook-form';
import {KeyboardAvoidingView, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {useLinkTo} from '../../../../charon';

type FormValues = {
  name: String;
  surname: String;
  email: String;
  password: String;
  rPassword: String;
};

export default function AuthPage() {
  const {control, handleSubmit} = useForm<FormValues>({
    defaultValues: {
      name: '',
      surname: '',
      email: '',
      password: '',
      rPassword: '',
    },
  });

  const onSubmit = (data: FormValues) => {
    //
  };

  const {goBack} = useNavigation();
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
