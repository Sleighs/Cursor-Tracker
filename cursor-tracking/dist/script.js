/*
Cursor Prediction
*/


var image = [];
var data = [],
    dataX = [], 
    dataY = [];
var trainingData = [];
var resultX, resultY;

const { Layer, Network } = window.synaptic;

let inputLayer = new Layer(1);
let hiddenLayer = new Layer(4);
let outputLayer = new Layer(1);

inputLayer.project(hiddenLayer);
hiddenLayer.project(outputLayer);


//trace mouse movements
var mouseLocation;

function mouseMove() {
	//vars for training set output
  var outputX = Number(event.pageX);
  var outputY = Number(event.pageY);
  
  //save mouse location
  mouseLocation = [outputX, outputY];
  
  //send location to x and y collections 
  dataX.push(outputX);
  dataY.push(outputY);
  
  //keep training data <= 10 entries each 
  if (dataX.length > 10){
    dataX.shift();
  }
  if (dataY.length > 10){
    dataY.shift();
  }
  
  //display location
  document.getElementById("data").innerHTML = "x " + event.pageX + " y " + event.pageY;
  
  //create new network
  let chromaNetwork = new Network({
    input: inputLayer,
    hidden: [hiddenLayer],
    output: outputLayer
  });
  var learningRate = 0.3;
  var target = [
    0,0,0
  ];
  /*for (var i = 0; i < 1000; i++) {
    for(let trainingSet of dataX) {
      chromaNetwork.activate(trainingSet[0]);
      chromaNetwork.propagate(learningRate, trainingSet[1]);
    }
  }*/
  
  //init network
  function predictX(input){
    resultX = chromaNetwork.activate(input); 
    console.log("x", resultX);
  }
  
  function predictY(input){   
    resultY = chromaNetwork.activate(input);
    console.log("y", resultY);
  }

  predictX(dataX);
  predictY(dataY);
  
  //chromaNetwork.network.propagate(learningRate, target);
  
  //only show prediction result if value exists 
  if (resultX !== null){
    document.getElementById("result-x").innerHTML = resultX;
  }
  if (resultY !== null){
    document.getElementById("result-y").innerHTML = resultY;
  }
}

//listen for cursor movement and trigger prediction
window.addEventListener('mousemove', mouseMove, false); 

//collect mouse data at intervals
/*var mouseInterval = setInterval(function(){
  
}, 1000);

function stopInterval() {
  clearInterval(mouseInterval);
}
*/

//animate cursor trail
var trailDots = [],
    nnDots = [],
    mouse = {
      x: 0,
      y: 0
    },
    nn = {
      a: 0,
      b: 0
    };

var Trail = function(){
  this.x = 0;
  this.y = 0;
  this.node = (function(){
    var n = document.createElement("div");
    n.className = "cursor-trail";
    document.body.appendChild(n);
    return n;
  }());
}
var nnTrail = function(){
  this.a = 0;
  this.b = 0;
  this.node = (function(){
    var m = document.createElement("div");
    m.className = "predict-trail";
    document.body.appendChild(m);
    return m;
  }());
};

Trail.prototype.draw = function() {
  this.node.style.left = this.x + "px";
  this.node.style.top = this.y + "px";
}
nnTrail.prototype.draw = function() {
  this.node.style.left = this.a + "px";
  this.node.style.top = this.b + "px";
};

// Creates the Trail objects
for (var i = 0; i < 10; i++) {
  var x = new Trail();
  trailDots.push(x);
}

for (var j = 0; j < 6; j++) {
  var y = new nnTrail();
  nnDots.push(y);
}

// This is the screen redraw function
function draw() {
  // Make sure the mouse position is set everytime
    // draw() is called.
  var x = mouse.x,
      y = mouse.y,
      a = nn.a,
      b = nn.b;
  
  // 
  trailDots.forEach(function(dot, index, dots) {
    var nextDot = dots[index + 1] || dots[0];
    
    dot.x = x;
    dot.y = y;
    dot.draw();
    x += (nextDot.x - dot.x) * .7;
    y += (nextDot.y - dot.y) * .7;

  });
  
  nnDots.forEach(function(dot, index, dots) {
    var nextDot = dots[index + 1] || dots[0];
    
    dot.a = a;
    dot.b = b;
    dot.draw();
    a += (nextDot.a - dot.a) * .6;
    b += (nextDot.b - dot.b) * .6;
  });
}

addEventListener("mousemove", function(event) {
  mouse.x = event.pageX;
  mouse.y = event.pageY;
  
  nn.a = event.pageX;
  nn.b = event.pageY;
  console.log("a ", nn.a, "b ", nn.b);
});

// animate() calls draw() then recursively calls itself
  // every requestAnimationFrame() runs
function animate() {
  draw();
  requestAnimationFrame(animate);
}
animate();


//button functions
var intervalTracker = true;

var intervalBtn = document.getElementById("interval");
intervalBtn.innerText = "Stop";
var predictBtn = document.getElementById("predict");
predictBtn.innerText = "Predict";
var clearBtn = document.getElementById("clear");
clearBtn.innerText = "Clear";

intervalBtn.addEventListener("click", function(){
	if (intervalTracker == true){
		stopInterval();
		intervalTracker = false;
		intervalBtn.innerText = "Start";
	} else {
		mouseInterval;
		intervalTracker = true;
		intervalBtn.innerText = "Stop";
	}
});

clearBtn.addEventListener("click", function(){
  data = [];
  dataX = [];
  dataY = [];
  console.log("dataX: ", dataX);
  console.log("dataY: ", dataY);
});

//resize canvas on window resize
var canvas = document.getElementById("canvas");

function setCanvasSize(width, height){
  canvas.width = width - 30;
  canvas.height = height - 30;
}

setCanvasSize(window.innerWidth, window.innerHeight);

window.addEventListener("resize", function(){
  setCanvasSize(window.innerWidth, window.innerHeight);
  console.log("resize done");
});