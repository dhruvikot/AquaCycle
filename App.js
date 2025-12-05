import 'react-native-gesture-handler';
import React, { useState, createContext, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert, Linking } from 'react-native';
import Receptor from './components/receptor';
import Classify from './components/classify';
import PastCollections from './components/pastcollections';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import calls from './services/calls';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#F5F7FA' }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#DC2626' }}>
            Something went wrong
          </Text>
          <Text style={{ fontSize: 14, color: '#6B7280', textAlign: 'center', marginBottom: 20 }}>
            {this.state.error?.toString() || 'Unknown error'}
          </Text>
          <TouchableOpacity
            style={{ backgroundColor: '#0038A8', padding: 12, borderRadius: 8 }}
            onPress={() => this.setState({ hasError: false, error: null })}
          >
            <Text style={{ color: '#FFFFFF', fontWeight: '600' }}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

// Create a context to manage the logged-in user
const UserContext = createContext();

// Home component - routes to appropriate home based on role
const Home = ({ navigation }) => {
  const { user } = useContext(UserContext);

  if (user?.role === 'admin') {
    return <AdminHome navigation={navigation} />;
  }
  return <DriverHome navigation={navigation} />;
};

// Admin Home component
const AdminHome = ({ navigation }) => {
  const { user } = useContext(UserContext);
  const ADMIN_URL = 'http://localhost:5173'; // Update this with your admin app URL

  const openAdminPanel = async () => {
    try {
      const supported = await Linking.canOpenURL(ADMIN_URL);
      if (supported) {
        await Linking.openURL(ADMIN_URL);
      } else {
        Alert.alert(
          'Cannot Open Admin Panel',
          'Please ensure the admin web application is running on ' + ADMIN_URL
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open admin panel: ' + error.message);
    }
  };

  return (
    <View style={styles.homeContainer}>
      <Text style={styles.welcomeText}>Welcome, {user?.name}</Text>
      <Text style={styles.roleText}>Administrator</Text>
      
      <TouchableOpacity
        style={[styles.homeButton, styles.adminButton]}
        onPress={openAdminPanel}
      >
        <Text style={styles.buttonText}>Open Admin Panel</Text>
      </TouchableOpacity>

      <View style={styles.divider}>
        <Text style={styles.dividerText}>Driver Functions</Text>
      </View>

      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => navigation.navigate('Collect')}
      >
        <Text style={styles.buttonText}>Collect</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => navigation.navigate('Classify')}
      >
        <Text style={styles.buttonText}>Materials Admin</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => navigation.navigate('PastCollections')}
      >
        <Text style={styles.buttonText}>Past Collections</Text>
      </TouchableOpacity>
    </View>
  );
};

// Driver Home component
const DriverHome = ({ navigation }) => {
  const { user } = useContext(UserContext);

  return (
    <View style={styles.homeContainer}>
      <Text style={styles.welcomeText}>Welcome, {user?.name}</Text>
      <Text style={styles.roleText}>Driver</Text>
      
      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => navigation.navigate('Collect')}
      >
        <Text style={styles.buttonText}>Collect</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => navigation.navigate('Classify')}
      >
        <Text style={styles.buttonText}>Materials Admin</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => navigation.navigate('PastCollections')}
      >
        <Text style={styles.buttonText}>Past Collections</Text>
      </TouchableOpacity>
    </View>
  );
};

// Login component with username and password
const LoginPage = ({ navigation }) => {
  const { setUser } = useContext(UserContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isDemoMode, setIsDemoMode] = useState(true); // Start in demo mode

  // Demo credentials with roles
  const demoCredentials = [
    { username: 'demo', password: 'demo123', name: 'Demo User', role: 'driver' },
    { username: 'admin', password: 'admin123', name: 'Admin User', role: 'admin' },
    { username: 'test', password: 'test123', name: 'Test User', role: 'driver' },
    { username: 'maria', password: 'maria123', name: 'Maria Rodriguez', role: 'driver' },
    { username: 'john', password: 'john123', name: 'John Smith', role: 'driver' },
    { username: 'sarah', password: 'sarah123', name: 'Sarah Johnson', role: 'driver' }
  ];

  const handleLogin = () => {
    // Check demo credentials
    const validUser = demoCredentials.find(
      cred => cred.username === username && cred.password === password
    );

    if (validUser) {
      setUser(validUser);
      navigation.navigate('Home');
    } else {
      Alert.alert(
        'Login Failed',
        'Invalid username or password. Please contact your administrator for access.'
      );
    }
  };

  return (
    <View style={styles.loginContainer}>
      {isDemoMode && (
        <View style={styles.demoModeWarning}>
          <Text style={styles.demoModeText}>🎭 Demo Mode</Text>
        </View>
      )}

      <View style={styles.loginBox}>
        <Text style={styles.loginTitle}>Montevideo App</Text>
        <Text style={styles.loginSubtitle}>Login</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Stack Navigator
const Stack = createStackNavigator();

// Main App component with navigation
const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Log app initialization
    console.log('App initialized');
    
    // Catch any unhandled promise rejections
    const errorHandler = (error) => {
      console.error('Unhandled error:', error);
    };
    
    // Catch any uncaught errors
    if (typeof ErrorUtils !== 'undefined') {
      const originalHandler = ErrorUtils.getGlobalHandler();
      ErrorUtils.setGlobalHandler((error, isFatal) => {
        console.error('Global error:', error, 'isFatal:', isFatal);
        if (originalHandler) {
          originalHandler(error, isFatal);
        }
      });
    }
  }, []);

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <NavigationContainer
          onError={(error) => {
            console.error('Navigation error:', error);
          }}
        >
          <UserContext.Provider value={{ user, setUser }}>
            <Stack.Navigator 
              initialRouteName="Login"
              screenOptions={{
                headerShown: false,
              }}
            >
              <Stack.Screen name="Login" component={LoginPage} />
              <Stack.Screen name="Home" component={Home} />
              <Stack.Screen
                name="Collect"
                component={Receptor}
                options={{ headerShown: false }}
              />
              <Stack.Screen name="Classify" component={Classify} />
              <Stack.Screen name="PastCollections" component={PastCollections} />
            </Stack.Navigator>
          </UserContext.Provider>
        </NavigationContainer>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    padding: 20,
  },
  loginBox: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  loginTitle: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
    color: '#1A1A1A',
    letterSpacing: -0.5,
  },
  loginSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    color: '#6B7280',
    fontWeight: '400',
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#FAFBFC',
    color: '#1A1A1A',
  },
  loginButton: {
    backgroundColor: '#0038A8',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#0038A8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  demoModeWarning: {
    position: 'absolute',
    top: 50,
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#0EA5E9',
  },
  demoModeText: {
    color: '#0284C7',
    fontWeight: '600',
    fontSize: 13,
  },
  homeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    paddingHorizontal: 20,
  },
  homeButton: {
    marginVertical: 8,
    paddingVertical: 18,
    paddingHorizontal: 24,
    backgroundColor: '#0038A8',
    borderRadius: 14,
    width: '85%',
    alignItems: 'center',
    shadowColor: '#0038A8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  welcomeText: {
    fontSize: 24,
    marginBottom: 8,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  roleText: {
    fontSize: 15,
    marginBottom: 32,
    color: '#6B7280',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  adminButton: {
    backgroundColor: '#10B981',
    marginTop: 16,
    marginBottom: 24,
  },
  divider: {
    width: '85%',
    paddingVertical: 16,
    marginVertical: 16,
    borderTopWidth: 1.5,
    borderTopColor: '#E5E7EB',
  },
  dividerText: {
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 13,
    marginTop: 8,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

export default App;
