import React, { useState, createContext, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert, Linking } from 'react-native';
import Receptor from './components/receptor';
import Classify from './components/classify';
import PastCollections from './components/pastcollections';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import calls from './services/calls';
import { SafeAreaProvider } from 'react-native-safe-area-context';

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
        <Text style={styles.buttonText}>Classify</Text>
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
        <Text style={styles.buttonText}>Classify</Text>
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

  return (
  <SafeAreaProvider>
    <NavigationContainer>
      <UserContext.Provider value={{ user, setUser }}>
        <Stack.Navigator initialRouteName="Login">
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
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  loginBox: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  loginTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  loginSubtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  loginButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  demoModeWarning: {
    position: 'absolute',
    top: 40,
    backgroundColor: '#e3f2fd',
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  demoModeText: {
    color: '#1976d2',
    fontWeight: 'bold',
    fontSize: 14,
  },
  homeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeButton: {
    margin: 10,
    padding: 20,
    backgroundColor: '#2196F3',
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  welcomeText: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  roleText: {
    fontSize: 16,
    marginBottom: 20,
    color: '#666',
    fontStyle: 'italic',
  },
  adminButton: {
    backgroundColor: '#4CAF50',
    marginTop: 10,
    marginBottom: 20,
  },
  divider: {
    width: '80%',
    paddingVertical: 10,
    marginVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  dividerText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    marginTop: 10,
  },
});

export default App;
