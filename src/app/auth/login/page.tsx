import {Button, Text, useTheme} from 'react-native-paper';
import {Stack, StringInput} from '../../../components';
import {useLinkTo} from '../../../../charon';
import {useForm} from 'react-hook-form';
import {TouchableOpacity, View, KeyboardAvoidingView} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';

type FormValues = {
  email: String;
  password: String;
};

export default function AuthPage() {
  const linkTo = useLinkTo();

  const {control, handleSubmit} = useForm<FormValues>({
    defaultValues: {email: '', password: ''},
  });

  const onSubmit = (data: FormValues) => {
    console.log(data);

    linkTo('/main/daily');
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
      <StringInput label="Email" required name="email" control={control} />
      <StringInput
        label="Password"
        required
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
