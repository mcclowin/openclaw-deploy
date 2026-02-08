import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Welcome'>;
};

export function WelcomeScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.content}>
        {/* Logo placeholder */}
        <Text style={styles.logo}>🧠🤖</Text>
        
        <Text style={styles.title}>Brain and Hand</Text>
        
        <Text style={styles.tagline}>
          Your personal AI assistant{'\n'}
          lives in your pocket
        </Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Wizard')}
        >
          <Text style={styles.buttonText}>Create Your Bot</Text>
        </TouchableOpacity>

        <Text style={styles.privacy}>
          Privacy-first. Your data never leaves your device.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    padding: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: 64,
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
  },
  tagline: {
    fontSize: 18,
    color: '#888888',
    textAlign: 'center',
    lineHeight: 28,
  },
  footer: {
    paddingBottom: 32,
  },
  button: {
    backgroundColor: '#8b5cf6',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  privacy: {
    color: '#666666',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 16,
  },
});
