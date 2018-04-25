class LSystem {

    /**
     * 
     * @param {String} axiom - axiom of LSystem
     * @param {object} rule - Dictionary [char] => newChar
     */

    constructor(axiom, rule) {
        this.axiom = axiom;
        this.rule = rule;
    }

    /**
     * 
     * @param {number} depth - recursion depth
     * @returns {String} - array of symbols 
     */

    buildSequence(depth) {
        if (depth < 1)
            throw new RangeError("Depth can't be less then 1");

        let result = this.axiom;
        for (let i = 0; i < depth; i++) {
            let newSequence = "";
            for (let j = 0; j < result.length; j++) {
                if (this.rule[result[j]] === undefined)
                    newSequence += result[j];
                else
                    newSequence += this.rule[result[j]];
            }
            result = newSequence;
        }
        return result;
    }
}

const snowflacke = new LSystem("[F]+[F]+[F]+[F]+[F]+[F]", {"F" : "F[+FF][-FF]FF[+F][-F]FF"});
const bush = new LSystem("F", {"F" : "-F+F+[+F-F-]-[-F+F+F]"});

function drawFractal(fractal, context, startPos) {
    context.beginPath();
    switch(fractal) {
        case "bush":
            drawShape(startPos, context, {system : bush, depth : 5, length : 10, angle : Math.PI/8})
            break;
        case "snowflacke":
            drawShape(startPos, context, {system : snowflacke, depth : 3, length : 3, angle : Math.PI/3})
            break;
        default:
            throw new RangeError("Unknow fractal type");
    }
    context.stroke();    
}

function drawShape(position, context, shape) {
    const sequence = shape.system.buildSequence(shape.depth);
    const actions = buildActionsDictionary(context, position, shape.length, shape.angle);
    for (let i = 0; i < sequence.length; i++) {
        if (actions[sequence[i]] != undefined)
            actions[sequence[i]]();
    }
}

function buildActionsDictionary(drawingContext, startPos, length, angle) {
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