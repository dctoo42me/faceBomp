document.addEventListener('DOMContentLoaded', function () {
    const startButton = document.getElementById('startButton');
    const scoreDisplay = document.getElementById('scoreDisplay');
    const timerDisplay = document.getElementById('timerDisplay');
    const gameBoard = document.querySelector('.game-board');
    const splatSound = document.getElementById('splat-sound');
    const endHigh = document.getElementById('end-high');
    const endLow = document.getElementById('end-low');

    let score = 0;
    let timer;
    let gameActive = false;
    let timeLeft;

    createGameBoard();

    startButton.addEventListener('click', startGame);
    
    function startGame() {
        // Reset game variables
        startButton.textContent = 'Playing...'
        score = 0;
        gameActive = true;
        updateScore();
        startTimer();
    }

    function startTimer() {
        timeLeft = 30;
        updateTimer();

        timer = setInterval(() => {
            timeLeft--;
            updateTimer();

            if (timeLeft === 0 || timeLeft <0 ) {
                endGame();
            }
        }, 1000); // Update timer every second
    }

    function playEndGame() {
        if (score <= 9) {
            endLow.play();
            endLow.playbackRate = 1.5;
        } else {
            endHigh.play();
        }
    }

    function endGame() {
        gameActive = false;
        clearInterval(timer);
        timerDisplay.textContent = getFinalMessage();
        startButton.textContent = 'Start Game';
        playEndGame();
    }

    function getFinalMessage() {
        if (score === 0) {
            return "You blinked! Try again!";
        } else if (score < 5) {
            return "Nice try! You can do better!";
        } else if (score < 10) {
            return "Great job! Keep improving!";
        } else {
            return "Amazing! You're a FaceBomp Master!";
        }
    }

    function updateScore() {
        scoreDisplay.textContent = `Score: ${score}`;
    }

    function updateTimer() {
        timerDisplay.textContent = `Time: ${timeLeft}`;
    }

    function createGameBoard() {
        gameBoard.innerHTML = '';

        // Create 6 holes with images
        for (let i = 0; i < 6; i++) {
            const hole = document.createElement('div');
            hole.classList.add('hole');
            
            const image = document.createElement('img');
            image.src = 'photo.jpg';
            image.alt = 'Face';

            hole.appendChild(image);
            hole.addEventListener('click', handleImageClick);

            gameBoard.appendChild(hole);
        }

        // Show random images at intervals
        setInterval(showRandomImage, 2000);
    }

    function showRandomImage() {
        if (gameActive) {
            const holes = document.querySelectorAll('.hole');
            const randomHole = holes[Math.floor(Math.random() * holes.length)];
            const image = randomHole.querySelector('img');
    
            // Check if the image is already visible
            if (image.style.transform === 'scale(1)') {
                // If visible, wait for it to disappear before showing the next image
                setTimeout(() => showRandomImage(), 100);
                return;
            }
    
            // Reset image to original scale
            image.style.transition = 'none'; // Disable transition for instant scale change
            image.style.transform = 'scale(1)';
            image.offsetHeight; // Trigger reflow to apply transition immediately
            image.style.transition = ''; // Enable transition again
            
            // Set a timeout for the image to disappear
            setTimeout(() => {
                image.style.transform = 'scale(0)';
    
                // Continue showing the next random image
                setTimeout(() =>  100); // Show the next random image after a short delay
            }, Math.random() * 1000 + 500); // Random interval between 500ms and 1500ms
        }
    }

    function handleImageClick(event) {
        const clickedHole = event.currentTarget;
        const image = clickedHole.querySelector('img');

        
        // Check if the image is currently visible
        if (image.style.transform === 'scale(1)') {
            // If visible, hide the image immediately
            image.style.border = '4px solid red'; // Apply red border
            splatSound.play(); //play splat sound
            splatSound.playbackRate = 4;
            image.style.transform = 'scale(0)';
            // image.style.transition = 'none'; // Disable transition for instant scale change
            image.offsetHeight; // Trigger reflow to apply transition immediately
            image.style.transition = ''; // Enable transition again

            // Increment the score
            score++;
            updateScore(1);
            // Reset border after a short delay
            setTimeout(() => {
                image.style.border = 'none';
            }, 100);
        }
    }
});
