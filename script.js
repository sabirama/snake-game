document.addEventListener('DOMContentLoaded', () => {
    const settingsContainer = document.getElementById('settings');
    const gridSizeInput = document.getElementById('grid-size');
    const startButton = document.getElementById('start-button');
    const gameContainer = document.getElementById('game-container');
    const board = document.getElementById('game-board');
    const scoreDisplay = document.getElementById('score');
    const highScoreDisplay = document.getElementById('high-score');
    const messageDisplay = document.getElementById('message');
    const cellSize = 20;
    let gridSize;
    let snake;
    let direction;
    let nextDirection;
    let food;
    let gamePaused;
    let intervalId;
    let score;
    let highScore;
  
    function initializeGame() {
        gridSize = parseInt(gridSizeInput.value) || 15;
        snake = [
          { x: Math.floor(gridSize / 2), y: 1 },
          { x: Math.floor(gridSize / 2) - 1, y: 1 },
          { x: Math.floor(gridSize / 2) - 2, y: 1 }
        ];
        direction = 'right';
        nextDirection = 'right';
        food = { x: 10, y: 10 };
        gamePaused = false;
        score = 0;
        highScore = getHighScore();
    
        board.style.width = `${gridSize * cellSize}px`;
        board.style.height = `${gridSize * cellSize}px`;

        draw();
        updateScoreDisplay();
        hideMessage();
        startGame();
      }
    
  
    function draw() {
      board.innerHTML = '';
  
      // Draw snake
      snake.forEach((segment, index) => {
        const snakeElement = document.createElement('div');
        snakeElement.classList.add('snake');
        if (index === 0) {
          snakeElement.classList.add('head');
        } else if (index === snake.length - 1) {
          snakeElement.classList.add('tail');
        }
        snakeElement.style.left = `${segment.x * cellSize}px`;
        snakeElement.style.top = `${segment.y * cellSize}px`;
        board.appendChild(snakeElement);
      });
  
      // Draw food
      const foodElement = document.createElement('div');
      foodElement.classList.add('food');
      foodElement.style.left = `${food.x * cellSize}px`;
      foodElement.style.top = `${food.y * cellSize}px`;
      board.appendChild(foodElement);
  
      // Update score display
      updateScoreDisplay();
  
      // Update high score display
      updateHighScoreDisplay();
    }
  
    function updateScoreDisplay() {
      scoreDisplay.textContent = `Score: ${score}`;
    }
  
    function updateHighScoreDisplay() {
      highScoreDisplay.textContent = `High Score: ${highScore}`;
    }
  
    function move() {
      if (gamePaused) {
        return;
      }
  
      const head = { ...snake[0] };
  
      // Set the direction to the nextDirection
      direction = nextDirection;
  
      switch (direction) {
        case 'up':
          head.y -= 1;
          break;
        case 'down':
          head.y += 1;
          break;
        case 'left':
          head.x -= 1;
          break;
        case 'right':
          head.x += 1;
          break;
      }
  
      snake.unshift(head);
  
      // Check if snake eats food
      if (head.x === food.x && head.y === food.y) {
        generateFood();
        score++;
  
        // Update high score if needed
        if (score > highScore) {
          highScore = score;
          saveHighScore(highScore);
        }
      } else {
        snake.pop();
      }
  
      // Check for collisions
      if (
        head.x < 0 || head.y < 0 ||
        head.x >= gridSize || head.y >= gridSize ||
        collisionWithSelf()
      ) {
        gameOver();
      }
  
      draw();
    }
  
    function collisionWithSelf() {
      for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
          return true;
        }
      }
      return false;
    }
  
    function generateFood() {
      food = {
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize)
      };
  
      // Regenerate if the food is on the snake
      for (const segment of snake) {
        if (food.x === segment.x && food.y === segment.y) {
          generateFood();
          break;
        }
      }
    }
  
    function startGame() {
        gameContainer.style.display = 'block';
        settingsContainer.style.display = 'none';

         // Add mobile controls
        if (isMobile()) {
            addMobileControls();
        }
        
        intervalId = setInterval(move, 150);
      }
    
    function isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    function addMobileControls() {
        document.addEventListener('touchstart', handleTouchStart);
        document.addEventListener('touchmove', handleTouchMove);
      }
    
      function handleTouchStart(event) {
        startX = event.touches[0].clientX;
        startY = event.touches[0].clientY;
      }
    
      function handleTouchMove(event) {
        if (!startX || !startY) {
          return;
        }
    
        const endX = event.touches[0].clientX;
        const endY = event.touches[0].clientY;
    
        const deltaX = endX - startX;
        const deltaY = endY - startY;
    
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          // Horizontal swipe
          if (deltaX > 0 && direction !== 'left') {
            nextDirection = 'right';
          } else if (deltaX < 0 && direction !== 'right') {
            nextDirection = 'left';
          }
        } else {
          // Vertical swipe
          if (deltaY > 0 && direction !== 'up') {
            nextDirection = 'down';
          } else if (deltaY < 0 && direction !== 'down') {
            nextDirection = 'up';
          }
        }
    
        startX = null;
        startY = null;
      }
  
    function resetGame() {
      gameContainer.style.display = 'none';
      settingsContainer.style.display = 'block';
      clearInterval(intervalId);
    }
  
    function gameOver() {
      showMessage(`Game Over! Your score is ${score}. Press space to play again.`);
      resetGame();
    }
  
    function showMessage(message) {
      messageDisplay.textContent = message;
      messageDisplay.classList.remove('hidden');
    }
  
    function hideMessage() {
      messageDisplay.textContent = '';
      messageDisplay.classList.add('hidden');
    }
  
    function getHighScore() {
      return parseInt(localStorage.getItem('highScore')) || 0;
    }
  
    function saveHighScore(newHighScore) {
      localStorage.setItem('highScore', newHighScore);
      updateHighScoreDisplay();
    }
  
    document.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction !== 'down') nextDirection = 'up';
          break;
        case 'ArrowDown':
          if (direction !== 'up') nextDirection = 'down';
          break;
        case 'ArrowLeft':
          if (direction !== 'right') nextDirection = 'left';
          break;
        case 'ArrowRight':
          if (direction !== 'left') nextDirection = 'right';
          break;
        case ' ':
          if (gamePaused) {
            initializeGame();
          } else {
            togglePause();
          }
          break;
      }
    });

    function addMobileControls() {
      document.getElementById('up-button').addEventListener('click', () => {
        if (direction !== 'down') nextDirection = 'up';
      });
  
      document.getElementById('down-button').addEventListener('click', () => {
        if (direction !== 'up') nextDirection = 'down';
      });
  
      document.getElementById('left-button').addEventListener('click', () => {
        if (direction !== 'right') nextDirection = 'left';
      });
  
      document.getElementById('right-button').addEventListener('click', () => {
        if (direction !== 'left') nextDirection = 'right';
      });
  
      document.addEventListener('touchstart', handleTouchStart);
      document.addEventListener('touchmove', handleTouchMove);
    }
  
    startButton.addEventListener('click', initializeGame);
  
    function togglePause() {
        gamePaused = !gamePaused;
        if (gamePaused) {
          clearInterval(intervalId);
        } else {
          intervalId = setInterval(move, 150);
        }
      }
  });