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
game.width = 520
game.height = 660

//////////////////// DECLARING VARIABLES ////////////////////
let xSpeed = 0
let ySpeed = 0
let compScore = 0
let userScore = 0

//////////////////// CLASSES TO DRAW SHAPES IN CANVAS ////////////////////
class Rect {
    constructor(x, y, width, height, color) {
        this.x = x
        this.y = y 
        this.width = width
        this.height = height
        this.color = color
        this.render = function () {
            ctx.beginPath()
            ctx.lineWidth = 4
            ctx.strokeStyle = this.color
            ctx.strokeRect(this.x, this.y, this.width, this.height)
            ctx.closePath()
        }
    }
}

class Circle {
    constructor (x, y, radius, color) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.render = function () {
            ctx.beginPath()
            ctx.lineWidth = 4
            ctx.strokeStyle = this.color
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
            ctx.stroke()
            ctx.closePath()
        }
    }
}

class Line {
    constructor(x1,y1,x2,y2, color) {
        this.x1 = x1
        this.y1 = y1
        this.x2 = x2
        this.y2 = y2
        this.color = color
        this.render = function() {
            ctx.beginPath()
            ctx.strokeStyle = this.color
            ctx.moveTo(this.x1, this.y1)
            ctx.lineTo(this.x2, this.y2)
            ctx.stroke()
            ctx.closePath()
        }
    }
}
//////////////////// DRAWING THE ICE RINK ////////////////////
const iceRink = new Rect(30, 30, 460, 600, 'blue')
const centerCircle = new Circle(game.width/2, game.height/2, 40, 'red')
const centerRing = new Circle(game.width/2, game.height/2, 5, 'red')
const centerLine1 = new Line(32,330,220,330,'red')
const centerLine2 = new Line(300,330,488,330,'red')
const compGoal = new Rect(160, 30, 200, 50, 'red')
const userGoal = new Rect(160, 580, 200, 50, 'red')

// rendering the ice rink onto canvas
const renderRink = () => {
    iceRink.render()
    centerCircle.render()
    centerRing.render()
    centerLine1.render()
    centerLine2.render()
    compGoal.render()
    userGoal.render()
    // Display scoreboard for comp and user
    ctx.font = "50px Impact"
    ctx.lineWidth = 2
    // comp score text
    ctx.strokeStyle = 'red'
    ctx.strokeText(compScore,450,300)
    ctx.strokeStyle = 'blue'
    // user score text
    ctx.strokeText(userScore,450,400)
}
//////////////////// MALLETS/PUCK CLASS ////////////////////
class GameElement {
    constructor(x, y, radius, color1, color2) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color1 = color1
        this.color2 = color2
        this.speed = 2
        this.render = function () {
            ctx.beginPath()
            ctx.lineWidth = 4
            ctx.fillStyle = this.color1
            ctx.strokeStyle = this.color2
            // draws a circle on canvas
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
            ctx.fill()
            ctx.stroke()
            ctx.closePath()
        }
    }
}

// calling the object to create user/comp's mallet and puck
const compMallet = new GameElement(260, 150, 30, 'red', 'black')
const userMallet = new GameElement(260, game.height - 150, 30, 'blue', 'black')
const puck = new GameElement(game.width/2,game.height/2 + 60,15,'green','black')

// function to render user/comp's mallet and puck
const renderGameElements = () => {
    compMallet.render()
    userMallet.render()
    puck.render()
}

//////////////////// FUNCTION DETECT COLLISION FROM MALLET TO PUCK ////////////////////
// Distance Formula from 2 points 
// calculating the distance from mallets and puck to see when collision is detected
const getDistance = (x1,y1,x2,y2) => {
    const distance = Math.sqrt(
        (x2 - x1) * (x2 - x1) +
        (y2 - y1) * (y2 - y1)
    )
    return distance
}

const hitPuck = (mallet) => {
    // if statement to detect if any of the mallets hit the puck
    // getDistance < 45 for mallet to hit puck 

    if(getDistance(mallet.x, mallet.y, puck.x, puck.y) < 45) {
        //console.log('HIT DETECTED!')
        // when collision detected, changes puck's position w/ puck.speed
        puck.speed = 6
        xSpeed = (puck.x - mallet.x)/45 * puck.speed
        ySpeed = (puck.y - mallet.y)/45 * puck.speed
    } 
    puck.x += xSpeed
    puck.y += ySpeed
    xSpeed *= 1
    ySpeed *= 1

    puckBounce()
}

//////////////////// FUNCTION FOR PUCK BOUNCING OFF THE WALLS ////////////////////
//////////////////// FUNCTION TO KEEP TRACK OF SCORE////////////////////
const puckBounce = () => {
    // 'X' Boundaries to bounce the puck
    if(puck.x + xSpeed > game.width - puck.radius - 45 || 
        puck.x + xSpeed < puck.radius + 45) {
        xSpeed *= -1;
    }
    // Keeping track of scores and resetting puck's position to the middle
    // 'X' & 'Y' coordinates for goal 
    if(puck.x > 175 && puck.x < 345){
        if(puck.y + ySpeed > game.height + puck.radius - 45) {
            //resetting puck's position and speed to the center of the rink when comp scores
            puck.x = game.width/2
            puck.y = game.height/2 + 60
            xSpeed = 0
            ySpeed = 0 
            compScore += 1
        } else if(puck.y + ySpeed < 45 - puck.radius ) {
            //resetting puck's position and speed to the center of the rink when user scores
            puck.x = game.width/2
            puck.y = game.height/2 - 60
            xSpeed = 0
            ySpeed = 0
            userScore += 1
        }
    } else {
        // 'Y' Boundaries to bounce the puck
        if(puck.y + ySpeed > game.height - puck.radius - 45 || 
        puck.y + ySpeed  < 45 + puck.radius) {
        ySpeed *= -1
        } 
    } 
}

//////////////////// FUNCTION FOR COMP MOVEMENT ////////////////////
const compMovement = () => {
    //compMallet starting pos = (260, 150)
    // iceRink (x1 = 30, y1 = 30, x2 = 460, y2 = 600,
    // Setting compMallet's boundaries to not go off the screen
    if(compMallet.x < 30) {
        compMallet.x = 60
    }
    if(compMallet.x > 460) {
        compMallet.x = 490
    } 
    if(compMallet.y < 30) {
        compMallet.y = 90
    }
    if(compMallet.y > 600) {
        compMallet.y = 600
    }
    
    // Make compMallet.y move up and down when puck.y crosses center rink
    if(puck.y < game.height / 2){
        if(puck.y - 15 > compMallet.y) {
            compMallet.y += compMallet.speed
        } else {
            compMallet.y -= compMallet.speed
        }
    } else if(compMallet.y > 150) {
        compMallet.y -= compMallet.speed
    
    } else if(compMallet.y < 150) {
        compMallet.y += compMallet.speed
    }
    // Make compMallet.x move towards the puck.x position
    if(compMallet.x < puck.x) {
        compMallet.x += compMallet.speed
    }
    if(compMallet.x > puck.x) {
        compMallet.x -= compMallet.speed
    }

    hitPuck(compMallet)
}
//////////////////// EVENT LISTENER ////////////////////
////////// TO CONTROL USER'S MALLET WITH MOUSE //////////
document.addEventListener('mousemove', (e) => {
    var relativeX = e.clientX - game.offsetLeft;
    var relativeY = e.clientY - game.offsetTop;
    // setting 'X' boundaries for user's mallet to not go out of the rink
    if(relativeX > 60 && relativeX < game.width - 60) {
        userMallet.x = relativeX;
    }
    // setting 'Y' boundaries for user's mallet to not go out of the rink
    if(relativeY > game.height/2 && relativeY < game.height - 60){
        userMallet.y = relativeY;
    }    
})

////////////////////// TESTING PURPOSES TO CONTROL COMP'S MALLET MOVEMENT //////////////////////  
// document.addEventListener('mousemove', (e) => {
//     var relativeX = e.clientX - game.offsetLeft;
//     var relativeY = e.clientY - game.offsetTop;
//     // setting 'X' boundaries for user's mallet to not go out of the rink
//     if(relativeX > 60 && relativeX < game.width - 60) {
//         compMallet.x = relativeX;
//     }
//     // setting 'Y' boundaries for user's mallet to not go out of the rink
//     if(relativeY > 60 && relativeY < game.height/2){
//         compMallet.y = relativeY;
//     }    
// })

////////////////////// TESTING PURPOSES TO CONTROL PUCK'S MOVEMENT //////////////////////  
// document.addEventListener('mousemove', (e) => {
//     var relativeX = e.clientX - game.offsetLeft;
//     var relativeY = e.clientY - game.offsetTop;
//     // setting 'X' boundaries for user's mallet to not go out of the rink
//     if(relativeX > 40 && relativeX < game.width - 40) {
//         puck.x = relativeX;
//     }
//     // setting 'Y' boundaries for user's mallet to not go out of the rink
//     if(relativeY > 40 && relativeY < game.height - 40){
//         puck.y = relativeY;
//     }    
// })

//////////////////// GAME LOOP ////////////////////
const gameLoop = () => {
    ctx.clearRect(0, 0, game.width, game.height)    

    // End game for the first one to 5 points
    if(compScore === 5) {
        stopGameLoop()
        ctx.textAlign = 'center'
        ctx.font = "50px Arial"
        ctx.fillStyle = 'red'
        ctx.fillText('YOU LOSE!',game.width/2,game.height/2 - 100)
    } else if (userScore === 5){
        stopGameLoop()
        ctx.textAlign = 'center'
        ctx.font = "50px Arial"
        ctx.fillStyle = 'blue'
        ctx.fillText('YOU WIN!',game.width/2,game.height/2 - 100)
        
    }

    renderRink()
    renderGameElements()
    compMovement()
    hitPuck(userMallet)
}

// this interval runs the game loop every 10ms until we tell it to stop
const gameInterval = setInterval(gameLoop, 10)
// functions stop the game loop
const stopGameLoop = () => { clearInterval(gameInterval)}

document.addEventListener('DOMContentLoaded', function () {
    // here is our gameLoop interval
    gameInterval
})



