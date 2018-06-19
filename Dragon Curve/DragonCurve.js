var canvas = document.createElement('canvas');
document.body.insertBefore(canvas, document.body.firstChild);
canvas.style.position = 'fixed';
canvas.style.top = '0px';
canvas.style.left = '0px';
canvas.width = document.body.offsetWidth;
canvas.height = window.innerHeight;
var sky = canvas.getContext('2d');
var length = 15;
var axiome = "[FX]";
var currentSentence = axiome;
var sentences = [axiome];

var rules = {
  "X": "X+YF+"
  , "Y": "-FX-Y"
}

var keys = Object.keys(rules);

function toRadiance(degree) {
  return degree * Math.PI / 180;
}

function generate(n) {
  for (var k = 0; k < n; k++) {
    currentSentence = sentences[sentences.length - 1];
    var nextSentence = "";
    for (var i = 0; i < currentSentence.length; i++) {
      var currentChar = currentSentence.charAt(i);
      var found = false;
      for (var j = 0; j < keys.length; j++) {
        if (currentChar === keys[j]) {
          found = true;
          nextSentence += rules[keys[j]];
          break;
        }
      }
      if (!found)
        nextSentence += currentChar;
    }
    sentences.push(nextSentence);
    currentSentence = nextSentence;
  }
  turtle(sentences[n],{x: 0, y: 0, angle: 0 },90);
}

function turtle(totalSentence, startPosition, angle) {
  let position = startPosition;
  var stack = [];
  sky.translate(800, 200);
  sky.lineWidth = "1";
  sky.strokeStyle = "green";
  for (var i = 0; i < totalSentence.length; i++) {
    var current = totalSentence.charAt(i);
    if (current === "F") {
      sky.beginPath();
      sky.moveTo(position.x, position.y);
      position.x += Math.cos(position.angle* Math.PI/180) * length;
      position.y += Math.sin(position.angle* Math.PI/180) * length;
      sky.lineTo(position.x, position.y);
      sky.stroke();
    } else if (current === "+") {
      position.angle += angle;
    } else if (current === "-") {
      position.angle -= angle;
    } else if (current === "[") {
      stack.push({ x: position.x, y: position.y, angle: position.angle });
    } else if (current === "]") {
      position = stack.pop();
    }
  }
}
generate(10);
