var timerId = -1;

var totalTime = 0;
var current = 0;

var dashArray, dashOffset;

var hour, minute, second, hourinput, minuteinput, playbtn, resetbtn, recordbtn;

hour = document.getElementById("hour");
minute = document.getElementById("minute");
second = document.getElementById("second");

hourinput = document.getElementById("hourinput");
minuteinput = document.getElementById("minuteinput");

resetbtn = document.getElementById('resetbutton');
recordbtn = document.getElementById('recordbutton');
playbtn = document.getElementById("playbutton");

resetbtn.addEventListener('click', handleReset);
playbtn.addEventListener('click', handlePlay);
recordbtn.addEventListener('click', handleRecord);

resetUI();

chrome.runtime.sendMessage({type: 'GET_TOTALTIME'});

chrome.runtime.onMessage.addListener(function(request, sender, response) {
  if(request.type === "SET_CURRENT") {
    console.log('asdfasdf', request.payload);
    current = request.payload;
    animateUI();
  }
  if(request.type === "SET_TOTALTIME") {
    alert(request.payload);
    totalTime = request.payload;
  }
})

function animateUI() {
  hour.innerHTML = Math.floor((totalTime - current) / 24 / 3600)
    .toString(10)
    .padStart(2, "0");
  minute.innerHTML = Math.floor(((totalTime - current) / 24 / 60) % 60)
    .toString(10)
    .padStart(2, "0");
  second.innerHTML = Math.floor(((totalTime - current) / 24) % 60)
    .toString(10)
    .padStart(2, "0");

  dashOffset = dashArray - (dashArray * current) / totalTime;
  animatedCircle.setAttribute("stroke-dasharray", dashArray);
  animatedCircle.setAttribute("stroke-dashoffset", dashOffset);

  indicatorCircle.setAttribute(
    "cx",
    150 + Math.cos((current * Math.PI * 2) / totalTime - Math.PI / 2) * 145
  );
  indicatorCircle.setAttribute(
    "cy",
    150 + Math.sin((current * Math.PI * 2) / totalTime - Math.PI / 2) * 145
  );
}

function resetUI() {
  chrome.runtime.sendMessage({type: 'RESET'});

  dashArray = 145 * Math.PI * 2;
  dashOffset = dashArray;

  hourinput.value = 0;
  minuteinput.value = 0;

  hour.innerHTML = Math.floor(totalTime / 24 / 3600)
    .toString(10)
    .padStart(2, "0");
  minute.innerHTML = Math.floor((totalTime / 24 / 60) % 60)
    .toString(10)
    .padStart(2, "0");
  second.innerHTML = Math.floor((totalTime / 24) % 60)
    .toString(10)
    .padStart(2, "0");

  hourinput.value = 0;
  minuteinput.value = 0;

  indicatorCircle.setAttribute("cx", 150 + Math.cos(0 - Math.PI / 2) * 145);
  indicatorCircle.setAttribute("cy", 150 + Math.sin(0 - Math.PI / 2) * 145);

  animatedCircle.setAttribute("stroke-dasharray", dashArray);
  animatedCircle.setAttribute("stroke-dashoffset", dashOffset);
}

function handleReset() {
  resetUI();
}

function handlePlay() {
  totalTime = hourinput.value * 3600 * 24 + minuteinput.value * 60 * 24;
  chrome.runtime.sendMessage({type: 'PLAY', payload: totalTime});
}

function handleRecord() {}