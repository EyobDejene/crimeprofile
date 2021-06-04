let timer = setInterval(clock, 1000);
let msec = 00;
let sec = 00;
let min = 00;

function clock() {
  msec += 1;
  if (msec == 60) {
    sec += 1;
    msec = 00;
    if (sec == 60) {
      sec = 00;
      min += 1;
      if (sec % 2 == 0) {
      }
    }
  }
  document.querySelector(".duration").innerHTML = min + ":" + sec + ":" + msec;
}

document.querySelector(".session").innerHTML =  randomnizeSession(133032);
document.querySelector(".user_id").innerHTML = randomnizeUser(1143032);


function randomnizeSession(max){
    return "UID"+Math.floor(Math.random() * max);
}


function randomnizeUser(max){
  return "#"+Math.floor(Math.random() * max);
}