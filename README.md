# Senior-Design

## Voice-driven data entry

The Collect screen now includes an **AI Form Assistant** card that lets collectors complete the bag form by speaking with the in-app agent. Tap **Start**, answer the prompts (client, location, bag color/count/weight, optional notes), and say "yes" when asked to submit. Say "cancel" or tap **Stop** at any time to end the session without saving.

Under the hood the assistant uses `expo-speech` for its spoken responses and `expo-speech-recognition` to capture what the collector says, so make sure microphone permissions are granted the first time you run it.
