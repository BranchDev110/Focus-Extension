var isPlaying = false;
var totalTime = 0;
var current = 0;
var timerId = -1;

var r = 145;

var dashArray = r * Math.PI * 2
var dashOffset;

var hour, minute, second, hourinput, minuteinput, playbtn, resetbtn, recordbtn;

hour = document.getElementById("hour");
minute = document.getElementById("minute");
second = document.getElementById("second");

hourinput = document.getElementById("hourinput");
minuteinput = document.getElementById("minuteinput");

resetbtn = document.getElementById("resetbutton");
recordbtn = document.getElementById("recordbutton");
playbtn = document.getElementById("playbutton");

resetbtn.addEventListener("click", handleReset);
playbtn.addEventListener("click", handlePlay);
recordbtn.addEventListener("click", handleRecord);

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type === "SET_INITIAL") {
    current = request.payload.current;
    totalTime = request.payload.totalTime;
    isPlaying = request.payload.isPlaying;
    hourinput.value = Math.floor(totalTime / 24 / 3600);
    minuteinput.value = Math.floor((totalTime / 24 / 60) % 60);
    resetUI();
    if (isPlaying) timerId = setInterval(animateUI, 1000 / 24);
  }
});

chrome.runtime.sendMessage({ type: "GET_INITIAL" });

function draw(current, totalTime) {
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

  const ang = totalTime === 0 ? 0 - Math.PI / 2 : (current * Math.PI * 2) / totalTime - Math.PI / 2;

  indicatorCircle.setAttribute("cx", 150 + Math.cos(ang) * r);
  indicatorCircle.setAttribute("cy", 150 + Math.sin(ang) * r);
}

function animateUI() {
  current++;
  if(current === totalTime) {
    reset();
    return;
  }
  draw(current, totalTime);
}

function resetUI() {
  draw(current, totalTime); 
  changePlayBtnText();
}

function reset() {
  chrome.runtime.sendMessage({ type: "RESET" });
  current = 0;
  if(isPlaying) {
    isPlaying = false;
    clearInterval(timerId);
  }
  resetUI();
}

function handleReset() {
  reset();
}

function changePlayBtnText() {
  if(isPlaying) playbtn.innerHTML = "Pause";
  else playbtn.innerHTML = "Play";
}

function handlePlay() {
  if (!isPlaying) {
    totalTime = hourinput.value * 3600 * 24 + minuteinput.value * 60 * 24;
    timerId = setInterval(animateUI, 1000 / 24);
    chrome.runtime.sendMessage({ type: "PLAY", payload: totalTime });
  } else {
    clearInterval(timerId);
    chrome.runtime.sendMessage({ type: "PAUSE" });
  }
  isPlaying = !isPlaying;
  changePlayBtnText();
}

function handleRecord() {}
