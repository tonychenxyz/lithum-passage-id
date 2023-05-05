// Get a list of all the text files in the directory
const textFiles = [
    'To The Lighthouse - Virginia Woolf.txt',
    "The Translator of Desires: Poems - Muhyiddin Ibn 'Arabi, Michael Sells.txt",
    'Crime and Punishment - Fyodor Dostoevsky, Richard Pevear, Larissa Volokhonsky.txt',
    'Song of Solomon - Toni Morrison.txt',
    'Essays - Michel de Montaigne.txt',
    'Don Quixote - Miguel de Cervantes, Edith Grossman (Translator), Harold Bloom (Editor).txt',
    'Pride and Prejudice - Jane Austen.txt',
    'The Lais of Marie De France: With Two Fur - Marie de France, Burgess Busby (Translator).txt',
    'Confessions-Augustine.txt',
    'Othello - William Shakespeare, Michael Neill (Editor).txt',
    'Inferno - Dante Alighieri, Allen Mandelbaum (Translator).txt',
    'Citizen: An American Lyric - Claudia Rankine.txt',
    'The Posthumous Memoirs of Bras Cubas - Machado De Assis.txt',
  ];
  
  let correctAnswers = 0;
  let incorrectAnswers = 0;
  let contextParagraphs = [];
  let currentFile = '';
  
  document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-button');
    const checkAnswerButton = document.getElementById('check-answer-button');
    const hiddenSentencesElement = document.getElementById('hidden-sentences');
    const contextElement = document.getElementById('context');
    const resultElement = document.getElementById('result');
    const correctRateElement = document.getElementById('correct-rate');
  
    const yesButton = document.getElementById('yes-button');
    const noButton = document.getElementById('no-button');
    const skipButton = document.getElementById('skip-button');
  
    startButton.addEventListener('click', startRound);
    checkAnswerButton.addEventListener('click', checkAnswer);
  
    document.addEventListener('keydown', (event) => {
      if (checkAnswerButton.style.display === 'inline-block' && event.key === 'c') {
        checkAnswer();
      } else if (yesButton.style.display === 'inline-block') {
        if (event.key === 'y') {      handleUserInput('y');
    } else if (event.key === 'n') {
      handleUserInput('n');
    } else if (event.key === 's') {
      handleUserInput('s');
    }
  }
});

function startRound() {
  // Choose a random text file
  const randomFile = textFiles[Math.floor(Math.random() * textFiles.length)];
  currentFile = randomFile;

  // Open the chosen file and read the contents
  fetch(`${randomFile}`)
    .then(response => response.text())
    .then(contents => {
      // Split the contents into sentences
      const sentences = contents.split('. ');

      // Choose a random starting index for the consecutive sentences
      const startIndex = Math.floor(Math.random() * (sentences.length - 3));

      // Extract the consecutive sentences
      const consecutiveSentences = sentences.slice(startIndex, startIndex + 3);

      // Extract the context paragraphs
      const contextStartIndex = Math.max(0, startIndex - 3);
      const contextEndIndex = Math.min(startIndex + 6, sentences.length);
      contextParagraphs = sentences.slice(contextStartIndex, contextEndIndex);

      // Hide the file name in each sentence
      const hiddenSentences = consecutiveSentences.map(sentence => sentence.replace(currentFile, '__________'));

      // Display the hidden sentences
      hiddenSentencesElement.innerHTML = '<p class="underline">Sentence:</p>' + hiddenSentences.join('. ');
      // Show the Check Answer button
      checkAnswerButton.style.display = 'inline-block';
    })
    .catch(error => console.error(error));
}

function checkAnswer() {
  contextElement.innerHTML = `<p class="underline">Answer<\p>: ${currentFile}\n\n<p class="underline">Context<\p>:\n` + contextParagraphs.join('. ');
  checkAnswerButton.style.display = 'none';
  yesButton.style.display = 'inline-block';
  noButton.style.display = 'inline-block';
}

function handleUserInput(input) {
  // Check user input
  if (input === 'y') {
    correctAnswers++;
    resultElement.textContent = 'Correct!';
  } else if (input === 'n') {
    incorrectAnswers++;
    resultElement.textContent = 'Incorrect.';
  } else if (input === 's') {
    // Do nothing
  } else {
    resultElement.textContent = 'Invalid input.';
    return;
  }

  // Calculate and print correct rate
  const totalAnswers = correctAnswers + incorrectAnswers;
  const correctRate = totalAnswers > 0 ? correctAnswers / totalAnswers : 0;
  correctRateElement.textContent = `Correct rate: ${correctRate.toFixed(2)} (${correctAnswers}/${totalAnswers})`;

  // Hide the Yes, No, and Skip buttons
  yesButton.style.display = 'none';
  noButton.style.display = 'none';
  skipButton.style.display = 'none';

  // Start a new round
  setTimeout(startRound, 1); // Adjust the time (in milliseconds) as needed
}

yesButton.onclick = () => handleUserInput('y');
noButton.onclick = () => handleUserInput('n');
skipButton.onclick = () => handleUserInput('s');
});