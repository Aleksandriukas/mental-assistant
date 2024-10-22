import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import {Router} from './charon';
import {fetchUserData} from './src/utils/fetchUserData';

const context = require.context(
  './src/app',
  true,
  // Ignore root `./+html.js` and API route files `./generate+api.tsx`.
  /^(?:\.\/)(?!(?:(?:(?:.*\+api)|(?:\+html)))\.[tj]sx?$).*\.[tj]sx?$/,
);

export default function App() {
  return (
    <Router
      context={context}
      linking={{
        prefixes: ['MentalAssistant://'],
        getInitialURL: async () => {
          const metaData = await fetchUserData();

          if (metaData) {
            console.log('yes');
            return 'MentalAssistant://main/home';
          }
          return 'MentalAssistant://auth';
        },
      }}
    />
  );
}

AppRegistry.registerComponent(appName, () => App);
