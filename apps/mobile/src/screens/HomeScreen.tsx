import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';

export function HomeScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.avatar}>🤖</Text>
        <Text style={styles.botName}>Jarvis</Text>
        <View style={styles.statusBadge}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>Online</Text>
        </View>
      </View>

      <View style={styles.stats}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Messages today</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>--:--</Text>
          <Text style={styles.statLabel}>Uptime</Text>
        </View>
      </View>

      <View style={styles.channels}>
        <Text style={styles.sectionTitle}>Channels</Text>
        <View style={styles.channelCard}>
          <Text style={styles.channelIcon}>📱</Text>
          <View style={styles.channelInfo}>
            <Text style={styles.channelName}>Telegram</Text>
            <Text style={styles.channelStatus}>Not connected</Text>
          </View>
          <TouchableOpacity style={styles.channelButton}>
            <Text style={styles.channelButtonText}>Setup</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.killSwitch}>
          <Text style={styles.killSwitchText}>⏸️ Pause Bot</Text>
        </TouchableOpacity>
      </View>
    </View>
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
    marginBottom: 32,
  },
  avatar: {
    fontSize: 64,
    marginBottom: 16,
  },
  botName: {
    fontSize: 28,
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
    backgroundColor: '#22c55e',
  },
  statusText: {
    color: '#22c55e',
    fontSize: 14,
  },
  stats: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
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
  channels: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 12,
  },
  channelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  channelIcon: {
    fontSize: 24,
  },
  channelInfo: {
    flex: 1,
  },
  channelName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  channelStatus: {
    fontSize: 12,
    color: '#888888',
    marginTop: 2,
  },
  channelButton: {
    backgroundColor: '#333',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  channelButtonText: {
    color: '#ffffff',
    fontSize: 14,
  },
  footer: {
    paddingTop: 24,
  },
  killSwitch: {
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  killSwitchText: {
    color: '#888888',
    fontSize: 16,
  },
});
