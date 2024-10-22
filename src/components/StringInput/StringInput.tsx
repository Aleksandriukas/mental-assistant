import {HelperText, TextInput, TextInputProps} from 'react-native-paper';
import {Controller} from 'react-hook-form';
import Animated, {FadeIn} from 'react-native-reanimated';

export type StringInputProps = {
  helperText?: String;
  control: any;
  name: string;
  required?: boolean;
} & Omit<TextInputProps, 'value' | 'onChangeText'>;

const requiredMessage = 'This field is required';

const getHelperMessage = (
  message: String,
  invalid: Boolean,
  helperText: String,
  required: Boolean,
) => {
  if (!invalid) {
    return helperText;
  }

  if (required) {
    return requiredMessage;
  }
  return message;
};

export const StringInput = ({
  control,
  defaultValue,
  helperText,
  name,
  required = false,
  ...props
}: StringInputProps) => {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      rules={{required: required}}
      render={({field, fieldState}) => {
        console.log(field, fieldState);
        return (
          <>
            <TextInput
              style={{flexDirection: 'row'}}
              value={field.value}
              onChangeText={field.onChange}
              onBlur={() => {
                fieldState.isTouched = true;
                field.onBlur();
              }}
              {...props}
            />
            <HelperText
              style={{alignSelf: 'flex-start'}}
              type={fieldState.invalid ? 'error' : 'info'}>
              {getHelperMessage(
                fieldState.error?.message ?? '',
                fieldState.invalid,
                helperText ?? '',
                required,
              )}
            </HelperText>
          </>
        );
      }}
    />
  );
};
