var axiom = "F";
var sent = axiom;
var rules = [];
var lenght = 100;
rules[0] = {
    a: "F",
    b: "-F+F+[+F-F-]-[-F+F+F]"
}

function generate() {
    lenght *= 0.5;
    var nextSent = "";
    if (lenght > 3) {
        for (var i = 0; i < sent.length; i++) {
            var current = sent.charAt(i);
            var found = false;
            for (var j = 0; j < rules.length; j++) {
                if (current == rules[j].a) {
                    found = true;
                    nextSent += rules[j].b;
                    break;
                }
            }
            if (!found) {
                nextSent += current;
            }
        }
    }
    sent = nextSent;
    createP(sent);
    turtle();
}

function setup() {
    createCanvas(400, 400);
    background(51);
    createP(axiom);
    turtle();
    var button = createButton("generate");
    button.mousePressed(generate);
}

function turtle() {
    translate(width / 2, height);
    stroke(255, 100);
    for (var i = 0; i < sent.length; i++) {
        var current = sent.charAt(i);

        if (current == "F") {
            line(0, 0, 0, -lenght);
            translate(0, -lenght);
        } else if (current == "+") {
            rotate(PI / 8);
        } else if (current == "-") {
            rotate(-PI / 8);
        } else if (current == "[") {
            push();
        } else if (current == "]") {
            pop();
        }
    }
}