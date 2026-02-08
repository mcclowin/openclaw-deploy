import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import runtime, { BotStatus } from '../runtime';

export function HomeScreen() {
  const [status, setStatus] = useState<BotStatus>({
    running: false,
    uptime: 0,
    messageCount: 0,
    config: null,
  });
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'bot'; text: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initialize runtime
    runtime.init().then(() => {
      runtime.status().then(setStatus);
    });

    // Subscribe to status updates
    const unsubscribe = runtime.onEvent((event) => {
      if (event.type === 'status') {
        setStatus(event as any);
      }
    });

    return unsubscribe;
  }, []);

  const handleToggle = async () => {
    if (status.running) {
      await runtime.stop();
    } else {
      await runtime.start();
    }
    const newStatus = await runtime.status();
    setStatus(newStatus);
  };

  const handleSendChat = async () => {
    if (!chatInput.trim() || loading) return;

    const userMessage = chatInput.trim();
    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    try {
      const response = await runtime.chat(userMessage);
      setChatHistory(prev => [...prev, { role: 'bot', text: response }]);
    } catch (e) {
      setChatHistory(prev => [...prev, { role: 'bot', text: `Error: ${e}` }]);
    } finally {
      setLoading(false);
    }
  };

  const formatUptime = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
  };

  const botName = status.config?.name || 'Bot';

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.avatar}>🤖</Text>
        <Text style={styles.botName}>{botName}</Text>
        <View style={styles.statusBadge}>
          <View style={[styles.statusDot, status.running && styles.statusDotOnline]} />
          <Text style={[styles.statusText, status.running && styles.statusTextOnline]}>
            {status.running ? 'Online' : 'Offline'}
          </Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.stats}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{status.messageCount}</Text>
          <Text style={styles.statLabel}>Messages</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{formatUptime(status.uptime)}</Text>
          <Text style={styles.statLabel}>Uptime</Text>
        </View>
      </View>

      {/* Chat */}
      <View style={styles.chatSection}>
        <Text style={styles.sectionTitle}>Chat</Text>
        <ScrollView style={styles.chatHistory}>
          {chatHistory.length === 0 && (
            <Text style={styles.chatPlaceholder}>
              Send a message to test your bot
            </Text>
          )}
          {chatHistory.map((msg, i) => (
            <View
              key={i}
              style={[
                styles.chatBubble,
                msg.role === 'user' ? styles.chatBubbleUser : styles.chatBubbleBot,
              ]}
            >
              <Text style={styles.chatText}>{msg.text}</Text>
            </View>
          ))}
          {loading && (
            <View style={[styles.chatBubble, styles.chatBubbleBot]}>
              <Text style={styles.chatText}>Thinking...</Text>
            </View>
          )}
        </ScrollView>
        <View style={styles.chatInputRow}>
          <TextInput
            style={styles.chatInput}
            value={chatInput}
            onChangeText={setChatInput}
            placeholder="Type a message..."
            placeholderTextColor="#666"
            onSubmitEditing={handleSendChat}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSendChat}>
            <Text style={styles.sendButtonText}>→</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Toggle Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.toggleButton, status.running && styles.toggleButtonStop]}
          onPress={handleToggle}
        >
          <Text style={styles.toggleButtonText}>
            {status.running ? '⏸️ Stop Bot' : '▶️ Start Bot'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    padding: 24,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    fontSize: 48,
    marginBottom: 12,
  },
  botName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#666',
  },
  statusDotOnline: {
    backgroundColor: '#22c55e',
  },
  statusText: {
    color: '#666',
    fontSize: 14,
  },
  statusTextOnline: {
    color: '#22c55e',
  },
  stats: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
  },
  statLabel: {
    fontSize: 12,
    color: '#888888',
    marginTop: 4,
  },
  chatSection: {
    flex: 1,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#888',
    marginBottom: 8,
  },
  chatHistory: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  chatPlaceholder: {
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  chatBubble: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    maxWidth: '80%',
  },
  chatBubbleUser: {
    backgroundColor: '#8b5cf6',
    alignSelf: 'flex-end',
  },
  chatBubbleBot: {
    backgroundColor: '#333',
    alignSelf: 'flex-start',
  },
  chatText: {
    color: '#ffffff',
    fontSize: 14,
  },
  chatInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  chatInput: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 12,
    color: '#ffffff',
    fontSize: 14,
  },
  sendButton: {
    backgroundColor: '#8b5cf6',
    borderRadius: 12,
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonText: {
    color: '#ffffff',
    fontSize: 20,
  },
  footer: {
    paddingTop: 8,
  },
  toggleButton: {
    backgroundColor: '#22c55e',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  toggleButtonStop: {
    backgroundColor: '#ef4444',
  },
  toggleButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
