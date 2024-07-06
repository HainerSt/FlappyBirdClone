let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

const newGameBtn = document.getElementById("new-game-btn");

//bird 400/228 = 17/12 ratio
//calculate ratio... 34/24 = 17/12
let fbWidth = 34;
let fbHeight = 24;
let fbX = boardWidth / 8;
let fbY = boardHeight / 2;
let fbImage;

let fb = {
  x: fbX,
  y: fbY,
  width: fbWidth,
  height: fbHeight,
};

//pipes
let pipeArr = [];
//ratio 1/8
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//physics
let velocityX = -2; //pipe moving left speed
let velocityY = 0; //bird jump speed

let gravity = 0.35;

//gameOver
let gameOver = false;
//score
let score = 0;

// canvas / window

window.onload = function () {
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext("2d");

  //draw the bird
  // context.fillStyle= "red";
  // context.fillRect(fb.x, fb.y, fb.width, fb.height);

  //load bird image - pipe image
  fbImage = new Image();
  fbImage.src = "./assets/pngegg.png";
  fbImage.onload = function () {
    //draw bird
    context.drawImage(fbImage, fb.x, fb.y, fb.width, fb.height);
  };

  topPipeImg = new Image();
  topPipeImg.src = "./assets/top-pipe.png";

  bottomPipeImg = new Image();
  bottomPipeImg.src = "./assets/bottom-pipe.png";

  setInterval(placePipes, 1500); //1.5 sec

  document.addEventListener("keydown", moveBird);
  document.addEventListener("click", moveBird);
  
  setTimeout(() => {
    requestAnimationFrame(update);
  }, 1500);
};

function update() {
  requestAnimationFrame(update);
  if (gameOver) {
    return;
  }
  context.clearRect(0, 0, board.width, board.height);

  //bird re-render
  velocityY += gravity;
  fb.y = Math.max(fb.y + velocityY, 0); //limit bird fly on y axis
  context.drawImage(fbImage, fb.x, fb.y, fb.width, fb.height);

  if (fb.y > board.height) {
    gameOver = true;
  }

  //pipes
  for (let i = 0; i < pipeArr.length; i++) {
    let pipe = pipeArr[i];
    pipe.x += velocityX;
    context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

    if (!pipe.passed && fb.x > pipe.x + pipe.width) {
      score += 0.5; // x2 pipes=1
      pipe.passed = true;
    }

    if (detectCollision(fb, pipe)) {
      gameOver = true;
    }
  }

  //clear pipes
  while (pipeArr.length > 0 && pipeArr[0].x < -pipeWidth) {
    pipeArr.shift(); //removes first element from arr
  }

  context.fillStyle = "white";
  context.font = "45px sans-serif";
  context.fillText(score, 5, 45);

  if (gameOver) {
    context.fillText("Game Over", 5, 90);
  }
}

function placePipes() {
  if (gameOver) {
    return;
  }
  let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
  let openingSpace = board.height / 4;

  let topPipe = {
    img: topPipeImg,
    x: pipeX,
    y: randomPipeY,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };
  pipeArr.push(topPipe);

  let bottomPipe = {
    img: bottomPipeImg,
    x: pipeX,
    y: randomPipeY + pipeHeight + openingSpace,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };

  pipeArr.push(bottomPipe);
}

function moveBird(e) {
  if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX" || e.type == "click") {
    velocityY = -6;
    //reset game
    if (gameOver) {
      fb.y = fbY;
      pipeArr = [];
      score = 0;
      gameOver = false;
    }
  }
}

function detectCollision(a, b) {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}
