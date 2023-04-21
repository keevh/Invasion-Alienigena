import { drawLine, normalizarAngulo, degToRad } from "../utils.js";
import { data } from "../data.js";
export default class Jugador2D {
    constructor(ctx, escenario, CTX3D, x, y) {
        this.ctx = ctx;
        this.escenario = escenario;
        this.ctx3D = CTX3D;
        let { ancho, alto } = this.escenario.getDimensionesCuadro()
        this.ancho = ancho;
        this.alto = alto;
        this.x = x * this.ancho;
        this.y = y * this.alto;
        this.avanza = 0; //0: no avanza, 1: avanza, -1: retrocede
        this.gira = 0;  //0: no gira, 1: gira a la derecha, -1: gira a la izquierda
    }
    colision(x, y) {
        //Calculamos la casilla en la que se encuentra el jugador
        /*         let casiillaX = parseInt(x / this.escenario.anchoCuadro);
                let casiillaY = parseInt(y / this.escenario.altoCuadro); */
        return this.escenario.colision(x, y);
    }

    actulizarPOS() {
        //0: no avanza, 1: avanza, -1: retrocede
        let newX = data.player.x;
        let newY = data.player.y;
        if (this.avanza == 1) {
            let playerCos = Math.cos(degToRad(data.player.angle)) * data.player.speed.movement;
            let playerSin = Math.sin(degToRad(data.player.angle)) * data.player.speed.movement;
            newX = data.player.x + playerCos;
            newY = data.player.y + playerSin;
        }
        if (this.avanza == -1) {
            let playerCos = Math.cos(degToRad(data.player.angle)) * data.player.speed.movement;
            let playerSin = Math.sin(degToRad(data.player.angle)) * data.player.speed.movement;
            newX = data.player.x - playerCos;
            newY = data.player.y - playerSin;
        }
        if (this.gira == -1) {
            data.player.angle -= data.player.speed.rotation;
        }
        if (this.gira == 1) {
            data.player.angle += data.player.speed.rotation;
        }
        if (!this.colision(Math.floor(newX), Math.floor(newY))) {
            this.x = newX * this.ancho;
            this.y = newY * this.alto;
            data.player.x = newX;
            data.player.y = newY;
        }
    }
    raycast2D(){
        let rayAngle = data.player.angle - data.player.halfFov;
        for (let rayCount  = 0; rayCount  < data.screen.width; rayCount ++) {
            let ray = {
                x: data.player.x,
                y: data.player.y,
            }
            let rayCos = Math.cos(degToRad(rayAngle)) / data.rayCasting.precision;
            let raySin = Math.sin(degToRad(rayAngle)) / data.rayCasting.precision;
            let wall = 0;
            while(wall == 0) {
                ray.x += rayCos;
                ray.y += raySin;
                wall = data.map[Math.floor(ray.y)][Math.floor(ray.x)];
            }
            drawLine(this.ctx, this.x, this.y, ray.x*this.ancho, ray.y*this.alto, "#ff0000");
            rayAngle += data.rayCasting.incrementAngle;
        }
    }

    dibujar() {
        //Dibujar el jugador
        this.actulizarPOS();
        //Rayo
        /* this.rayo.setPosicion(this.x, this.y);
        this.rayo.dibujar(); */
        //Cuadrito
        this.ctx.fillStyle = "#ff0000";
        //(-3,-3,6,6) para que el centro del cuadrito sea el centro del jugador

        this.ctx.fillRect(this.x, this.y, 10, 10);
        //Linea de direccion
        /* let xDestino = this.x + (100 * Math.cos(degToRad(data.player.angle)));
        let yDestino = this.y + (100 * Math.sin(degToRad(data.player.angle)));
        drawLine(this.ctx, this.x, this.y, xDestino, yDestino, "#ff0000"); */
        this.raycast2D();
    }
    arriba(isActive) {
        this.avanza = isActive ? 1 : 0;
    }
    abajo(isActive) {
        this.avanza = isActive ? -1 : 0;
    }
    izquierda(isActive) {
        this.gira = isActive ? -1 : 0;
    }
    derecha(isActive) {
        this.gira = isActive ? 1 : 0;
    }
}
