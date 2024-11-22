(function(){
    // Functions
    function buildQuiz(){
      // variable to store the HTML output
      const output = [];
  
      // Add a welcome slide with a Start button
      output.push(
        `<div class="slide welcome-slide">
          <div class="welcome-message">Welcome to the Quiz!<br>Click 'Start Quiz' to begin.</div>
        </div>`
      );
  
      // for each question...
      myQuestions.forEach(
        (currentQuestion, questionNumber) => {
          // variable to store the list of possible answers
          const answers = [];
  
          // and for each available answer...
          for(letter in currentQuestion.answers){
            // ...add an HTML radio button
            answers.push(
              `<label>
                <input type="radio" name="question${questionNumber}" value="${letter}"/>
                ${letter} :
                ${currentQuestion.answers[letter]}
              </label>`
            );
          }
  
          // add this question and its answers to the output
          output.push(
            `<div class="slide">
              <div class="question"> ${currentQuestion.question} </div>
              <div class="answers"> ${answers.join("")} </div>
            </div>`
          );
        }
      );
  
      // finally combine our output list into one string of HTML and put it on the page
      quizContainer.innerHTML = output.join('');
    }

    function startTimer() {
      let timeLeft = 10; // Set the timer for 60 seconds
      const timeDisplay = document.getElementById('time'); // Get the element to show the time
      timeDisplay.textContent = timeLeft;

      // Timer interval
      timerInterval = setInterval(function() {
        timeLeft--; 
        timeDisplay.textContent = timeLeft; // Update the displayed time
        if(timeLeft <= 0) {
          clearInterval(timerInterval); // Stop the timer
          alert('Time is up! Submitting your quiz...');
          showResults(); // Automatically submit the quiz when time runs out
        }
      }, 1000); // Update every second
    }
  
    function showResults(){
      const answerContainers = quizContainer.querySelectorAll('.answers');
      previousButton.style.display = 'none';
      let numCorrect = 0;
      myQuestions.forEach((currentQuestion, questionNumber) => {
        const answerContainer = answerContainers[questionNumber];
        const selector = `input[name=question${questionNumber}]:checked`;
        const userAnswer = (answerContainer.querySelector(selector) || {}).value;
        if(userAnswer === currentQuestion.correctAnswer){
          numCorrect++;
          answerContainers[questionNumber].style.color = 'lightgreen';
        } else {
          answerContainers[questionNumber].style.color = 'red';
        }
      });
      resultsContainer.innerHTML = `${numCorrect} out of ${myQuestions.length}`;
    }
  
    function showSlide(n) {
      slides[currentSlide].classList.remove('active-slide');
      slides[n].classList.add('active-slide');
      currentSlide = n;
      
      // Hide the next button on the welcome slide
      if(currentSlide === 0) {
        previousButton.style.display = 'none';
        nextButton.style.display = 'none'; // Hide next button on the first slide
        retrybutton.style.display = 'none';
      } else if (currentSlide === 1){
        previousButton.style.display = 'none';
        nextButton.style.display = 'inline-block';

      }else{
        previousButton.style.display = 'inline-block';
        nextButton.style.display = 'inline-block'; // Show next button on subsequent slides
      }
      
      // Show submit and retry button on the last slide
      if(currentSlide === slides.length - 1) {
        nextButton.style.display = 'none';
        submitButton.style.display = 'inline-block';
        retrybutton.style.display = 'inline-block';
      } else {
        submitButton.style.display = 'none';
      }
    }
  
    function showNextSlide() {
      showSlide(currentSlide + 1);
    }
  
    function showPreviousSlide() {
      showSlide(currentSlide - 1);
    }

    function resetQuiz() {
        resultsContainer.innerHTML = '';
        const answerContainers = quizContainer.querySelectorAll('.answers');
        answerContainers.forEach(container => {
            const radios = container.querySelectorAll('input[type="radio"]');
            radios.forEach(radio => radio.checked = false);  // uncheck all radio buttons
            container.style.color = '';  // reset color
        });
        currentSlide = 0;
        showSlide(currentSlide);
        submitButton.style.display = 'none';
        retrybutton.style.display = 'none';
        slides.forEach(slide => slide.classList.remove('active-slide'));  // Hide all slides
        slides[0].classList.add('active-slide');  // Show the first slide
        startButton.style.display = "inline-block";
    }
  
    // Variables
    const quizContainer = document.getElementById('quiz');
    const resultsContainer = document.getElementById('results');
    const submitButton = document.getElementById('submit');
    const myQuestions = [
      {
        question: "Who invented JavaScript?",
        answers: {
          a: "Douglas Crockford",
          b: "Sheryl Sandberg",
          c: "Brendan Eich"
        },
        correctAnswer: "c"
      },
      {
        question: "Which one of these is a JavaScript package manager?",
        answers: {
          a: "Node.js",
          b: "TypeScript",
          c: "npm"
        },
        correctAnswer: "c"
      },
      {
        question: "Which tool can you use to ensure code quality?",
        answers: {
          a: "Angular",
          b: "jQuery",
          c: "RequireJS",
          d: "ESLint"
        },
        correctAnswer: "d"
      }
    ];
  
    buildQuiz();
  
    // Pagination
    const previousButton = document.getElementById("previous");
    const nextButton = document.getElementById("next");
    const retrybutton = document.getElementById("retry");
    const slides = document.querySelectorAll(".slide");
    let currentSlide = 0;
    let timerInterval; // Declare the timer interval variable
  
    // Show the first slide
    showSlide(currentSlide);
  
    // Event listeners
    submitButton.addEventListener('click', showResults);
    previousButton.addEventListener("click", showPreviousSlide);
    nextButton.addEventListener("click", showNextSlide);
    retrybutton.addEventListener("click", resetQuiz);

    // Event listener for the Start button
    const startButton = document.getElementById("start");
    startButton.addEventListener('click', function() {
      showSlide(1);  // Move to the first question slide (index 1)
      startButton.style.display = 'none';  // Hide the Start button after click
      startTimer();  // Start the timer
    });
})();

