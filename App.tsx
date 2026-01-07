
// Ativar override de desenvolvimento se necessário
if (__DEV__ && process.env.FORCE_DEV_API === 'true') {
  require('./src/config/dev-override');
}

import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/contexts/AuthContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { PaperProvider } from 'react-native-paper';

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
      <AuthProvider>
          <NavigationContainer>
              <AppNavigator />
            </NavigationContainer>
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
