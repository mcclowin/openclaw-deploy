import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import {
  WizardState,
  WizardStep,
  createInitialState,
  canProceed,
  nextStep,
  prevStep,
  FLAVOR_OPTIONS,
} from '@brain-and-hand/core';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Wizard'>;
};

export function WizardScreen({ navigation }: Props) {
  const [state, setState] = useState<WizardState>(createInitialState());
  const [name, setName] = useState('');
  const [mission, setMission] = useState('');
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);

  const handleNext = () => {
    // Save current step data
    if (state.currentStep === 'identity') {
      setState(s => ({
        ...s,
        identity: { name, mission, flavors: selectedFlavors },
      }));
    }

    const next = nextStep(state.currentStep);
    if (next === null) {
      // Birth step complete - go to home
      navigation.replace('Home');
    } else {
      setState(s => ({ ...s, currentStep: next }));
    }
  };

  const handleBack = () => {
    const prev = prevStep(state.currentStep);
    if (prev) {
      setState(s => ({ ...s, currentStep: prev }));
    }
  };

  const toggleFlavor = (flavor: string) => {
    setSelectedFlavors(prev =>
      prev.includes(flavor)
        ? prev.filter(f => f !== flavor)
        : [...prev, flavor]
    );
  };

  const renderStep = () => {
    switch (state.currentStep) {
      case 'identity':
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Define My Mission</Text>
            <Text style={styles.stepSubtitle}>
              I'm about to be born. Tell me who I should be.
            </Text>

            <Text style={styles.label}>My Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="e.g., Jarvis, Friday, Max"
              placeholderTextColor="#666"
            />

            <Text style={styles.label}>My Mission</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={mission}
              onChangeText={setMission}
              placeholder="What should I help you with?"
              placeholderTextColor="#666"
              multiline
              numberOfLines={4}
            />

            <Text style={styles.label}>My Personality (optional)</Text>
            <View style={styles.flavors}>
              {FLAVOR_OPTIONS.map(flavor => (
                <TouchableOpacity
                  key={flavor}
                  style={[
                    styles.flavorChip,
                    selectedFlavors.includes(flavor) && styles.flavorChipActive,
                  ]}
                  onPress={() => toggleFlavor(flavor)}
                >
                  <Text
                    style={[
                      styles.flavorText,
                      selectedFlavors.includes(flavor) && styles.flavorTextActive,
                    ]}
                  >
                    {flavor}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 'brain':
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Pick My Brain</Text>
            <Text style={styles.stepSubtitle}>
              Choose how I'll think.
            </Text>
            {/* Brain options will go here */}
            <Text style={styles.placeholder}>Brain selection coming soon...</Text>
          </View>
        );

      case 'channels':
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Connect Channels</Text>
            <Text style={styles.stepSubtitle}>
              Where should I listen for your messages?
            </Text>
            <Text style={styles.placeholder}>Channel setup coming soon...</Text>
          </View>
        );

      case 'skills':
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Load Skills</Text>
            <Text style={styles.stepSubtitle}>
              What should I be capable of?
            </Text>
            <Text style={styles.placeholder}>Skill selection coming soon...</Text>
          </View>
        );

      case 'birth':
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Ready to Spawn</Text>
            <Text style={styles.birthEmoji}>🥚</Text>
            <Text style={styles.stepSubtitle}>
              Tap Spawn to bring me to life.
            </Text>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {renderStep()}
      </ScrollView>

      <View style={styles.nav}>
        {state.currentStep !== 'identity' && (
          <TouchableOpacity style={styles.navButton} onPress={handleBack}>
            <Text style={styles.navButtonText}>Back</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.navButton, styles.navButtonPrimary]}
          onPress={handleNext}
        >
          <Text style={styles.navButtonTextPrimary}>
            {state.currentStep === 'birth' ? 'Spawn' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 60,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 16,
    color: '#888888',
    marginBottom: 32,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 16,
    color: '#ffffff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  flavors: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  flavorChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333',
  },
  flavorChipActive: {
    backgroundColor: '#8b5cf6',
    borderColor: '#8b5cf6',
  },
  flavorText: {
    color: '#888888',
    fontSize: 14,
  },
  flavorTextActive: {
    color: '#ffffff',
  },
  placeholder: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 48,
  },
  birthEmoji: {
    fontSize: 80,
    textAlign: 'center',
    marginVertical: 32,
  },
  nav: {
    flexDirection: 'row',
    padding: 24,
    gap: 12,
  },
  navButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  navButtonPrimary: {
    backgroundColor: '#8b5cf6',
  },
  navButtonText: {
    color: '#888888',
    fontSize: 16,
    fontWeight: '600',
  },
  navButtonTextPrimary: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
