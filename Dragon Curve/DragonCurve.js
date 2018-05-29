var canvas = document.createElement('canvas');
document.body.insertBefore(canvas, document.body.firstChild);
canvas.style.position = 'fixed';
canvas.style.top = '0px';
canvas.style.left = '0px';
canvas.width = document.body.offsetWidth;
canvas.height = window.innerHeight;
var sky = canvas.getContext('2d');
var length = 15;
var axiome = "FX";
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

function generate() {
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

function turtle(n) {
  if (sentences.length > n)
    currentSentence = sentences[n];
  else {
    let len = sentences.length;
    for (var j = 0; j < n - len + 1; j++) {
      generate();
    }
  }
  sky.translate(600, 500);
  sky.lineWidth = "1";
  sky.strokeStyle = "green";
  for (var i = 0; i < currentSentence.length; i++) {
    var current = currentSentence.charAt(i);
    if (current === "F") {
      sky.beginPath();
      sky.moveTo(0, 0);
      sky.lineTo(0, -length);
      sky.translate(0, -length);
      sky.stroke();
    } else if (current === "+") {
      sky.rotate(toRadiance(90));
    } else if (current === "-") {
      sky.rotate(toRadiance(-90));
    }
  }
}
turtle(10);
