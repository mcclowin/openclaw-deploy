import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  StatusBar,
} from 'react-native';

// Phase 1: Basic UI without nodejs-mobile
// Phase 2: Will add nodejs-mobile integration

function App(): React.JSX.Element {
  const [status, setStatus] = useState<string>('Ready');
  const [apiKey, setApiKey] = useState<string>('');
  const [configured, setConfigured] = useState<boolean>(false);

  const handleConfigure = () => {
    if (!apiKey.trim()) {
      setStatus('Please enter an API key');
      return;
    }
    setConfigured(true);
    setStatus('Configured ✓');
  };

  const handleStart = () => {
    setStatus('Gateway running ✓ (simulated)');
  };

  const handleStop = () => {
    setStatus('Gateway stopped');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      
      <View style={styles.header}>
        <Text style={styles.title}>🧠 Brain & Hand</Text>
        <Text style={styles.subtitle}>Your AI, running locally</Text>
        <Text style={styles.status}>{status}</Text>
      </View>

      {!configured ? (
        <View style={styles.setup}>
          <Text style={styles.sectionTitle}>Quick Setup</Text>
          <TextInput
            style={styles.input}
            placeholder="Anthropic API Key"
            placeholderTextColor="#666"
            value={apiKey}
            onChangeText={setApiKey}
            secureTextEntry
            autoCapitalize="none"
          />
          <TouchableOpacity style={styles.button} onPress={handleConfigure}>
            <Text style={styles.buttonText}>Configure</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.controls}>
          <Text style={styles.sectionTitle}>Controls</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.button} onPress={handleStart}>
              <Text style={styles.buttonText}>▶ Start</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.stopButton]} onPress={handleStop}>
              <Text style={styles.buttonText}>⏹ Stop</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.info}>
            <Text style={styles.infoTitle}>Phase 1 Complete!</Text>
            <Text style={styles.infoText}>
              ✓ React Native app running{'\n'}
              ✓ Basic UI working{'\n'}
              ○ Node.js runtime (Phase 2){'\n'}
              ○ OpenClaw gateway (Phase 3)
            </Text>
          </View>
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>Brain & Hand v0.1.0</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  status: {
    fontSize: 16,
    color: '#6c5ce7',
    marginTop: 12,
    fontWeight: '600',
  },
  setup: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#2a2a4e',
    borderRadius: 12,
    padding: 18,
    color: '#fff',
    fontSize: 16,
    marginBottom: 16,
  },
  controls: {
    padding: 24,
    flex: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  button: {
    flex: 1,
    backgroundColor: '#6c5ce7',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
  },
  stopButton: {
    backgroundColor: '#e74c3c',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  info: {
    backgroundColor: '#2a2a4e',
    borderRadius: 12,
    padding: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2ecc71',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#ccc',
    lineHeight: 24,
  },
  footer: {
    padding: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  footerText: {
    color: '#666',
    fontSize: 12,
  },
});

export default App;
