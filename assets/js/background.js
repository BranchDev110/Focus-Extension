let totalTime = 0;
let current = 0;

let timerId = -1;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if(request.type === 'GET_TOTALTIME') {
    chrome.runtime.sendMessage({type: 'SET_TOTALTIME', payload: totalTime});
  }
  if(request.type === 'PLAY') {
    totalTime = request.payload;
    play();
  }
  if(request.type === 'RESET') {
    reset();
  }
})

function animate() {
  current ++;
  chrome.runtime.sendMessage({type: 'SET_CURRENT', payload: current});
  if (current === totalTime) {
    reset();
    return;
  }
}

function play() {
  if (timerId === -1) {
    if (totalTime > 0) {
      console.log('c', totalTime);
      timerId = setInterval(animate, 1000 / 24);
    }
  } else {
    clearInterval(timerId);
    timerId = -1;
  }
}

function reset() {
  totalTime = 0;
  current = 0;
  if (timerId !== -1) {
    clearInterval(timerId);
    timerId = -1;
  }
}