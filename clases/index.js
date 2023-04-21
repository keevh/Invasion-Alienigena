let canvas;
let ctx;
const FPS = 50;
//Dimensiones del canvas
const CANVASANCHO = 500;
const CANVASALTO = 500;
const TAMJUGADOR = 50;
let escenario;
let jugador;
//-----------------------------------------------------
//NIVEL 1
const nivel1 = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
]
//--------------------------------------------------------
//Normalizar Angulo
function normalizarAngulo(angulo) {
    angulo = angulo % (2 * Math.PI);
    if (angulo < 0) angulo = (2 * Math.PI) + angulo;
    return angulo;
}
//--------------------------------------------------------
class Rayo {
    constructor(ctx, escenario, x, y, anguloJugador, anguloIncrement, columna) {
        this.ctx = ctx;
        this.escenario = escenario;
        this.x = x;
        this.y = y;
        this.anguloJugador = anguloJugador;
        this.anguloIncrement = anguloIncrement;
        this.columna = columna;
        this.wallHitX = 0;
        this.wallHitY = 0;
        this.wallHitXH = 0;
        this.wallHitYH = 0;
        this.wallHitXVertical = 0;
        this.wallHitYVertical = 0;
    }
    setAngulo(angulo) {
        this.anguloJugador = normalizarAngulo(angulo + this.anguloIncrement);
    }
    setPosicion(x, y) {
        this.x = x;
        this.y = y;
    }

    cast(){
        this.xIntercept = 0;
        this.yIntercept = 0;
        this.xStep = 0;
        this.yStep = 0;
        //Direccion en la que se mueve el rayo
        this.abajo = (this.anguloJugador < Math.PI) ? true : false;
        this.izquierda = (this.anguloJugador > Math.PI/2 && this.anguloJugador < 3*Math.PI/2) ? true : false;
        //----------------------------------------------
        //Calculamos el punto de interseccion con la pared horizontal
        this.yIntercept = Math.floor(this.y/TAMJUGADOR)*TAMJUGADOR;
        //Si el rayo va hacia abajo, el punto de interseccion es el siguiente
        if(this.abajo) this.yIntercept += TAMJUGADOR;
        //Calculamos el valor de x para el punto de interseccion
        this.xIntercept = this.x + (this.yIntercept - this.y) / Math.tan(this.anguloJugador);
        //Calculamos el incremento de x para cada paso
        this.yStep = TAMJUGADOR;
        this.xStep = this.yStep / Math.tan(this.anguloJugador);
        //Si el rayo va hacia arriba, el paso es negativo
        if(!this.abajo) this.yStep = -this.yStep;
        //Comprobamos si el paso x es negativo
        if((this.izquierda && this.xStep > 0) || (!this.izquierda && this.xStep < 0)) this.xStep *= -1;
        let nextXH = this.xIntercept;
        let nextYH = this.yIntercept;
        //Si apunta hacia arriba, restamos 1 para que no se salga del mapa
        if(!this.abajo) nextYH--;
        //Bucle para recorrer el mapa
        let choqueHorizontal = false;
        while(!choqueHorizontal){
            let casillaX = parseInt(nextXH/TAMJUGADOR);
            let casillaY = parseInt(nextYH/TAMJUGADOR);
            //Comprobamos si hay colision
            if(this.escenario.colision(casillaX, casillaY)){
                choqueHorizontal = true;
                this.wallHitXH = nextXH;
                this.wallHitYH = nextYH;
            }
            else{
                nextXH += this.xStep;
                nextYH += this.yStep;
            }
        }
        this.wallHitX = this.wallHitXH;
        this.wallHitY = this.wallHitYH;

        //----------------------------------------------
        //Calculamos el punto de interseccion con la pared vertical
        let choqueVertical = false;
        this.xIntercept = Math.floor(this.x/TAMJUGADOR)*TAMJUGADOR;
        

    }
    dibujar(){
        this.cast();
        this.ctx.beginPath();
        this.ctx.moveTo(this.x, this.y);
        this.ctx.lineTo(this.wallHitX, this.wallHitY);
        this.ctx.strokeStyle = "yellow";
        this.ctx.stroke();
    }
}
class Nivel {
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
    colision(x, y) {
        return (this.matrixlvl[y][x] != 0) ? true : false;
    }

    dibujar() {
        let color;
        for (let y = 0; y < this.altoM; y++) {
            for (let x = 0; x < this.anchoM; x++) {
                //Recorremos la matriz y pintamos los cuadros dependiendo de cada color
                color = (this.matrixlvl[y][x] == 1) ? "#000000" : "#666666"
                this.ctx.fillStyle = color;
                this.ctx.fillRect(x * this.anchoCuadro, y * this.altoCuadro, this.anchoCuadro, this.altoCuadro);
            }
        }
    }
}
class Jugador {
    constructor(ctx, escenario, x, y) {
        this.ctx = ctx;
        this.escenario = escenario;
        this.x = x;
        this.y = y;
        this.avanza = 0; //0: no avanza, 1: avanza, -1: retrocede
        this.gira = 0;  //0: no gira, 1: gira a la derecha, -1: gira a la izquierda
        this.anguloRotacion = 0; //Ángulo de rotación en grados
        this.velocidad = 3; //Velocidad de avance, pixeles por frame
        this.velocidadAngular = 3 * (Math.PI / 180); //Velocidad de giro, grados por frame
        //Rayo
        this.rayo = new Rayo(this.ctx, this.escenario, this.x, this.y, this.anguloRotacion, 0);
    }

    arriba(isActive) {
        console.log("Arriba");
        this.avanza = isActive ? 1 : 0;
    }
    abajo(isActive) {
        console.log("Abajo");
        this.avanza = isActive ? -1 : 0;
    }
    izquierda(isActive) {
        console.log("Izquierda");
        this.gira = isActive ? -1 : 0;
    }
    derecha(isActive) {
        console.log("Derecha");
        this.gira = isActive ? 1 : 0;
    }
    colision(x, y) {
        //Calculamos la casilla en la que se encuentra el jugador
        let casiillaX = parseInt(x / this.escenario.anchoCuadro);
        let casiillaY = parseInt(y / this.escenario.altoCuadro);
        return this.escenario.colision(casiillaX, casiillaY);
    }

    actulizarPOS() {
        //Avanzar
        let nuevoX = this.x + (this.avanza * this.velocidad * Math.cos(this.anguloRotacion));
        let nuevoY = this.y + (this.avanza * this.velocidad * Math.sin(this.anguloRotacion));
        if (!this.colision(nuevoX, nuevoY)) {
            this.x = nuevoX;
            this.y = nuevoY;
        }
        //Girar
        this.anguloRotacion += (this.gira * this.velocidadAngular);
        this.anguloRotacion = normalizarAngulo(this.anguloRotacion);//dudosillo
        //Rayo
        this.rayo.setAngulo(this.anguloRotacion);
    }

    dibujar() {
        //Dibujar el jugador
        this.actulizarPOS();
        //Rayo
        this.rayo.setPosicion(this.x, this.y);
        this.rayo.dibujar();
        //Cuadrito
        this.ctx.fillStyle = "#ff0000";
        //(-3,-3,6,6) para que el centro del cuadrito sea el centro del jugador
        this.ctx.fillRect(this.x-3, this.y-3, 6, 6);
        //Linea de direccion
        let xDestino = this.x + (40 * Math.cos(this.anguloRotacion));
        let yDestino = this.y + (40 * Math.sin(this.anguloRotacion));
        this.ctx.beginPath();
        this.ctx.moveTo(this.x, this.y);
        this.ctx.lineTo(xDestino, yDestino);
        this.ctx.strokeStyle = "#ff0000";
        this.ctx.stroke();

    }

}
//-----------------------------------------------------
//TECLADO
const TECLAS = {
    "w": (isActive) => jugador.arriba(isActive),
    "s": (isActive) => jugador.abajo(isActive),
    "a": (isActive) => jugador.izquierda(isActive),
    "d": (isActive) => jugador.derecha(isActive),
    "ArrowLeft": (isActive) => jugador.izquierda(isActive),
    "ArrowRight": (isActive) => jugador.derecha(isActive)
}

document.addEventListener('keydown', (tecla) => TECLAS[tecla.key](true));
document.addEventListener('keyup', (tecla) => TECLAS[tecla.key](false));

//-----------------------------------------------------
function inicializar() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    //Tamaño del canvas
    canvas.width = CANVASANCHO;
    canvas.height = CANVASALTO;
    escenario = new Nivel(canvas, ctx, nivel1);
    jugador = new Jugador(ctx, escenario, 200, 100);
    //Llamada a la función principal
    setInterval(() => principal(), 1000 / FPS);
}

function borraCanvas() {
    canvas.width = CANVASANCHO;
    canvas.height = CANVASALTO;
}

function principal() {
    borraCanvas();
    escenario.dibujar();
    jugador.dibujar();
}
