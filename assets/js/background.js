let totalTime = 0;
let current = 0;
let timerId = -1;
let isPlaying = false;

chrome.storage.local.get(['data'], function(result) {
  const obj = result.data;
  console.log("h", obj);
  if(!!obj) {
    totalTime = obj.totalTime;
    current = obj.current;
    timerId = obj.timerId;
    isPlaying = obj.isPlaying;
    console.log(totalTime, current, timerId, isPlaying);
  }
})

chrome.windows.onRemoved.addListener(async function() {
  const obj = {
    totalTime, current, timerId, isPlaying
  }
  console.log('a', obj);
  chrome.storage.local.set({'data': obj});
})

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if(request.type === 'PLAY') {
    totalTime = request.payload;
    play();
  }
  if(request.type === 'RESET') {
    reset();
  }
  if(request.type === 'PAUSE') {
    pause();
  }
  if(request.type === 'GET_INITIAL') {
    chrome.runtime.sendMessage({type: 'SET_INITIAL', payload:{current, totalTime, isPlaying}});
  }
})

function animate() {
  current ++;
  if (current === totalTime) {
    reset();
    return;
  }
}

function play() {
  if (timerId === -1) {
    if (totalTime > 0) {
      isPlaying = !isPlaying;
      timerId = setInterval(animate, 1000 / 24);
    }
  } else {
    clearInterval(timerId);
    isPlaying = !isPlaying;
    timerId = -1;
  }
}

function reset() {
  totalTime = 0;
  current = 0;
  if (timerId !== -1) {
    clearInterval(timerId);
    timerId = -1;
    isPlaying = false;
  }
}

function pause() {
  if(timerId !== -1) {
    clearInterval(timerId);
    timerId = -1;
    isPlaying = false;
  }
}