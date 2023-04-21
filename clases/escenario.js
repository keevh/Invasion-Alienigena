export default class Escenario {
    constructor(canvas, ctx, matrixlvl) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.matrixlvl = matrixlvl;
        //Dimensiones de la matriz
        this.altoM = this.matrixlvl.length;
        this.anchoM = this.matrixlvl[0].length;
        //Dimensiones del canvas
        this.altoC = this.canvas.height;
        this.anchoC = this.canvas.width;
        //Dimensiones de cada cuadro
        this.altoCuadro = parseInt(this.altoC / this.altoM)
        this.anchoCuadro = parseInt(this.anchoC / this.anchoM)
    }
    getDimensionesCuadro(){
        return {alto: this.altoCuadro, ancho: this.anchoCuadro};
    }
    colision(x, y) {
        return (this.matrixlvl[y][x] != 0) ? true : false;
    }

    dibujar() {
        let color;
        for (let y = 0; y < this.altoM; y++) {
            for (let x = 0; x < this.anchoM; x++) {
                //Recorremos la matriz y pintamos los cuadros dependiendo de cada color
                color = (this.matrixlvl[y][x] == 1) ? "#000000" : (this.matrixlvl[y][x]==2 ? "#9a7b4f" : "#666666")
                this.ctx.fillStyle = color;
                this.ctx.fillRect(x * this.anchoCuadro, y * this.altoCuadro, this.anchoCuadro, this.altoCuadro);
            }
        }
    }
}