import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Platform } from 'react-native';
import * as Speech from 'expo-speech';
import { ExpoSpeechRecognitionModule, isRecognitionAvailable, getPermissionsAsync, requestPermissionsAsync } from 'expo-speech-recognition';

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
  setVoiceColor,
  setVoiceBags,
  setVoiceWeight,
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
    // Check if speech recognition is available
    if (!isRecognitionAvailable()) {
      const errorMsg = Platform.OS === 'web' 
        ? 'Speech recognition is not available in this browser. Please use Chrome, Edge, or Safari, and ensure you are using HTTPS or localhost.'
        : 'Speech recognition is not available on this device.';
      throw new Error(errorMsg);
    }

    // Request permissions
    try {
      const { status: existingStatus } = await getPermissionsAsync();
      if (existingStatus !== 'granted') {
        const { status: newStatus } = await requestPermissionsAsync();
        if (newStatus !== 'granted') {
          throw new Error('Microphone permission is required to use the assistant.');
        }
      }
    } catch (error) {
      // On web, permissions might be handled differently or requested by the browser automatically
      if (Platform.OS !== 'web') {
        throw error;
      }
      // On web, we'll try to continue - the browser will prompt for permission when starting
      console.log('Permission check on web:', error.message);
    }
  };

  const stopRecognition = () => {
    try {
      ExpoSpeechRecognitionModule.stop();
    } catch (stopError) {
      console.log('stop error:', stopError);
    }
  };

  const listenForSpeech = () => {
    return new Promise((resolve, reject) => {
      if (!sessionActiveRef.current) {
        reject(new Error('Session cancelled'));
        return;
      }

      let resultListener;
      let errorListener;
      let endListener;
      let timeoutId;
      let finalTranscript = '';
      let interimTranscript = '';
      let endEventHandled = false;

      const cleanup = () => {
        if (resultListener) resultListener.remove();
        if (errorListener) errorListener.remove();
        if (endListener) endListener.remove();
        if (timeoutId) clearTimeout(timeoutId);
        try {
          ExpoSpeechRecognitionModule.stop();
        } catch (e) {
          // Ignore stop errors
        }
      };

      // Listen for results
      resultListener = ExpoSpeechRecognitionModule.addListener('result', (event) => {
        console.log('Speech recognition result event:', JSON.stringify(event, null, 2));
        
        // Try different possible event structures
        let transcript = '';
        let isFinal = false;
        
        // Web Speech Recognition API structure: event.results is an array
        if (event.results && Array.isArray(event.results) && event.results.length > 0) {
          // Get transcript from first result
          const firstResult = event.results[0];
          if (firstResult && typeof firstResult === 'object') {
            transcript = firstResult.transcript || firstResult.text || '';
          } else if (typeof firstResult === 'string') {
            transcript = firstResult;
          }
          
          // Check if final
          isFinal = event.isFinal || event.final || false;
          
          // If no transcript from first result, try to combine all results
          if (!transcript && event.results.length > 0) {
            transcript = event.results
              .map(r => {
                if (typeof r === 'string') return r;
                if (r && typeof r === 'object') return r.transcript || r.text || '';
                return '';
              })
              .filter(t => t)
              .join(' ');
          }
        } else if (event.transcript) {
          // Direct transcript property
          transcript = event.transcript;
          isFinal = event.isFinal || false;
        } else if (event.text) {
          // Alternative text property
          transcript = event.text;
          isFinal = event.isFinal || false;
        } else if (typeof event === 'string') {
          // Event itself is the transcript
          transcript = event;
        }
        
        transcript = transcript.trim();
        
        if (transcript) {
          if (isFinal) {
            finalTranscript = transcript;
            console.log('Final transcript captured:', finalTranscript);
          } else {
            interimTranscript = transcript;
            console.log('Interim transcript captured:', interimTranscript);
          }
        } else {
          console.warn('No transcript found in event:', event);
        }
      });

      // Listen for errors
      errorListener = ExpoSpeechRecognitionModule.addListener('error', (event) => {
        cleanup();
        reject(new Error(event.message || 'Speech recognition error occurred.'));
      });

      // Listen for end event
      endListener = ExpoSpeechRecognitionModule.addListener('end', (endEvent) => {
        console.log('Speech recognition ended:', JSON.stringify(endEvent, null, 2));
        console.log('Final transcript at end:', finalTranscript);
        console.log('Interim transcript at end:', interimTranscript);
        
        // Ignore multiple end events - only handle the first one
        if (endEventHandled) {
          console.log('Ignoring duplicate end event');
          return;
        }
        
        // Wait a small moment for any pending transcript updates
        setTimeout(() => {
          // Only process if we haven't already handled it
          if (endEventHandled) {
            return;
          }
          endEventHandled = true;
          cleanup();
          const transcriptToUse = finalTranscript || interimTranscript;
          console.log('Transcript to use after delay:', transcriptToUse);
          if (transcriptToUse && transcriptToUse.trim()) {
            appendMessage('user', transcriptToUse);
            resolve(transcriptToUse);
          } else {
            console.error('No transcript captured - finalTranscript:', finalTranscript, 'interimTranscript:', interimTranscript);
            reject(new Error('I did not hear anything. Please try again.'));
          }
        }, 500); // Increased delay to ensure transcript is captured
      });

      // Start recognition
      try {
        ExpoSpeechRecognitionModule.start({
          lang: 'en-US',
          interimResults: true,
          continuous: false,
        });

        // Set a timeout to stop if no result after 15 seconds
        timeoutId = setTimeout(() => {
          if (sessionActiveRef.current) {
            console.log('Speech recognition timeout - finalTranscript:', finalTranscript, 'interimTranscript:', interimTranscript);
            cleanup();
            const transcriptToUse = finalTranscript || interimTranscript;
            if (transcriptToUse) {
              console.log('Using transcript from timeout:', transcriptToUse);
              appendMessage('user', transcriptToUse);
              resolve(transcriptToUse);
            } else {
              console.error('Timeout with no transcript captured');
              reject(new Error('Speech recognition timed out. Please try again.'));
            }
          }
        }, 15000);
      } catch (startError) {
        cleanup();
        reject(new Error('Failed to start speech recognition: ' + startError.message));
      }
    });
  };

  const askForSpeech = async (prompt, retryCount = 0, maxRetries = 3) => {
    if (!sessionActiveRef.current) {
      throw new Error('Session cancelled');
    }
    await speak(prompt);
    try {
      const response = await listenForSpeech();
      if (response.toLowerCase().includes('cancel')) {
        throw new Error('Session cancelled by user');
      }
      return response;
    } catch (error) {
      // If we get "did not hear anything" error and haven't exceeded retries, try again
      if (error.message.includes('did not hear anything') && retryCount < maxRetries) {
        console.log(`Retrying speech recognition (attempt ${retryCount + 1}/${maxRetries})...`);
        await speak('Let me try again. ' + prompt);
        return askForSpeech(prompt, retryCount + 1, maxRetries);
      }
      // Otherwise, throw the error
      throw error;
    }
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
    // First try to find digits
    const digitMatch = speechText.match(/(\d+(\.\d+)?)/);
    if (digitMatch) {
      return parseFloat(digitMatch[0]);
    }
    
    // Convert word numbers to digits
    const normalized = speechText.toLowerCase().trim();
    const wordNumbers = {
      'zero': 0, 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
      'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
      'eleven': 11, 'twelve': 12, 'thirteen': 13, 'fourteen': 14, 'fifteen': 15,
      'sixteen': 16, 'seventeen': 17, 'eighteen': 18, 'nineteen': 19, 'twenty': 20
    };
    
    // Check for exact matches first
    if (wordNumbers[normalized] !== undefined) {
      return wordNumbers[normalized];
    }
    
    // Check if the text contains a word number
    for (const [word, num] of Object.entries(wordNumbers)) {
      if (normalized.includes(word)) {
        return num;
      }
    }
    
    return null;
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

        // Set visual feedback in Entry form
        if (setVoiceColor) {
          setVoiceColor(selectedColor);
        }

        let bagCount = null;
        while (bagCount === null && sessionActiveRef.current) {
          const bagResponse = await askForSpeech('How many bags are you adding?');
          console.log('Bag response received:', bagResponse);
          const parsedCount = extractNumber(bagResponse);
          console.log('Parsed count:', parsedCount);
          if (parsedCount !== null && parsedCount > 0) {
            bagCount = Math.round(parsedCount);
          } else {
            await speak('Please state the number of bags as a positive number. For example, say "two" or "2".');
          }
        }
        if (bagCount === null) {
          throw new Error('Session cancelled while entering bag count.');
        }

        // Set visual feedback in Entry form
        if (setVoiceBags) {
          setVoiceBags(bagCount.toString());
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

        // Set visual feedback in Entry form
        if (setVoiceWeight) {
          setVoiceWeight(bagWeight.toString());
        }

        // Small delay to show the values in the form
        await new Promise(resolve => setTimeout(resolve, 500));

        onAddEntry(selectedColor, bagCount.toString(), bagWeight.toString());
        newEntries += 1;
        await speak(`Added ${bagCount} ${selectedColor} bags weighing ${bagWeight} kilograms.`);

        // Clear the visual feedback after adding
        if (setVoiceColor) setVoiceColor(null);
        if (setVoiceBags) setVoiceBags(null);
        if (setVoiceWeight) setVoiceWeight(null);

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
        try {
          await speak('Submitting your pickup now...');
          
          // Stop the session before submitting to prevent interference
          sessionActiveRef.current = false;
          
          // Submit (will navigate away after completion)
          console.log('Voice assistant calling onSubmit...');
          await onSubmit();
          console.log('Voice assistant onSubmit completed');
          
          // Small delay before speaking success message
          await new Promise(resolve => setTimeout(resolve, 500));
          await speak('All set. Your data has been saved.');
        } catch (submitError) {
          console.error('Submit error in voice assistant:', submitError);
          sessionActiveRef.current = true; // Re-enable to speak error
          await speak('Sorry, there was an error submitting the form. ' + (submitError.message || 'Please try submitting manually.'));
        }
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
      stopRecognition();
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
    stopRecognition();
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
