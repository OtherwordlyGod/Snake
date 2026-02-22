const gameCanvas = document.getElementById('gameCanvas');
const container = document.getElementById('container');
const scoreBoard = document.getElementById('score');
const ctx = gameCanvas.getContext('2d');
let gameLoop;



let snake = [  
  {x: 150, y: 150},  
  {x: 140, y: 150},  
  {x: 130, y: 150},  
  {x: 120, y: 150},  
  {x: 110, y: 150},
];



let foodX;
let foodY;
let score = 0;


let dx = 10;

let dy = 0;




document.addEventListener('keydown', changeDirection);

function drawSnake() {
  snake.forEach(drawSnakePart);
};

function drawSnakePart(snakePart) {
  ctx.fillStyle = 'lightgreen';
  ctx.strokeStyle = 'darkgreen';
  
  ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
  ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
};

function changeDirection(event) {
  const left = 'ArrowLeft';
  const right = 'ArrowRight';
  const up = 'ArrowUp';
  const down = 'ArrowDown';
  
  const keyPressed = event.key;
  
  const goingLeft = dx === -10;
  const goingRight = dx === 10;
  const goingUp = dy === -10;
  const goingDown = dy === 10;
  
  if (keyPressed === left && !goingRight) {
    dx = -10;
    dy = 0;
  }
  if (keyPressed === right && !goingLeft) {
    dx = 10;
    dy = 0;
  }
  if (keyPressed === up && !goingDown) {
    dx = 0;
    dy = -10;
  }
  if (keyPressed === down && !goingUp) {
    dx = 0;
    dy = 10;
  }
};

function randomTen(min, max) {
  const rand = Math.floor(Math.random() * (max - min + 1)) + min;
  return Math.round(rand / 10) * 10;
}

function generateFoodCoords() {
  foodX = randomTen(0, gameCanvas.width - 10);
  foodY = randomTen(0, gameCanvas.height - 10);
  
  snake.forEach(function isOnSnake(part) {
    const foodIsOnSnake = part.x === foodX && part.y === foodY;
    if (foodIsOnSnake) {
      generateFoodCoords();
    };
  });
};

function drawFood() {
  ctx.strokeStyle = 'darkred';
  ctx.fillStyle = 'red';
  ctx.fillRect(foodX, foodY, 10, 10); 
  ctx.strokeRect(foodX, foodY, 10, 10);
};

function updateScore() {
  score++;
  scoreBoard.textContent = score;
};

function advanceSnake() {
  const head = {x: snake[0].x + dx, y: snake[0].y + dy};
  if (head.x === foodX && head.y === foodY) {
    snake.unshift(head);
    generateFoodCoords();
    updateScore();
  } else {
    snake.unshift(head);
    snake.pop();
  };
};



function checkForCollisions() {
  const head = {x: snake[0].x + dx, y: snake[0].y + dy};
  
  for (let i = 3; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
    return true;
    }
  };
  
  if (head.x === gameCanvas.width || head.y === gameCanvas.height || head.x === -10 || head.y === -10) {
    return true;
  };
};



function clearCanvas() {
  ctx.strokeStyle = 'black';
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);  
  ctx.strokeRect(0, 0, gameCanvas.width, gameCanvas.height);

};

function gameOver() {
  // Stop the game by not calling main again
  clearTimeout(gameLoop);
  
  scoreBoard.textContent = 'Game Over!';
  
  // Show Game Over text on canvas
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
  ctx.fillStyle = 'black';
  ctx.font = '40px ariel';
  ctx.textAlign = 'center';
  ctx.fillText('Score: ' + score, gameCanvas.width / 2, gameCanvas.height / 2 + 50);
  
  const button = document.createElement('button');
  button.textContent = 'Restart';
  container.appendChild(button);

  button.addEventListener("click", () => {
    // Reset game state
    snake = [
      {x: 150, y: 150},
      {x: 140, y: 150},
      {x: 130, y: 150},
      {x: 120, y: 150},
      {x: 110, y: 150},
    ];
    dx = 10;
    dy = 0;
    score = 0;
    scoreBoard.textContent = score;
    container.removeChild(button); // remove the button
    generateFoodCoords();          // new food
    main();                        // restart game
  });
};

function main() {
  gameLoop = setTimeout(function onTick() {
    if (checkForCollisions()){
      gameOver();
      return;
    }
    clearCanvas();
    drawFood();
    advanceSnake();
    drawSnake();
    main();
  }, 100);
};
generateFoodCoords();
main();
