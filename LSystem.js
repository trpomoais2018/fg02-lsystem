let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
let step, currentPoint;
let positionsContainer = [];
let currentType;
let width = 1700;
let height = 900;

let Bush = {
    axiom: "F",
    newF: "-F+F+[+F-F-]-[-F+F+F]",
    step: function (n) {
        return 350 / Math.pow(2, n)
    },
    q: Math.PI / 8,
    startPoint: {X: 75, Y: canvas.height - 100, Angle: 0}
}

let Snowflake = {
    axiom: "[F]+[F]+[F]+[F]+[F]+[F]",
    newF: "F[+FF][-FF]FF[+F][-F]FF",
    step: function (n) {
        return 450 / Math.pow(5, n)
    },
    q: Math.PI / 3,
    startPoint: {X: canvas.width / 2, Y: canvas.height / 2, Angle: 0}
}

let rules = {
    "F": function () {
        currentPoint.X += step * Math.cos(currentPoint.Angle);
        currentPoint.Y += step * Math.sin(currentPoint.Angle);
        context.lineTo(currentPoint.X, currentPoint.Y);
    },
    "[": function () {
        positionsContainer.push(Object.assign({}, currentPoint));
    },
    "]": function () {
        currentPoint = positionsContainer.pop();
        context.moveTo(currentPoint.X, currentPoint.Y);
    },
    "+": function () {
        currentPoint.Angle += currentType.q;
    },
    "-": function () {
        currentPoint.Angle -= currentType.q;
    }
}

function Run() {
    if (document.getElementById('Type').value == "Bush") currentType = Bush;
    else currentType = Snowflake;
    currentPoint = Object.assign({}, currentType.startPoint);
    let N = parseInt(document.getElementById('N').value);
    step = currentType.step(N);
    Draw(GetCommands(currentType.axiom, currentType.newF, N));
}

function GetCommands(axiom, newF, N) {
    let commands = axiom;
    for (let n = 0; n < N; n++) {
        let newCommand = "";
        for (let i = 0; i < commands.length; i++) {
            if (commands[i] === "F") newCommand += newF;
            else newCommand += commands[i];
        }
        commands = newCommand;
    }
    return commands;
}

function Draw(commands) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.beginPath();
    for (let i = 0; i < commands.length; i++) {
        rules[commands[i]]();
    }
    context.stroke();
    context.closePath();
}

window.onload = function(){
    trackTransforms(context);

    let lastX=canvas.width/2, lastY=canvas.height/2;
    let dragStart,dragged;
    let scaleFactor = 1.1;

    function redraw(){
        let p1 = context.transformedPoint(0,0);
        let p2 = context.transformedPoint(canvas.width,canvas.height);
        context.clearRect(p1.x,p1.y,p2.x-p1.x,p2.y-p1.y);
        context.save();
        context.setTransform(1,0,0,1,0,0);
        context.clearRect(0,0,canvas.width,canvas.height);
        context.restore();
        Run();
    }

    function zoom(clicks){
        let pt = context.transformedPoint(lastX,lastY);
        context.translate(pt.x,pt.y);
        let factor = Math.pow(scaleFactor,clicks);
        context.scale(factor,factor);
        context.translate(-pt.x,-pt.y);
        redraw();
    }

    function handleScroll(evt){
        let delta = evt.wheelDelta ? evt.wheelDelta/40 : evt.detail ? -evt.detail : 0;
        if (delta) zoom(delta);
        return evt.preventDefault() && false;
    }

    canvas.addEventListener('mousedown',function(evt){
        document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
        lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
        lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
        dragStart = context.transformedPoint(lastX,lastY);
        dragged = false;
    },false);

    canvas.addEventListener('mousemove',function(evt){
        lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
        lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
        dragged = true;
        if (dragStart){
            let pt = context.transformedPoint(lastX,lastY);
            context.translate(pt.x-dragStart.x,pt.y-dragStart.y);
            redraw();
        }
    },false);

    canvas.addEventListener('mouseup',function(evt){
        dragStart = null;
        if (!dragged) zoom(evt.shiftKey ? -1 : 1 );
    },false);

    canvas.addEventListener('DOMMouseScroll',handleScroll,false);
    canvas.addEventListener('mousewheel',handleScroll,false);
    addEventListener("keydown", function (event) {
        if (event.code == "Enter") {
            Run();
        }
    })
};

function trackTransforms(ctx){
    let svg = document.createElementNS("http://www.w3.org/2000/svg",'svg');
    let xform = svg.createSVGMatrix();
    ctx.getTransform = function(){ return xform; };

    let savedTransforms = [];
    let save = ctx.save;
    ctx.save = function(){
        savedTransforms.push(xform.translate(0,0));
        return save.call(ctx);
    };

    let restore = ctx.restore;
    ctx.restore = function(){
        xform = savedTransforms.pop();
        return restore.call(ctx);
    };

    let scale = ctx.scale;
    ctx.scale = function(sx,sy){
        xform = xform.scaleNonUniform(sx,sy);
        return scale.call(ctx,sx,sy);
    };

    let rotate = ctx.rotate;
    ctx.rotate = function(radians){
        xform = xform.rotate(radians*180/Math.PI);
        return rotate.call(ctx,radians);
    };

    let translate = ctx.translate;
    ctx.translate = function(dx,dy){
        xform = xform.translate(dx,dy);
        return translate.call(ctx,dx,dy);
    };

    let transform = ctx.transform;
    ctx.transform = function(a,b,c,d,e,f){
        let m2 = svg.createSVGMatrix();
        m2.a=a; m2.b=b; m2.c=c; m2.d=d; m2.e=e; m2.f=f;
        xform = xform.multiply(m2);
        return transform.call(ctx,a,b,c,d,e,f);
    };

    let setTransform = ctx.setTransform;
    ctx.setTransform = function(a,b,c,d,e,f){
        xform.a = a;
        xform.b = b;
        xform.c = c;
        xform.d = d;
        xform.e = e;
        xform.f = f;
        return setTransform.call(ctx,a,b,c,d,e,f);
    };

    let pt  = svg.createSVGPoint();
    ctx.transformedPoint = function(x,y){
        pt.x=x; pt.y=y;
        return pt.matrixTransform(xform.inverse());
    }
}