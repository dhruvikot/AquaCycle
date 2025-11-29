import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import * as Speech from 'expo-speech';
import * as SpeechRecognition from 'expo-speech-recognition';

const COLOR_OPTIONS = ['Blue', 'Yellow', 'Brown', 'Grey'];
const AFFIRMATIVE_VALUES = ['yes', 'yeah', 'yep', 'sure', 'please do', 'affirmative', 'do it'];
const NEGATIVE_VALUES = ['no', 'nope', 'nah', 'stop', 'cancel', 'negative', 'not now'];

const VoiceAssistant = ({
  clients = [],
  selectedClient,
  selectedLocation,
  onClientSelect,
  onLocationSelect,
  onAddEntry,
  onSubmit,
  setNotes,
}) => {
  const [messages, setMessages] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const sessionActiveRef = useRef(false);

  const appendMessage = (role, text) => {
    setMessages((current) => [
      ...current,
      {
        id: `${Date.now()}-${Math.random()}`,
        role,
        text,
      },
    ]);
  };

  const speak = async (text) => {
    appendMessage('assistant', text);
    await Speech.stop();
    Speech.speak(text, { language: 'en-US' });
  };

  const ensureSpeechAvailability = async () => {
    if (!SpeechRecognition || !SpeechRecognition.startAsync) {
      throw new Error('Speech recognition is not available on this device.');
    }

    if (SpeechRecognition?.getPermissionsAsync && SpeechRecognition?.requestPermissionsAsync) {
      const { status: existingStatus } = await SpeechRecognition.getPermissionsAsync();
      if (existingStatus !== 'granted') {
        const { status: newStatus } = await SpeechRecognition.requestPermissionsAsync();
        if (newStatus !== 'granted') {
          throw new Error('Microphone permission is required to use the assistant.');
        }
      }
    }
  };

  const stopRecognition = async () => {
    if (SpeechRecognition?.stopAsync) {
      try {
        await SpeechRecognition.stopAsync();
      } catch (stopError) {
        console.log('stopAsync error:', stopError);
      }
    }
  };

  const listenForSpeech = async () => {
    if (!sessionActiveRef.current) {
      throw new Error('Session cancelled');
    }

    const result = await SpeechRecognition.startAsync({
      lang: 'en-US',
      interimResults: false,
      prompt: 'Please speak now',
    });

    await stopRecognition();

    const transcript =
      result?.transcripts?.[0] ||
      result?.text ||
      result?.results?.[0]?.transcript ||
      result?.value ||
      '';

    if (!transcript.trim()) {
      throw new Error('I did not hear anything. Please try again.');
    }

    appendMessage('user', transcript.trim());
    return transcript.trim();
  };

  const askForSpeech = async (prompt) => {
    if (!sessionActiveRef.current) {
      throw new Error('Session cancelled');
    }
    await speak(prompt);
    const response = await listenForSpeech();
    if (response.toLowerCase().includes('cancel')) {
      throw new Error('Session cancelled by user');
    }
    return response;
  };

  const askYesNo = async (prompt, defaultValue = null) => {
    while (sessionActiveRef.current) {
      const reply = await askForSpeech(prompt);
      const normalized = reply.toLowerCase();

      if (AFFIRMATIVE_VALUES.some((word) => normalized.includes(word))) {
        return true;
      }
      if (NEGATIVE_VALUES.some((word) => normalized.includes(word))) {
        return false;
      }

      if (defaultValue !== null) {
        return defaultValue;
      }

      await speak('Please answer with yes or no.');
    }
    throw new Error('Session cancelled');
  };

  const matchClientBySpeech = (speechText) => {
    const normalized = speechText.toLowerCase();
    return clients.find((client) => {
      const label = (client?.label || '').toLowerCase();
      return label === normalized || normalized.includes(label);
    });
  };

  const matchLocationBySpeech = (client, speechText) => {
    if (!client || !client.locations) return null;
    const normalized = speechText.toLowerCase();
    return client.locations.find((location) => {
      const label = (location?.name || '').toLowerCase();
      return label === normalized || normalized.includes(label);
    });
  };

  const matchColor = (speechText) => {
    const normalized = speechText.toLowerCase();
    return COLOR_OPTIONS.find((color) => normalized.includes(color.toLowerCase()));
  };

  const extractNumber = (speechText) => {
    const match = speechText.match(/(\d+(\.\d+)?)/);
    return match ? parseFloat(match[0]) : null;
  };

  const handleSession = async () => {
    setErrorMessage(null);
    setMessages([]);
    sessionActiveRef.current = true;
    setIsRunning(true);

    try {
      if (!clients.length) {
        throw new Error('Client data is still loading. Please wait a moment and try again.');
      }

      await ensureSpeechAvailability();
      await speak('Hi, I am your AI assistant. I will help you fill this collection form.');

      let clientId = selectedClient;
      let clientRecord = clients.find((client) => client.value === clientId);

      if (!clientRecord) {
        let clientFound = null;
        while (!clientFound && sessionActiveRef.current) {
          const spokenClient = await askForSpeech('Which client should I use?');
          clientFound = matchClientBySpeech(spokenClient);
          if (!clientFound) {
            await speak('I could not find that client. Please say the client name exactly as listed in the dropdown.');
          }
        }
        if (!clientFound) {
          throw new Error('Session cancelled while selecting a client.');
        }
        clientRecord = clientFound;
        clientId = clientFound.value;
        onClientSelect(clientId);
        await speak(`Got it. I selected ${clientRecord.label}.`);
      } else {
        await speak(`I will use the client ${clientRecord.label} that is already selected.`);
      }

      let locationId = selectedLocation;
      if (!locationId) {
        let locationRecord = null;
        while (!locationRecord && sessionActiveRef.current) {
          const spokenLocation = await askForSpeech('Please tell me which pickup location to use.');
          locationRecord = matchLocationBySpeech(clientRecord, spokenLocation);
          if (!locationRecord) {
            await speak('I could not match that location. Say it exactly as shown in the app.');
          }
        }
        if (!locationRecord) {
          throw new Error('Session cancelled while selecting a location.');
        }
        locationId = locationRecord.id || locationRecord.value;
        onLocationSelect(locationId);
        await speak(`Location set to ${locationRecord.name}.`);
      } else {
        await speak('Using the location that is already selected.');
      }

      let shouldAddEntry = await askYesNo('Do you want to add bag information now?', true);
      let newEntries = 0;

      while (shouldAddEntry && sessionActiveRef.current) {
        let selectedColor = null;
        while (!selectedColor && sessionActiveRef.current) {
          const colorResponse = await askForSpeech('Which color bag is it? You can say blue, yellow, brown, or grey.');
          selectedColor = matchColor(colorResponse);
          if (!selectedColor) {
            await speak('I did not catch the color. Please say blue, yellow, brown, or grey.');
          }
        }
        if (!selectedColor) {
          throw new Error('Session cancelled while selecting bag color.');
        }

        let bagCount = null;
        while (bagCount === null && sessionActiveRef.current) {
          const bagResponse = await askForSpeech('How many bags are you adding?');
          const parsedCount = extractNumber(bagResponse);
          if (parsedCount !== null && parsedCount > 0) {
            bagCount = Math.round(parsedCount);
          } else {
            await speak('Please state the number of bags as a positive number.');
          }
        }
        if (bagCount === null) {
          throw new Error('Session cancelled while entering bag count.');
        }

        let bagWeight = null;
        while (bagWeight === null && sessionActiveRef.current) {
          const weightResponse = await askForSpeech('What is the total weight in kilograms?');
          const parsedWeight = extractNumber(weightResponse);
          if (parsedWeight !== null && parsedWeight > 0) {
            bagWeight = parsedWeight;
          } else {
            await speak('Please provide the weight in kilograms.');
          }
        }
        if (bagWeight === null) {
          throw new Error('Session cancelled while entering weight.');
        }

        onAddEntry(selectedColor, bagCount.toString(), bagWeight.toString());
        newEntries += 1;
        await speak(`Added ${bagCount} ${selectedColor} bags weighing ${bagWeight} kilograms.`);

        shouldAddEntry = await askYesNo('Do you want to add another bag entry?', false);
      }

      const wantsNotes = await askYesNo('Would you like to dictate pickup notes?', false);
      if (wantsNotes) {
        const noteContent = await askForSpeech('Go ahead and say your notes. Say skip to leave it empty.');
        if (noteContent.toLowerCase().includes('skip')) {
          await speak('Skipping notes.');
        } else {
          setNotes(noteContent);
          await speak('Notes saved.');
        }
      }

      if (!newEntries) {
        await speak('No new entries were added during this session.');
      }

      const shouldSubmit = await askYesNo('Do you want me to submit this pickup now?', false);
      if (shouldSubmit) {
        await onSubmit();
        await speak('All set. Your data has been saved.');
      } else {
        await speak('Okay, you can review the data and submit whenever you are ready.');
      }
    } catch (error) {
      console.log('Voice assistant error:', error);
      const friendlyMessage =
        error.message === 'Session cancelled' || error.message === 'Session cancelled by user'
          ? 'Session cancelled.'
          : error.message;
      setErrorMessage(friendlyMessage);
      if (friendlyMessage) {
        await speak(friendlyMessage);
      }
    } finally {
      sessionActiveRef.current = false;
      setIsRunning(false);
      await Speech.stop();
      await stopRecognition();
    }
  };

  const handleStart = async () => {
    if (isRunning) {
      return;
    }
    try {
      await handleSession();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleStop = async () => {
    sessionActiveRef.current = false;
    setIsRunning(false);
    await Speech.stop();
    await stopRecognition();
    appendMessage('assistant', 'Assistant stopped.');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AI Form Assistant</Text>
        {isRunning && <ActivityIndicator size="small" color="#2e7d32" />}
      </View>
      <Text style={styles.subtitle}>
        Tap start and speak naturally. Say "cancel" at any time to stop the session.
      </Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.button, isRunning && styles.buttonDisabled]} onPress={handleStart} disabled={isRunning}>
          <Text style={styles.buttonText}>Start</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.stopButton, !isRunning && styles.buttonDisabled]}
          onPress={handleStop}
          disabled={!isRunning}
        >
          <Text style={styles.buttonText}>Stop</Text>
        </TouchableOpacity>
      </View>
      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
      <ScrollView style={styles.logContainer}>
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageBubble,
              message.role === 'assistant' ? styles.assistantBubble : styles.userBubble,
            ]}
          >
            <Text style={styles.messageRole}>{message.role === 'assistant' ? 'Assistant' : 'You'}</Text>
            <Text style={styles.messageText}>{message.text}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f1f8e9',
    borderWidth: 1,
    borderColor: '#c5e1a5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  subtitle: {
    marginTop: 8,
    color: '#33691e',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 12,
  },
  button: {
    flex: 1,
    backgroundColor: '#4caf50',
    paddingVertical: 10,
    marginRight: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  stopButton: {
    flex: 1,
    backgroundColor: '#e53935',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  errorText: {
    marginTop: 8,
    color: '#c62828',
  },
  logContainer: {
    marginTop: 12,
    maxHeight: 200,
  },
  messageBubble: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  assistantBubble: {
    backgroundColor: '#ffffff',
    borderColor: '#c5e1a5',
    borderWidth: 1,
  },
  userBubble: {
    backgroundColor: '#e8f5e9',
    borderColor: '#a5d6a7',
    borderWidth: 1,
  },
  messageRole: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#33691e',
  },
  messageText: {
    color: '#1b5e20',
  },
});

export default VoiceAssistant;
