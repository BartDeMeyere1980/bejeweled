function RandomColor(array){

    return array[Math.floor(Math.random() * array.length)]
}

function RandomNumber(min , max){

   return  min + Math.random() * (max - min)
}