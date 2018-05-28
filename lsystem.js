var fractal = (function() {

    class Pen {
        constructor(x, y, a) {
            this.x = x;
            this.y = y;
            this.angle = a;
        }
    }

    class LSystem {
        constructor(fractal) {
            let axiom = fractal.axiom;
            let angle = fractal.angle;
            let rule = fractal.rules;
            let canvas = fractal.canvas;
            let context = fractal.canvas.getContext('2d');
            let width = fractal.width || canvas.width;
            let height = fractal.height || canvas.height;
            let boundingBox = { minX: 0, minY: 0, maxX: width, maxY: height };
            let originX = fractal.x || 0;
            let originY = fractal.y || 0;
            let pen = new Pen(0, 0, 0);

            function process(dist, canDraw) {
                let stack = [];
                for (let i = 0; i < axiom.length; i++) {
                    switch (axiom.charAt(i)) {
                        case '+':
                            pen.angle += angle;
                            break;
                        case '-':
                            pen.angle -= angle;
                            break;
                        case '[':
                            stack.push(new Pen(pen.x, pen.y, pen.angle));
                            break;
                        case ']':
                            pen = stack.pop();
                            break;
                        default:
                            drawFractal(dist, canDraw);
                            break;
                    }
                }
            };

            function drawFractal(dist, canDraw) {
                let lastX = pen.x;
                let lastY = pen.y;
                let angle = pen.angle * Math.PI / 180;
                pen.x += dist * Math.cos(angle);
                pen.y += dist * Math.sin(angle);
                if (canDraw) {
                    context.beginPath();
                    context.moveTo(lastX, lastY);
                    context.lineTo(pen.x, pen.y);
                    context.strokeStyle = pen.color;
                    context.closePath();
                    context.stroke();
                } else {
                    if (pen.x < boundingBox.minX) {
                        boundingBox.minX = pen.x;
                    }
                    else if (pen.x > boundingBox.maxX) {
                        boundingBox.maxX = pen.x;
                    }
                    if (pen.y < boundingBox.minY) {
                        boundingBox.minY = pen.y;
                    }
                    else if (pen.y > boundingBox.maxY) {
                        boundingBox.maxY = pen.y;
                    }
                }
            };

            function getDistance(oldDistance) {
                let newDistX = (width / (boundingBox.maxX - boundingBox.minX)) * oldDistance;
                let newDistY = (height / (boundingBox.maxY - boundingBox.minY)) * oldDistance;
                return newDistX < newDistY ? newDistX : newDistY;
            };

            function getOffset(newDist, oldDist) {
                boundingBox.minX *= (newDist / oldDist);
                boundingBox.maxX *= (newDist / oldDist);
                boundingBox.minY *= (newDist / oldDist);
                boundingBox.maxY *= (newDist / oldDist);
                return {
                    x: (width / 2) - (((boundingBox.maxX - boundingBox.minX) / 2) + boundingBox.minX),
                    y: (height / 2) - (((boundingBox.maxY - boundingBox.minY) / 2) + boundingBox.minY)
                };
            };

            this.iterate = function(iterations) {
                for (let i = 0; i < iterations; i++) {
                    let newAxiom = '';
                    for (let j = 0; j < axiom.length; j++) {
                        newAxiom += rule[axiom.charAt(j)] || axiom.charAt(j);
                    }
                    axiom = newAxiom;
                }
                return axiom;
            };

            this.render = function() {
                let defaultDist = Math.max(width, height);
                process(defaultDist, false);
                let newDist = getDistance(defaultDist);
                let offset = getOffset(newDist, defaultDist);
                pen = new Pen(originX + offset.x, originY + offset.y, 0);
                process(newDist, true);
            };
        }
    }

    function createLSystem(fractal) {
        return new LSystem(fractal);
    };

    return { createLSystem: createLSystem };
})();