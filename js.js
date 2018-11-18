document.addEventListener('DOMContentLoaded', function (){




let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

ctx.deltaTime = 0
function delta(ctx) {
    var i = 1;
    var lastTime
    var nowTime

    function calculate() {     
        nowTime = performance.now();
        ctx.deltaTime = (nowTime - (lastTime || nowTime))/1000;
        lastTime = nowTime;
        if (i < 100) {  
            i++
            requestAnimationFrame(calculate)
        }
    }
    calculate()
}
delta(ctx)

var areaObjects = []

document.addEventListener('keydown', start, false)
document.addEventListener('keyup', stop, false)
var leftPressed
var rightPressed
var upPressed
var downPressed

function start(e) {
    switch (e.keyCode) {
        case 39:
            rightPressed = true
            break;
        case 37:
            leftPressed = true
            break;
        case 38:
            upPressed = true
            break;
        case 40:
            downPressed = true
            break;
    }
    
}
function stop(e)
{
	switch (e.keyCode) {
        case 39:
            rightPressed = false
            break;
        case 37:
            leftPressed = false
            break;
        case 38:
            upPressed = false
            break;
        case 40:
            downPressed = false
            break;
    }
}


class Object {
    constructor(props) {
        this.x = props.x;
        this.y = props.y;
        this.color = props.color;
        this.speed = props.speed
        this.directionX = props.directionX
        this.directionY = props.directionY
        
        this.__addToArea()
        this.id = this.__generateGUID()
        this.__leftCollision = false
        this.__rightCollision = false
    }

    __generateGUID() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
        let guid = s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
        return guid
    }
    __deltaSpeed() {
        return this.speed*ctx.deltaTime
    }
    __addToArea() {
        areaObjects.push(this)
    }

    __moving() {
        this.__movingX(this.__deltaSpeed())
        this.__collisionDetect()
    }
    __movingX(deltaSpeed) {    
        this.x += this.directionX*deltaSpeed;
    }

    __collisionDetect() {
        for (let i = 0; i < areaObjects.length; i++) {
            if (this.id != areaObjects[i].id) {

                if (this.__checkLeftCollision(this, areaObjects[i])) {
                    this.__leftCollision = true
                    return areaObjects[i]
                }
                else this.__leftCollision = false

                if (this.__checkRightCollision(this, areaObjects[i])) {
                    this.__rightCollision = true
                    return areaObjects[i]
                }
                else this.__rightCollision = false
            }
        }
    }



    __checkLeftCollision(obj1,obj2) {         
        if ((obj1.x > obj2.x) && (obj1.x < obj2.x + obj2.width) && (obj1.y + obj1.height > obj2.y) && (obj1.y < obj2.y + obj2.height)) {
            return true
        }
        else return false
    }
    __checkRightCollision(obj1,obj2) {         
        if ((obj1.x + obj1.width > obj2.x) && (obj1.x + obj1.width < obj2.x + obj2.width) && (obj1.y + obj1.height > obj2.y) && (obj1.y < obj2.y + obj2.height)) {
            return true
        }
        else false
    }

};



class Rectangle extends Object {
    constructor(props) {
        super(props)  
        this.width = props.width
        this.height = props.height
    }
}

class Wall extends Rectangle{
    drow() {
        ctx.beginPath();
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = this.color;
        ctx.fill();    
        ctx.closePath();
    }
}

class Player extends Rectangle{
    drow() {
        ctx.beginPath();
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = this.color;
        ctx.fill();    
        ctx.closePath();
        this.__controlledMovement() 
  
    }
    __controlledMovement () {                
        if (leftPressed) {
            if (!this.__leftCollision) {  
                this.directionX = -1
            }
            else {
                this.directionX = 0
            }
            this.__moving()
        }

        if (rightPressed) {
            if (!this.__rightCollision) {  
                this.directionX = 1
            }
            else {
                this.directionX = 0
            }
            this.__moving()
        }

        if (upPressed) {
            this.y -= 1
        }
        if (downPressed) {
            this.y += 1
        }
    }
}

let fPlayer = new Player({
    x: 430,
    y: 100,
    color: '#0095DD',
    speed: 200,
    directionX: 0,
    directionY: 0,
    width: 10,
    height: 10
})

function createBorder() {
    let borderWeight = 10
    let leftBorder = {
        x: 0,
        y: 0,
        color: '#0095DD',
        speed: 0,
        directionX: 0,
        directionY: 0,
        width: borderWeight,
        height: canvas.height
    }
    let rightBorder = {
        x: canvas.width - borderWeight,
        y: 0,
        color: '#0095DD',
        speed: 0,
        directionX: 0,
        directionY: 0,
        width: borderWeight,
        height: canvas.height
    }
    let topBorder = {
        x: 0,
        y: 0,
        color: '#0095DD',
        speed: 0,
        directionX: 0,
        directionY: 0,
        width: canvas.width,
        height: borderWeight
    } 
    let bottomBorder = {
        x: 0,
        y: canvas.height - borderWeight,
        color: '#0095DD',
        speed: 0,
        directionX: 0,
        directionY: 0,
        width: canvas.width,
        height: borderWeight
    }

    let borders = []
    borders.push(leftBorder)
    borders.push(rightBorder)
    borders.push(topBorder)
    borders.push(bottomBorder)

    for (let i = 0; i < borders.length; i++) {
        new Wall(borders[i])
    }
}
createBorder()

new Wall({
    x: 200,
    y: 100,
    color: '#0095DD',
    speed: 0,
    directionX: 0,
    directionY: 0,
    width: 10,
    height: 100
} )


new Wall({
    x: 400,
    y: 100,
    color: '#0095DD',
    speed: 0,
    directionX: 0,
    directionY: 0,
    width: 10,
    height: 100
} )

function canvasDrow() {
    ctx.clearRect(0, 0, 1000, 1000);
    for (let i = 0; i < areaObjects.length; i++) {
        areaObjects[i].drow()
    }
    requestAnimationFrame(function() {
        canvasDrow()
    })
}

canvasDrow()


})

