class LSystem {

constructor(axiom, rule) {
    this.axiom = axiom;
    this.rule = rule;
}
buildSequence(depth) {
    let result = this.axiom;
    for (let i = 0; i < depth; i++) {
        let sequence1 = "";
        for (let j = 0; j < result.length; j++) {
            if (this.rule[result[j]] === undefined)
                sequence1 += result[j];
            else
                sequence1 += this.rule[result[j]];
        }
        result = sequence1;
    }
    return result;
}
}

const snowflacke = new LSystem("[F]+[F]+[F]+[F]+[F]+[F]", {"F" : "F[+FF][-FF]FF[+F][-F]FF"});
const bush = new LSystem("F", {"F" : "-F+F+[+F-F-]-[-F+F+F]"});
function drawFractal(fractal, context, startPos) {
context.beginPath();
if(fractal == "bush") {
    drawFigure(startPos, context, {system : bush, depth : 5, length : 10, angle : Math.PI/8})
}
else{
    drawFigure(startPos, context, {system : snowflacke, depth : 3, length : 3, angle : Math.PI/3})
}    
context.stroke();    
}

function drawFigure(position, context, figure) {
    const sequence = figure.system.buildSequence(figure.depth);
    const actions = buidRulesRunner(context, position, figure.length, figure.angle);
    for (let i = 0; i < sequence.length; i++) {
        if (actions[sequence[i]] != undefined)
            actions[sequence[i]]();
    }
}

function buidRulesRunner(drawingContext, startPos, length, angle) {
let position = startPos;
let stack = [];
let alphabet = {};
alphabet['F'] = () => {
    drawingContext.moveTo(position.x, position.y);
    position.x += Math.cos(position.angle) * length;
    position.y += Math.sin(position.angle) * length;
    drawingContext.lineTo(position.x, position.y);
}
alphabet['+'] = () => position.angle += angle;
alphabet['-'] = () => position.angle -= angle;
alphabet['['] = () => stack.push({x: position.x, y:position.y, angle: position.angle });
alphabet[']'] = () => position = stack.pop();
return alphabet;
}