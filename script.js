
window.AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();


const drawAudio = url => {
  fetch(url)
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
    .then(audioBuffer => draw(normalizeData(filterData(audioBuffer))));
};


const filterData = audioBuffer => {
  const rawData = audioBuffer.getChannelData(0);
  const samples = 700; 
  const blockSize = Math.floor(rawData.length / samples); 
  const filteredData = [];
  for (let i = 0; i < samples; i++) {
    let blockStart = blockSize * i; 
    let sum = 0;
    for (let j = 0; j < blockSize; j++) {
      sum = sum + Math.abs(rawData[blockStart + j]); 
    }
    filteredData.push(sum / blockSize); 
  }
  return filteredData;
};


const normalizeData = filteredData => {
    const multiplier = Math.pow(Math.max(...filteredData), -1);
    return filteredData.map(n => n * multiplier);
}


const draw = normalizedData => {

  const canvas = document.querySelector("canvas");
  const dpr = window.devicePixelRatio || 1;
  const padding = 20;
  canvas.width = canvas.offsetWidth * dpr;
  canvas.height = (canvas.offsetHeight + padding * 2) * dpr;
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);
  ctx.translate(0, canvas.offsetHeight / 2 + padding);

  
  const width = canvas.offsetWidth / normalizedData.length;
  for (let i = 0; i < normalizedData.length; i++) {
    const x = width * i;
    let height = normalizedData[i] * canvas.offsetHeight - padding;
    if (height < 0) {
        height = 0;
    } else if (height > canvas.offsetHeight / 2) {
        height = height > canvas.offsetHeight / 2;
    }
    drawLineSegment(ctx, x, height, width, (i + 1) % 2);
  }
};


const drawLineSegment = (ctx, x, height, width, isEven) => {
  ctx.lineWidth = 2; 
  ctx.strokeStyle = "#565656"; 
  ctx.beginPath();
  height = isEven ? height : -height;
  ctx.moveTo(x, 0);
  ctx.lineTo(x, height);
  ctx.arc(x + width / 4, height, width / 4, Math.PI, 0, isEven);
  ctx.lineTo(x + width, 0);
  ctx.stroke();
};

drawAudio('audio-file.mp3');
var myMusic= document.getElementById("music");
var seeker = document.getElementById("progress-bar");
var covered = document.getElementById("progress-seek");
var seeking;
var counter = 0;

function init(elem) {
  if (elem.classList.contains("fa-play-circle")) {
    play(elem);
  } else {
    pause(elem);
  }
}

function canvasPlay() {
  let elem = document.getElementById("btn-play");
  init(elem);
}

function play(btn) {
  btn.classList.remove("fa-play-circle");
  btn.classList.add("fa-pause-circle");
  myMusic.play();
  seeking = setInterval(function() {
    counter = counter + 0.47;
    seeker.style.left = counter+"px";
   covered.style.width = counter+"px";
    covered.style.left = "-"+(counter+2)+"px";
  }, 1);
  
}

function pause(btn) {  
  btn.classList.remove("fa-pause-circle");
  btn.classList.add("fa-play-circle");
  myMusic.pause();
  clearInterval(seeking);
}

myMusic.addEventListener('ended', function() {
  this.currentTime = 0;  
  counter = 0;
  seeker.style.left = "0px";
  covered.style.width = "0px";
  covered.style.left = "0px";
  clearInterval(seeking);

  let btn = document.getElementById("btn-play");
  btn.classList.remove("fa-pause-circle");
  btn.classList.add("fa-play-circle");
})
