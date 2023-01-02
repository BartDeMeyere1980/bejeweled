//variables
let c = $("canvas")[0].getContext("2d")
let canvas = $("canvas")[0]

let width = innerWidth
let height = innerHeight

$("canvas").css("height" , height)
$("canvas").css("width" , width)

$(canvas).prop("height" , height * devicePixelRatio)
$(canvas).prop("width" , width * devicePixelRatio)

let size = 160
let rows = 8
let cols = 8
let offsetX = (canvas.width - (cols * size)) / 2
let offsetY = (canvas.height - (rows * size)) / 2
let gemcolors = ["gold","dodgerblue","lime","tomato","mediumpurple","peru"]
let gamefield = []
let gems = []
let clickedgem = undefined
let pickedgem = undefined
let mousedown = false
let dx , dy
let streaks = []
let floatinggems = []
let streaksound = new Audio("sounds/streak.mp3")
let nostreaksound = new Audio("sounds/nostreak.mp3")
function CreateGameField(){

    for(var i = 0 ; i < rows ; i++){

        gamefield[i] = []

        for(var j = 0 ; j < cols ; j++){

           do{

                gamefield[i][j] = RandomColor(gemcolors)

            }while(isStreak(i,j))
            
        }
    }

}


CreateGameField()

Creategems()

showHints()

function isHorizontalstreak(row , column){

    var color = GetValue(row , column)
    var temp_col = column
    streak = 0

    while(GetValue(row , temp_col) === color){

        streak++
        temp_col--
    }

    temp_col = column + 1

    while(GetValue(row , temp_col) === color){

        streak++
        temp_col++
    }

    return streak
}

function isVerticalstreak(row , column){

    var color = GetValue(row , column)
    var temp_row = row
    streak = 0

    while(GetValue(temp_row , column) === color){

        streak++
        temp_row--
    }

    temp_row = row + 1

    while(GetValue(temp_row , column) === color){

        streak++
        temp_row++
    }

    return streak
}

function isStreak(row , column){

    if(isHorizontalstreak(row , column) > 2 || isVerticalstreak(row , column) > 2){

        return true
    }

    return false
}

function Creategems(){

    for(var i = 0 ; i < rows ; i++){

        for(var j = 0 ; j < cols ; j++){

            gems.push(new Gem(offsetX + size/2 + j * size , offsetY + size/2 + i * size , size * .8  , gamefield[i][j] , i , j))
        }
    }
}

function GetValue(row , column){

    if(gamefield[row] === undefined){

        return false
    }

    if(gamefield[row][column] === undefined){

        return false
    }

    return gamefield[row][column] 
}

function GetStreaks(row , column){

    var color = GetValue(row , column)
    var temp_col = column
    var temp_row = row
    //streaks.push(Getgem(row , column))

    //check on rows
    while(GetValue(row , temp_col) === color){

        if(streaks.indexOf(Getgem(row , temp_col)) === -1){

            streaks.push(Getgem(row , temp_col))
        }

        temp_col--
    }

    temp_col = column + 1

    while(GetValue(row , temp_col) === color){

        if(streaks.indexOf(Getgem(row , temp_col)) === -1){

            streaks.push(Getgem(row , temp_col))
        }

        temp_col++
    }

    //check on columns
    while(GetValue(temp_row , column) === color){

        if(streaks.indexOf(Getgem(temp_row , column)) === -1){

            streaks.push(Getgem(temp_row , column))
        }

        temp_row--
    }

    temp_row = row + 1

    while(GetValue(temp_row , column) === color){

       if(streaks.indexOf(Getgem(temp_row , column)) === -1){

            streaks.push(Getgem(temp_row , column))
        }

        temp_row++
    }


    return streaks
}

function removegems(){

    for(var i = 0 ; i < streaks.length ; i++){

        for(var j = 0 ; j < gems.length ; j++){

            if(streaks[i] === gems[j]){

                gamefield[streaks[i].row][streaks[i].column] = ""
                //floatinggems.push(gems[j])
                CreateMiniGems(gems[j].x , gems[j].y , gems[j])
                gems.splice(j,1)
            }
        }
    }
}

function CreateMiniGems(x , y , gem){

    var minisize = size / 3
    var startX = gem.x - size/2
    var startY = gem.y - size/2

    for(var i = 0 ; i < 3 ; i++){

        for(var j = 0 ; j < 3 ; j++){

            floatinggems.push(new Gem(startX + j * minisize , startY + i * minisize , minisize , gem.color , undefined , undefined))
        }
    }
}

$("canvas").on("mousedown" , function(event){

    mousedown = true

    var xcoord = event.clientX * devicePixelRatio 
    var ycoord = event.clientY * devicePixelRatio

    for(var i = 0 ; i < gems.length ; i++){

        if(gems[i].isInside(xcoord,ycoord)){

            clickedgem = gems[i]
            dx = (event.clientX * devicePixelRatio) - clickedgem.x
            dy = (event.clientY * devicePixelRatio) - clickedgem.y
            return
        }
    }

})

$("canvas").on("mousemove",function(event){

    if(mousedown && clickedgem){

       clickedgem.x = event.clientX * devicePixelRatio - dx
       clickedgem.y = event.clientY * devicePixelRatio - dy

       $("canvas").css("cursor","pointer")
    }
})

$("canvas").on("mouseup" , function(event){

   mousedown = false

   //empty streaks
   streaks = []

   $("canvas").css("cursor","auto")

   var pickedcolumn = Math.floor((event.clientX * devicePixelRatio - offsetX) / size)
   var pickedrow = Math.floor((event.clientY * devicePixelRatio - offsetY) / size)

   pickedgem = Getgem(pickedrow,pickedcolumn)

   if(pickedgem && clickedgem){

        //we have released mouse over gem
        if(isAdjacent(clickedgem.row , clickedgem.column , pickedgem.row , pickedgem.column)){

            //swap colors in gamefield
            SwapgemsArray(clickedgem.row , clickedgem.column , pickedgem.row , pickedgem.column)
           
            if(isStreak(clickedgem.row , clickedgem.column) || isStreak(pickedgem.row , pickedgem.column)){

                Swapgems(clickedgem.row , clickedgem.column , pickedgem.row , pickedgem.column)

                if(isStreak(clickedgem.row , clickedgem.column)){

                    GetStreaks(clickedgem.row , clickedgem.column)
                }
                
                if(isStreak(pickedgem.row , pickedgem.column)){

                    GetStreaks(pickedgem.row , pickedgem.column)
                }
                
                removegems()

                streaksound.play()

            }else{

                SwapgemsArray(clickedgem.row , clickedgem.column , pickedgem.row , pickedgem.column)
                nostreaksound.play()
            }
            
        }else{

            clickedgem.x = clickedgem.oldX
            clickedgem.y = clickedgem.oldY
        }
   }

   if(clickedgem){

    clickedgem.x = clickedgem.oldX
    clickedgem.y = clickedgem.oldY

   }
  

   clickedgem = undefined
   pickedgem = undefined

   //gamefield.forEach(row => {console.log(row)})

   //show hints
   showHints()

})

function isAdjacent(row1 , col1 , row2 , col2){

    if((col2 === col1 - 1 || col2 === col1 + 1) && row1 === row2){

        return true
    }

    if((row2 === row1 - 1 || row2 === row1 + 1) && col1 === col2){

        return true
    }
}

function Getgem(row , column){

    for(var i = 0 ; i < gems.length ; i++){

        if(gems[i].row === row && gems[i].column === column){

            return gems[i]
        }
    }
}

function SwapgemsArray(row1 , col1 , row2 , col2){

    var temp = gamefield[row1][col1]
    gamefield[row1][col1] = gamefield[row2][col2]
    gamefield[row2][col2] = temp

}

function Swapgems(row1 , col1 , row2 , col2){

    //swap colors

    var temp = Getgem(row1 , col1).color 
   
    Getgem(row1 , col1).color = Getgem(row2 , col2).color
  
    Getgem(row2 , col2).color = temp

}

function CanDropgem(){

    for(var i = 0 ; i < rows  ; i++){

        for(var j = 0 ; j < cols ; j++){

            if(!Getgem(i,j) && Getgem(i - 1 , j)){

                return true
            }
        }
    }

    return false
}

function dropgems(){

    for(var i = 0 ; i < rows ; i++){

        for(var j = 0 ; j < cols ; j++){

            if(!Getgem(i,j) && Getgem(i - 1 , j)){

                Getgem(i - 1 , j).y += size 
                Getgem(i - 1 , j).row += 1
                Getgem(i  , j).oldY = Getgem(i  , j).y 
                //update gamefield
                gamefield[i][j] = gamefield[i - 1][j] 
                gamefield[i - 1][j] = ""
                
                
            }
        }
    }
}

function CreateNewgems(){

    for(var i = 0 ; i < rows ; i++){

        for(var j = 0 ; j < cols ; j++){

            if(GetValue(i,j) === ""){

                var newcolor = RandomColor(gemcolors)
                var newgem = new Gem(offsetX + size/2 + j * size , offsetY + size/2 + i * size , size * .8 , newcolor , i , j)
                gems.push(newgem)
                gamefield[i][j] = newcolor
            }
        }
    }
}

function checkOnNewStreaks(){

    for(var i = 0 ; i < rows ; i++){

        for(var j = 0 ; j < cols ; j++){
         
            streaks = []

            if(isStreak(i,j)){

                GetStreaks(i,j)
                removegems()
            }
        }
    }
}

function showHints(){

    var output = ""

    for(var i = 0 ; i < gamefield.length ; i++){

        for(var j = 0 ; j < gamefield[i].length ; j++){

            if(j < cols - 1){

                SwapgemsArray(i , j , i , j + 1)

                if(isStreak(i,j) || isStreak(i,j+1)){

                    output +=  i + "," + j  + "  ->  " + i + "," + (j + 1) + "<br>"
                }

                SwapgemsArray(i , j , i , j + 1)
            }

            if(i < rows - 1){

                SwapgemsArray(i , j , i + 1 , j)

                if(isStreak(i,j) || isStreak(i + 1,j)){

                    output +=  i + "," + j  + "  ->  " + (i + 1) + "," + j + "<br>"
                }

                SwapgemsArray(i , j , i + 1 , j)
            }
        }
    }

    $(".hints").html(output)
}

function renderCanvas(){

    c.clearRect(0,0,canvas.width,canvas.height)

    gems.forEach(gem => {gem.render()})
    
    if(clickedgem){

        clickedgem.render()
    }
   
    //drop gems

    if(CanDropgem()){

        dropgems()

   }else{

        //create new gems
        CreateNewgems()
        //check for new streaks
        checkOnNewStreaks()
   }

   for(var i = 0 ; i < floatinggems.length ; i++){

        if(floatinggems[i].opacity === 0){

            floatinggems.splice(i,1)
        }else{

            floatinggems[i].jump()
        }
   }
    
    requestAnimationFrame(renderCanvas)
}


renderCanvas()