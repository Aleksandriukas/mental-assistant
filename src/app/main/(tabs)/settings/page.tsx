import {Appbar, Button, Icon, List, Text} from 'react-native-paper';
import {AnimatedPressable, Stack} from '../../../../components';
import {supabase} from '../../../../lib/supabase';
import {useLinkTo} from '../../../../../charon';
import {useQueryClient} from '@tanstack/react-query';
import {View} from 'react-native';
import {useSafeContext} from '@sirse-dev/safe-context';
import {MainContext} from '../../../MainContext';

export default function DailyPage() {
  const linkTo = useLinkTo();

  const {setTheme, theme} = useSafeContext(MainContext);

  const queryClient = useQueryClient();

  return (
    <View style={{flex: 1}}>
      <Appbar.Header elevated>
        <Appbar.Content title="Settings" />
      </Appbar.Header>
      <Stack
        style={{
          flex: 1,
        }}>
        <ListItem
          onPress={() => {
            setTheme(theme === 'dark' ? 'light' : 'dark');
          }}
          iconComponent={
            <Icon
              size={24}
              source={
                theme === 'dark' ? 'weather-night' : 'white-balance-sunny'
              }
            />
          }
          text={theme === 'dark' ? 'Dark mode' : 'Light mode'}
        />
        <Button
          mode="contained"
          onPress={async () => {
            await supabase.auth.signOut();
            queryClient.invalidateQueries();
            linkTo('/auth/login');
          }}>
          Log out
        </Button>
      </Stack>
    </View>
  );
}

type ListItemProps = {
  iconComponent: React.ReactNode;
  text: string;
  onPress?: () => void;
};

const ListItem = ({iconComponent, text, onPress}: ListItemProps) => {
  return (
    <AnimatedPressable onPress={onPress}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 24,
          paddingVertical: 12,
          width: '100%',
        }}>
        {iconComponent}
        <Text variant="titleMedium"> {text}</Text>
      </View>
    </AnimatedPressable>
  );
};
