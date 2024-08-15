const micBtn = document.getElementById('microphone');
const micIcon = document.querySelector('.mic');
const micRec = document.querySelector('.mic-rec');

let isListening = false;
let recognition;

micBtn.addEventListener('click', () => {
  if (!isListening) {
    // Start speech recognition

    // Creates a new instance speech recognition object using the first available implementation among the listed options.
    recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition ||
      window.mozSpeechRecognition ||
      window.msSpeechRecognition)();

    recognition.lang = 'en-US';
    recognition.continuous = true; // Continue listening for more commands
    recognition.interimResults = false; // Disable interim results
    recognition.maxAlternatives = 1; // Set max alternatives to 1

    recognition.start();
    micIcon.classList.toggle('active');
    isListening = true;

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
      // Extracts the recognized text from the event object.
      const transcript = event.results[event.results.length - 1][0].transcript;
      const words = transcript
        .toLowerCase() // Convert to lowercase to avoid case sensitivity
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
          pageup: () =>
            window.scrollTo({
              top: window.scrollY - window.innerHeight / 2,
              behavior: 'smooth',
            }),
          pagedown: () =>
            window.scrollTo({
              top: window.scrollY + window.innerHeight / 2,
              behavior: 'smooth',
            }),
        };

        // Find the matching command based on the current word
        const command = Object.keys(commands).find((key) => word.includes(key));
        if (command) {
          commands[command]();
          console.log('Command recognized:', command);
        } else {
          console.log('Command not recognized:', word);
        }
      });
    };

    //Call back function Handle speech recognition errors
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };

    // Handle speech recognition end
    // recognition.onend = () => {
    //   isListening = false;
    //   micIcon.classList.toggle('active');
    //   console.log('Speech recognition ended');
    // };
  } else {
    // Stop speech recognition
    if (recognition) {
      recognition.stop();
    }
    isListening = false;
    micIcon.classList.toggle('active');
    console.log('Speech recognition ended');
  }
});
