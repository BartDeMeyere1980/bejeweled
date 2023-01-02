class Gem{

    constructor(x , y , size , color , row , column){

        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.oldX = this.x 
        this.oldY = this.y
        this.row = row;
        this.column = column;
        this.velocity = {

            x:RandomNumber(-10,10),
            y:RandomNumber(-15,-20)
        }

        this.opacity = 1
        this.rotation = 0
        this.rotationspeed = RandomNumber(-Math.PI/90 , Math.PI/90)
    }

    render(){


        c.save()
        c.beginPath()
        c.translate(this.x , this.y)
        c.rotate(this.rotation)
        c.fillStyle = this.color
        c.strokeStyle = "white"
        c.globalAlpha = this.opacity
        c.roundRect(-this.size/2 , -this.size/2 , this.size , this.size , this.size/3)
        c.fill()
        c.stroke()
        c.closePath()
        c.restore()
    }

    isInside(x , y){

        if(x > this.x - this.size/2 && x < this.x + this.size/2 && y > this.y - this.size/2 && y < this.y + this.size/2){

            return true
        }
    }

    jump(){

        this.x += this.velocity.x 
        this.y += this.velocity.y

        this.velocity.y += .7

        this.rotation += this.rotationspeed

        if(this.opacity > .01){

            this.opacity -= .01

        }else{

            this.opacity = 0
        }

        this.render()
    }
}