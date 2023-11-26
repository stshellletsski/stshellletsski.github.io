const sequence = [];
const tileSounds = [];
const sounds = ["./sounds/red.mp3", "./sounds/green.mp3", "./sounds/yellow.mp3", "./sounds/blue.mp3", "./sounds/wrong.mp3", "./sounds/intro.mp3"];
const tile = document.querySelectorAll(".tile");
const introMusic = new Audio(sounds[5]);
let clickCounter = 0;
let instructions = document.querySelector("h1");
let lostGame = false;
let gameOverInterval;
const gameOverTimeout = [];
start();

// 1) start page
// add keydown listener to document and click listener to red square
// add bg music Credit: https://www.FesliyanStudios.com Background Music: Boss Time
function start () {
    document.addEventListener("keydown", startGame);
    tile[0].addEventListener("click", startGame);
    
    // bg music
    introMusic.play();
    introMusic.loop = true;
    introMusic.volume = 0.1;
}

// 1a removal of listeners and processing further
function startGame () {
    //introMusic.volume = 0.05;
    tile[0].removeEventListener("click", startGame);
    document.removeEventListener("keydown", startGame)
    rules();
}

// 2) rules
function rules () {
    let intervalId = setInterval(demo, 1500);
    instructions.innerHTML = 'Rules: tap on <span class = "glowing">highlighted</span> tiles in sequence';
    setTimeout(()=>{instructions.innerHTML = 'Every level adds one tile';}, 4000);
    setTimeout(()=>{instructions.innerHTML = 'Ready? Go!';}, 8000);
    setTimeout(()=>{clearInterval(intervalId)}, 7000);
    setTimeout(()=>{setup()}, 8800);    
}

// 2a) setup tile elements and go!
function setup () {
    // forEach will pass array element as parameter
    tile.forEach(setUpTile);
    tileSounds.push(new Audio(sounds[4]));
    gamePlay();
}

// 3) game play
function gamePlay() {
    levelDisplay();
    sequenceGenerator();
}

// 4) tile sequence generator
function sequenceGenerator() {
    // forEach will pass array element as parameter
    sequence.push(randomk4());
    let lastTile = sequence[sequence.length - 1];
    animation(lastTile);
    playSound(lastTile);
}

// 5) validator
function validator (registeredTileIndex) {
    if (Number(registeredTileIndex) === sequence[clickCounter]) {
        clickCounter++;   
    } else {
        playSound(4);
        zonk();
        lostGame = true;
        gameOver();
        gameOverInterval = setInterval(()=>{gameOver();}, 8000); 
    }

    if(clickCounter === sequence.length) {
        clickCounter = 0;
        setTimeout(()=>{gamePlay()}, 800) 
    }
}

// reset to new game
function reset () {
    clickCounter = 0;
    sequence.splice(0);
    lostGame = false;
    clearInterval(gameOverInterval);
    for (let i = 0; i < gameOverTimeout.length; i++) {
        clearTimeout(gameOverTimeout[i]);
    }
    setTimeout(()=>{gamePlay()}, 800); 
}

// game over
function gameOver () {
    let text1 = '<span class = "glowing">Game Over!</span>';
    let text2 = 'tap <span class="glowing">any</span> tile to play again';
    gameOverTimeout[0] = setTimeout(()=>{instructions.innerHTML = text1;}, 0);  
    gameOverTimeout[1] = setTimeout(()=>{instructions.innerHTML = text2;}, 4000);
}

// click listener
function clickListener (click) {
    //  click event has been registered on event.target. DO THIS:
    clickAnimation(click.target);
    playSound(tileElement2Index(click.target));
    
    if(lostGame) {
        reset();
    } else {
        validator(tileElement2Index(click.target));
    }    
}

// tile element to tile index converter
function tileElement2Index (tileElement) {
    return tileIndex = Object.keys(tile).find((key) => tile[key] === tileElement);
}

// setup tiles and populate tile sounds
function setUpTile (tileElement) {
    tileElement.addEventListener("click", clickListener);
    tileSounds.push(new Audio(sounds[tileElement2Index(tileElement)]));
}

// level display
function levelDisplay () {
    instructions.innerHTML = `Level: <span class = "glowing">${sequence.length + 1}</span>`;
}

// zonk
function zonk () {
    let body = document.body;
    for (let i = 0; i < 3; i++ ){
        setTimeout(()=>{body.classList.add("zonk");}, (100 + i*200));
        setTimeout(()=>{body.classList.remove("zonk");}, (200 + i*200));
    }
}

// animation
function animation (tileIndex) {
    tile[tileIndex].classList.add("animation");
    setTimeout(()=>{tile[tileIndex].classList.remove("animation");},1000);
}

// clickAnimation
function clickAnimation (tileElement) {
    tileElement.classList.add("clicked");
    setTimeout(()=>{tileElement.classList.remove("clicked");},100);
}

// play sound
function playSound(tileIndex) {
    tileSounds[tileIndex].play();
}

// demo
function demo () {
    animation (randomk4());
}

// k4 random number gen
function randomk4 () {
    return Math.floor(Math.random() * 4);
}