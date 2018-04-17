var canvas = document.createElement('canvas');
document.body.insertBefore(canvas, document.body.firstChild);
canvas.style.position = 'fixed';
canvas.style.top = '0px';
canvas.style.left = '0px';
canvas.width = document.body.offsetWidth;
canvas.height = window.innerHeight;
var sky = canvas.getContext('2d');
var len = 15;

function inRad(num) {
	return num * Math.PI / 180;
}
var axiome = "FX";
var sentence = axiome;
var rules = [];

rules[0] = {
  a: "X",
  b: "X+YF+"
}
rules[1] = {
  a: "Y",
  b: "-FX-Y"
}

function turtle(n) {
  for(var j=0;j<n;j++){
    generate();
  }
  sky.translate(600, 500);
  sky.lineWidth = "1";
  sky.strokeStyle = "green";
  for (var i = 0; i < sentence.length; i++) {
    var current = sentence.charAt(i);
    if (current == "F") {
      sky.beginPath();
      sky.moveTo(0, 0);
      sky.lineTo(0, -len);
      sky.translate(0, -len);
      sky.stroke();
    } else if (current == "+") {
      sky.rotate(inRad(90));
    } else if (current == "-") {
      sky.rotate(inRad(-90));
    } 
  }
}

function generate() {
  var nextSentence = "";
  for (var i = 0; i < sentence.length; i++) {
    var current = sentence.charAt(i);
    var found = false;
    for (var j = 0; j < rules.length; j++) {
      if (current == rules[j].a) {
        found = true;
        nextSentence += rules[j].b;
        break;
      }
    }
    if (!found)
      nextSentence += current;
  }
  sentence = nextSentence;
}
turtle(10);