function buildLineFromLsystem(alphabet, axiom, iterateCount) {
    let currentLine = axiom;
    for (let i = 0; i < iterateCount; i++) {
        let newLine = "";
        for (let j = 0; j < currentLine.length; j++) {
            if (alphabet[currentLine[j]] === undefined) newLine += currentLine[j];
            else newLine += alphabet[currentLine[j]];
        }
        currentLine = newLine;
    }
    return currentLine;
}

function getDictonaryForKoch() {
    let alphabet = {};
    alphabet['F'] = "F-F++F-F";
    return alphabet;
}

function getDictonaryForBush() {
    let alphabet = {};
    alphabet['F'] = "-F+F+[+F-F-]-[-F+F+F]";
    return alphabet;
}

function getDictonaryForSnowflake() {
    let alphabet = {};
    alphabet['F'] = "F[+FF][-FF]FF[+F][-F]FF";
    return alphabet;
}

function getDictonaryForDragon() {
    let alphabet = {};
    alphabet['X'] = "X+YF";
    alphabet['Y'] = "FX-Y";
    return alphabet;
}

function getDictonaryForHosper() {
    let alphabet = {};
    alphabet['F'] = "";
    alphabet['L'] = "FL-FR--FR+FL++FLFL+FR-";
    alphabet['R'] = "+FL-FRFR--FR-FL++FL+FR";
    return alphabet;
}

function getDictonaryForSierpinski() {
    let alphabet = {};
    alphabet['A'] = "B-A-B";
    alphabet['B'] = "A+B+A";
    return alphabet;
}

function drawFractal(context, actionLine, alphabet) {
    context.beginPath();
    for (let i = 0; i < actionLine.length; i++) {
        if (alphabet[actionLine[i]] === undefined) continue;
        alphabet[actionLine[i]]();
    }
    context.stroke();
}

function buildDictionaryWithActions(context, startPosition, length, angle) {
    let position = startPosition;
    let stack = [];
    let alphabet = {};
    alphabet['F'] = () => {
        context.moveTo(position.x, position.y);
        position.x += Math.cos(position.angle) * length;
        position.y += Math.sin(position.angle) * length
        context.lineTo(position.x, position.y);
    }
    alphabet['+'] = () => position.angle += angle;
    alphabet['-'] = () => position.angle -= angle;
    alphabet['['] = () => stack.push({x: position.x, y:position.y, angle: position.angle });
    alphabet[']'] = () => position = stack.pop();
    return alphabet;
}