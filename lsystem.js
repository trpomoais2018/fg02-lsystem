function run() {
    var fractal = prompt("Куст или снежинка?");
    if (fractal == "куст" || fractal == "Куст") {
        var q = 180 / 8;
        var s = 7;
        var dataPoint = { x: 500, y: 500, angle: 0 };
        var n = 5;
        drawFractal(dataPoint, s, q, lSystem("F", "-F+F+[+F-F-]-[-F+F+F]", n));
    } else {
        if (fractal == "снежинка" || fractal == "Снежинка") {
            var q = 180 / 3;
            var s = 2;
            var n = 3;
            var dataPoint = { x: 500, y: 500, angle: 0 };
            drawFractal(dataPoint, s, q, lSystem("[F]+[F]+[F]+[F]+[F]+[F]", "F F[+FF][-FF]FF[+F][-F]FF", n));
        } else {
            alert("Введено неверное условие");
        }
    }
}
function lSystem(axiom, rule, n) {
    var string = "";
    for (var i = 0; i < n; i++) {
        string = "";
        for (var char of axiom) {
            if (char == "F")
                string += rule;
            else
                string += char;
        }
        axiom = string;
    }
    return axiom;
}
function drawFractal(dataPoint, s, q, newAxiom) {
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext('2d');
    context.lineWidth = "1";
    context.strokeStyle = "black";
    var stack = [];
    for (var i = 0; i < newAxiom.length; i++) {
        switch (newAxiom[i]) {
            case "F":
                drawLine(context, s, dataPoint);
                break;
            case "[":
                stack.push({ x: dataPoint.x, y: dataPoint.y, angle: dataPoint.angle })
                break;
            case "]":
                var tmp = stack.pop();
                dataPoint.x = tmp.x;
                dataPoint.y = tmp.y;
                dataPoint.angle = tmp.angle;
                context.moveTo(dataPoint.x, dataPoint.y);
                break;
            case "+":
                dataPoint.angle += q;
                break;
            case "-":
                dataPoint.angle -= q;
                break;
        }
    }
}
function drawLine(context, s, dataPoint) {
    context.beginPath();
    context.moveTo(dataPoint.x, dataPoint.y);
    dataPoint.x += s * Math.cos(dataPoint.angle * Math.PI / 180);
    dataPoint.y += s * Math.sin(dataPoint.angle * Math.PI / 180);
    context.lineTo(dataPoint.x, dataPoint.y);
    context.stroke();
}