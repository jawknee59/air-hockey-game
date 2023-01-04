// requirements and goals
// make an air hockey game using canvas that we manipulate in js

//////////////////// RULES FOR THE GAME ////////////////////
// Players have one mallet on the rink
// The puck starts in the middle of the rink 
// Use the mallet to strike the puck on the opposing side's goal
// Mallet can not cross the center of the rink's line
// When puck crosses the goal line, that counts as a goal 
// First one to five goals win the game
//////////////////// END RULES ////////////////////

//////////////////// INITIAL SETUP ////////////////////

// first grab our HTML elements for easy reference later
const game = document.getElementById('canvas')
// setting the game's context to 2d
// saving that context to a variable for reference later
// this is how we will tell code to work within the context of the canvas
const ctx = game.getContext('2d')
// setting the game's canvas for the rink
game.width = 500
game.height = 700


//////////////////// MALLET CLASS ////////////////////
// creating a mallet class for computer and player
class Element {
    constructor(x, y, width, height, color) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.color = color
        this.speed = 1
        this.gravity = 1
        this.render = function () {
            ctx.fillStyle = this.color
            ctx.fillRect(this.x, this.y, this.width, this.height)
        }
    }
}

const computerMallet = new Element(250, 100, 50, 50, 'red')
const playerMallet = new Element(250, game.height-100, 50, 50, 'blue')
const puck = new Element(game.width/2, game.height/2, 25, 25, 'black')

//////////////////// RENDER MALLET & PUCK HERE ////////////////////
const renderElements = () => {
    ctx.clearRect(0, 0, game.width, game.height)
    computerMallet.render()
    playerMallet.render()
    puck.render()
}

//////////////////// PUCK BOUNCE FUNCTION ////////////////////
const puckBounce = () => {
    if (puck.y + puck.gravity <= 0 || puck.y + puck.gravity >= game.height) {
        puck.gravity = puck.gravity * -1
        puck.y += puck.gravity
        puck.x += puck.speed
    } else {
        puck.y += puck.gravity
        puck.x += puck.speed
    }
    puckWallCollision()
}

//////////////////// PUCK-WALL COLLISION FUNCTION ////////////////////
const puckWallCollision = () => {
    // if (puck.x + puck.speed <= 0 || puck.x + puck.speed + puck.width >= game.width) {
    //     puck.y += puck.gravity
    //     puck.speed = puck.speed * -1
    //     puck.x += puck.speed
    // } else {
    //     puck.y += puck.gravity
    //     puck.x += puck.speed
    // }

    if (
        (puck.y + puck.gravity <= computerMallet.y + computerMallet.height &&
        puck.x + puck.width + puck.speed >= computerMallet.x &&
        puck.y + puck.gravity > computerMallet.y) ||
        (puck.y + puck.gravity > playerMallet.y &&
        puck.x + puck.speed <= playerMallet.x + playerMallet.width)
    ) {
        puck.speed = puck.speed * -1
    } else if (puck.x + puck.speed < playerMallet.x){
        //scoreTwo += 1
        puck.speed = puck.speed * -1
        puck.x = 100 + puck.speed
        puck.y += puck.gravity

    } else if (puck.x + puck.speed > computerMallet.x + computerMallet.width){
        //scoreOne += 1
        puck.speed = puck.speed * -1
        puck.x = 100 + puck.speed
        puck.y += puck.gravity

    }
    renderElements()
}

//////////////////// EVENT LISTENERS ////////////////////
// control player's mallet w/ mouse event
document.addEventListener('mousemove', (e) => {
    // creating variable to have cursor's movement in the center of the mallet
    const relativeX = e.clientX - game.offsetLeft-25
    const relativeY = e.clientY - game.offsetTop-25
    
    
    // Creating boundary so playerMallet does not go off screen
    // playerMallet's (x,y) coordinates adjusting according to cursor placement
    if(relativeX > 0 && relativeX < game.width - 50) {
        playerMallet.x = relativeX
    }
    if(relativeY > 0 && relativeY < game.height - 50){
        playerMallet.y = relativeY
    }
    // // For playerMallet to not cross the half-way point of game
    // if(relativeY > game.height/2 && relativeY < game.height - 50){
    //     playerMallet.y = relativeY
    // }
    
})

//////////////////// GAME LOOP ////////////////////
const gameLoop = () => {
    //renderElements()
    puckBounce()
    
}


// this interval runs the game loop every 10ms until we tell it to stop
const gameInterval = setInterval(gameLoop, 10)
// functions stop the game loop
const stopGameLoop = () => { clearInterval(gameInterval)}

document.addEventListener('DOMContentLoaded', function () {
    // here is our gameLoop interval
    gameInterval
})

