import { data } from "./data.js";
import { createScreen } from "./utils.js";
import Escenario from "./clases/escenario.js";
import Jugador2D  from "./clases/jugador2d.js";
import RayCasting from "./clases/raycasting.js";



// Variables globales
const SCREEN = createScreen(data.screen.width, data.screen.height); // Creación del canvas
const SCREEN3D = createScreen(data.screen.width, data.screen.height); // Creación del canvas 3D
const CTX = SCREEN.getContext("2d"); // Contexto del canvas
const CTX3D = SCREEN3D.getContext("2d"); // Contexto del canvas 3D
let escenario;
let rayCasting;
let jugador2d;

// Eventos de teclado
const TECLAS = {
    "w": (isActive) => jugador2d.arriba(isActive),
    "s": (isActive) => jugador2d.abajo(isActive),
    "a": (isActive) => jugador2d.izquierda(isActive),
    "d": (isActive) => jugador2d.derecha(isActive),
    "ArrowLeft": (isActive) => jugador2d.izquierda(isActive),
    "ArrowRight": (isActive) => jugador2d.derecha(isActive)
}

document.addEventListener('keydown', (tecla) => TECLAS[tecla.key](true));
document.addEventListener('keyup', (tecla) => TECLAS[tecla.key](false));

// Función de renderizado

function clearScreen() {
    CTX.clearRect(0, 0, data.screen.width, data.screen.height);
    CTX3D.clearRect(0, 0, data.screen.width, data.screen.height);
}

// Bucle de renderizado y funcion principal
function main() {
    escenario = new Escenario(SCREEN, CTX, data.map)
    jugador2d = new Jugador2D(CTX, escenario, CTX3D, data.player.x, data.player.y)
    rayCasting = new RayCasting()
    setInterval(() => inicializar(), data.render.delay);
}
function inicializar() {
    clearScreen();
    escenario.dibujar();
    jugador2d.dibujar();
    rayCasting.throwRay(data, CTX3D);
}
main();