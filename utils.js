//Utils
const degToRad = (deg) => deg * Math.PI / 180;
const drawLine = (ctx, x1, y1, x2, y2, color = "black") => {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.stroke();
}
function createScreen(width, height) {
    let screen = document.createElement("canvas");
    screen.width = width;
    screen.height = height;
    screen.style.border = "1px solid black";
    document.getElementById("container").appendChild(screen);
    return screen;
}
function normalizarAngulo(angulo) {
    angulo = angulo % (2 * Math.PI);
    if (angulo < 0) angulo = (2 * Math.PI) + angulo;
    return angulo;
}
export { degToRad, drawLine, createScreen, normalizarAngulo};
