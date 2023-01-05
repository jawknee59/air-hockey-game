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

class Score {
    constructor(text, x, y, color) {
        this.text = text
        this.x = x 
        this.y = y
        this.color = color
        this.render = function () {
            ctx.font = '50px Impact'
            ctx.lineWidth = 2
            ctx.strokeStyle = this.color
            // displays text on canvas
            ctx.strokeText(this.text, this.x, this.y)
        }
    }
}

//////////////////// DRAWING THE ICE RINK ////////////////////
const iceRink = new Rect(30, 30, 460, 600, 'blue')
const centerCircle = new Circle(game.width/2,game.height/2,40,'red')
const centerRing = new Circle(game.width/2, game.height/2,5,'red')
const centerLine1 = new Line(32,330,220,330,'red')
const centerLine2 = new Line(300,330,488,330,'red')
const compGoal = new Rect(160, 30, 200, 50, 'red')
const userGoal = new Rect(160, 580, 200, 50, 'red')
const compScore = new Score('0', 450, 300, 'red')
const userScore = new Score('0', 450, 400, 'blue')

const renderRink = () => {
    iceRink.render()
    centerCircle.render()
    centerRing.render()
    centerLine1.render()
    centerLine2.render()
    compGoal.render()
    userGoal.render()
    compScore.render()
    userScore.render()
}

//////////////////// MALLETS/PUCK CLASS ////////////////////
class GameElement {
    constructor(x, y, radius, color1, color2) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color1 = color1
        this.color2 = color2
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

const compMallet = new GameElement(260, 150, 30, 'red', 'black')
const userMallet = new GameElement(260, game.height - 150, 30, 'blue', 'black')
const puck = new GameElement(game.width/2,game.height/2,15,'green','black')

const renderGameElements = () => {
    compMallet.render()
    userMallet.render()
    puck.render()
}



//////////////////// EVENT LISTENER ////////////////////
///// TO CONTROL USER'S MALLET WITH MOUSE /////

document.addEventListener('mousemove', (e) => {
    var relativeX = e.clientX - game.offsetLeft;
    var relativeY = e.clientY - game.offsetTop;
    // setting 'X' boundaries for user's mallet to not go out of the rink
    if(relativeX > 60 && relativeX < game.width - 60) {
        userMallet.x = relativeX;
    }
    // setting 'Y' boundaries for user's mallet to not go out of the rink
    if(relativeY > 60 && relativeY < game.height - 60){
        userMallet.y = relativeY;
    }    
})

//////////////////// GAME LOOP ////////////////////

const gameLoop = () => {
    ctx.clearRect(0, 0, game.width, game.height)    
    renderRink()
    renderGameElements()
    
}

// this interval runs the game loop every 10ms until we tell it to stop
const gameInterval = setInterval(gameLoop, 10)
// functions stop the game loop
const stopGameLoop = () => { clearInterval(gameInterval)}

document.addEventListener('DOMContentLoaded', function () {
    // here is our gameLoop interval
    gameInterval
})



