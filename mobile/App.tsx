import React, {useEffect, useState, useRef} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
} from 'react-native';

// nodejs-mobile bridge
let nodejs: any = null;
try {
  nodejs = require('nodejs-mobile-react-native');
} catch (e) {
  console.log('nodejs-mobile not available');
}

function App(): React.JSX.Element {
  const [output, setOutput] = useState<string[]>(['Brain & Hand v0.1.0', 'Tap "Run OpenClaw" to start']);
  const [input, setInput] = useState<string>('');
  const [running, setRunning] = useState<boolean>(false);
  const scrollRef = useRef<ScrollView>(null);

  function addLine(text: string) {
    setOutput(prev => [...prev.slice(-500), text]);
    setTimeout(() => scrollRef.current?.scrollToEnd({animated: true}), 50);
  }

  useEffect(() => {
    if (!nodejs) {
      addLine('[ERROR] nodejs-mobile not available');
      return;
    }

    nodejs.channel.addListener('message', (msg: string) => {
      try {
        const data = JSON.parse(msg);
        if (data.type === 'output') {
          addLine(data.text);
        } else if (data.type === 'started') {
          setRunning(true);
          addLine('[OpenClaw started]');
        } else if (data.type === 'exited') {
          setRunning(false);
          addLine(`[OpenClaw exited: ${data.code}]`);
        } else if (data.type === 'ready') {
          addLine(`[Node.js ${data.node} ready]`);
        }
      } catch (e) {
        addLine(msg);
      }
    });

    nodejs.start('main.js');
  }, []);

  function handleRun() {
    if (!nodejs) {
      addLine('[ERROR] Node.js not available');
      return;
    }
    addLine('> openclaw onboard');
    nodejs.channel.send(JSON.stringify({ cmd: 'run', args: ['onboard'] }));
  }

  function handleGateway() {
    if (!nodejs) {
      addLine('[ERROR] Node.js not available');
      return;
    }
    addLine('> openclaw gateway');
    nodejs.channel.send(JSON.stringify({ cmd: 'run', args: ['gateway', '--verbose'] }));
  }

  function handleSend() {
    if (!input.trim() || !nodejs) return;
    addLine(`> ${input}`);
    nodejs.channel.send(JSON.stringify({ cmd: 'input', text: input }));
    setInput('');
  }

  function handleStop() {
    if (!nodejs) return;
    nodejs.channel.send(JSON.stringify({ cmd: 'stop' }));
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      <View style={styles.header}>
        <Text style={styles.title}>🧠 Brain & Hand</Text>
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity style={styles.btn} onPress={handleRun}>
          <Text style={styles.btnText}>Setup</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={handleGateway}>
          <Text style={styles.btnText}>Gateway</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.stopBtn]} onPress={handleStop}>
          <Text style={styles.btnText}>Stop</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        ref={scrollRef}
        style={styles.terminal}
        contentContainerStyle={styles.terminalContent}
      >
        {output.map((line, i) => (
          <Text key={i} style={styles.line}>{line}</Text>
        ))}
      </ScrollView>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Type here..."
          placeholderTextColor="#555"
          value={input}
          onChangeText={setInput}
          onSubmitEditing={handleSend}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
          <Text style={styles.sendText}>↵</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  buttons: {
    flexDirection: 'row',
    padding: 8,
    gap: 8,
  },
  btn: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  stopBtn: {
    borderColor: '#ef4444',
  },
  btnText: {
    color: '#fff',
    fontWeight: '500',
  },
  terminal: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    margin: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#222',
  },
  terminalContent: {
    padding: 12,
  },
  line: {
    color: '#0f0',
    fontFamily: 'monospace',
    fontSize: 13,
    lineHeight: 18,
  },
  inputRow: {
    flexDirection: 'row',
    padding: 8,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  input: {
    flex: 1,
    backgroundColor: '#111',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#0f0',
    fontFamily: 'monospace',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#333',
  },
  sendBtn: {
    backgroundColor: '#1a1a1a',
    borderRadius: 6,
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  sendText: {
    color: '#0f0',
    fontSize: 18,
  },
});

export default App;
