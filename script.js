const micBtn = document.getElementById('microphone');
const micIcon = document.querySelector('.mic');
const micRec = document.querySelector('.mic-rec');

let isListening = false;
let recognition;
let idleTimeout;

const idleDuration = 10000; // Stop listening after 10 seconds of inactivity
const debounceDelay = 500; // 0.5 second debounce delay for repeated commands
let lastCommand = '';
let lastCommandTime = 0;

const commandsList = `
Available Commands:
- up: Scroll up
- down: Scroll down
- top: Scroll to the top of the page
- bottom: Scroll to the bottom of the page
- fly: Scroll up half a page
- jump: Scroll down half a page
`;

micBtn.addEventListener('click', () => {
  if (!isListening) {
    startRecognition();
  } else {
    stopRecognition();
  }
});

function startRecognition() {
  // Start speech recognition
  recognition = new (window.SpeechRecognition ||
    window.webkitSpeechRecognition ||
    window.mozSpeechRecognition ||
    window.msSpeechRecognition)();

  recognition.lang = 'en-US';
  recognition.continuous = true;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  alert(commandsList);
  recognition.start();
  micIcon.classList.add('active');
  isListening = true;

  // Reset idle timeout when recognition starts
  resetIdleTimeout();

  // Define scroll amount and noise words
  const scrollAmount = 100;
  const noiseWords = [
    'uh',
    'ohhh',
    'um',
    'like',
    'you know',
    'so',
    'heyy',
    'haaaa',
    'shhshshh',
  ];

  // Handle speech recognition results
  recognition.onresult = (event) => {
    resetIdleTimeout(); // Reset idle timeout on each result

    const transcript = event.results[event.results.length - 1][0].transcript;
    const words = transcript
      .toLowerCase()
      .split(' ')
      .filter((word) => !noiseWords.includes(word));

    words.forEach((word) => {
      // Define possible commands and their corresponding actions
      const commands = {
        up: () =>
          window.scrollTo({
            top: window.scrollY - scrollAmount,
            behavior: 'smooth',
          }),
        down: () =>
          window.scrollTo({
            top: window.scrollY + scrollAmount,
            behavior: 'smooth',
          }),
        top: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
        bottom: () =>
          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth',
          }),
        fly: () =>
          window.scrollTo({
            top: window.scrollY - window.innerHeight / 2,
            behavior: 'smooth',
          }),
        jump: () =>
          window.scrollTo({
            top: window.scrollY + window.innerHeight / 2,
            behavior: 'smooth',
          }),
      };

      const command = Object.keys(commands).find(
        (key) => new RegExp(`\\b${key}\\b`).test(word) // Use regex to match whole words
      );

      if (command && canExecuteCommand(command)) {
        commands[command]();
        lastCommand = command;
        lastCommandTime = Date.now();
        console.log('Command recognized:', command);
      } else {
        console.log('Command not recognized or debounced:', word);
      }
    });
  };

  recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
  };

  recognition.onend = () => {
    if (isListening) {
      recognition.start(); // Restart recognition if it was stopped unexpectedly
    } else {
      stopRecognition();
    }
  };
}

function stopRecognition() {
  if (recognition) {
    recognition.stop();
  }
  clearTimeout(idleTimeout);
  isListening = false;
  micIcon.classList.remove('active');
  console.log('Speech recognition stopped');
}

function resetIdleTimeout() {
  clearTimeout(idleTimeout);
  idleTimeout = setTimeout(() => {
    stopRecognition();
  }, idleDuration);
}

function canExecuteCommand(command) {
  const now = Date.now();
  const timeSinceLastCommand = now - lastCommandTime;

  return command !== lastCommand || timeSinceLastCommand > debounceDelay;
}
