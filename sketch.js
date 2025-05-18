let estado = "INICIO";

let imagenes = [];
let musicas = [];
let fondoActual;
let musicaActual;

let objetivo;
let sonidoDisparo;
let posicionObjetivo;
let puntos = 0;

let tiempoTotal = 20000;
let tiempoInicio;
let juegoTerminado = false;

let tamañoObjetivo;
let dificultad = "Media";

let botones = [];

// Variables para mensajes temporales
let mensajeTemporal = "";
let tiempoMensaje = 0;

// Carga imágenes y sonidos antes de iniciar el juego
function preload() {
  for (let i = 0; i < 3; i++) {
    imagenes[i] = loadImage(`media/imagen${i}.jpg`);
    musicas[i] = loadSound(`media/musica${i}.mp3`);
  }

  objetivo = loadImage("media/objetivo.png");
  sonidoDisparo = loadSound("media/disparo.mp3");
}

// Configura los elementos iniciales del juego
function setup() {
  createCanvas(1920, 1080);
  textAlign(CENTER, CENTER);
  textSize(24);

  fondoActual = imagenes[0];
  musicaActual = musicas[0];
  musicaActual.loop();

  crearBotonesInicio();
  nuevaPosicionObjetivo();
  actualizarDificultad();
}

// Dibuja los distintos estados del juego 
function draw() {
  background(fondoActual);

  if (estado === "INICIO") {
    fill(255, 0, 0);
    textSize(40);
    text("TRAIN AIM", width / 2, height / 2 - 60);
    textSize(24);
    text("Haz clic o pulsa una tecla para comenzar", width / 2, height / 2 + 10);
  }

  else if (estado === "MENU") {
    fill(255);
    text("MENÚ PRINCIPAL", width / 2, 100);
  }

  else if (estado === "CONFIGURACION_GENERAL") {
    fill(255);
    text("Configuración", width / 2, 60);
  }

  else if (estado === "CONFIGURACION_DIFICULTAD") {
    fill(255);
    text("Configuración: Dificultad", width / 2, 60);
    text("Nivel actual: " + dificultad, width / 2, 300);
  }

  else if (estado === "RUN") {
    if (!juegoTerminado) {
      image(objetivo, posicionObjetivo.x, posicionObjetivo.y, tamañoObjetivo, tamañoObjetivo);
      fill(255);
      text("Puntos: " + puntos, 100, 50);
      let tiempoRestante = max(0, tiempoTotal - (millis() - tiempoInicio));
      text("Tiempo: " + floor(tiempoRestante / 1000), 100, 100);

      if (tiempoRestante <= 0) {
        juegoTerminado = true;
        ocultarBotones();
      }
    } else {
      fill(255, 0, 0);
      text("¡Game Over!", width / 2, height / 2 - 40);
      text("Puntos: " + puntos, width / 2, height / 2);

      if (!botones.length) {
        botones.push(crearBoton("Volver al menú", width / 2 - 110, height / 2 + 50, () => {
          estado = "MENU";
          crearBotonesMenu();
        }));
      }
    }
  }

  else if (estado === "EXIT") {
    fill(255);
    text("¡Gracias por jugar!", width / 2, height / 2);
  }

  // Mostrar mensaje temporal de funcion no disponible 
  if (mensajeTemporal && millis() < tiempoMensaje) {
    fill(255, 0 , 0);
    textSize(32);
    text(mensajeTemporal, width / 2, height - 250);
  }
}

// Comprueba el disparo
function mousePressed() {
  if (estado === "RUN" && !juegoTerminado) {
    if (
      mouseX > posicionObjetivo.x &&
      mouseX < posicionObjetivo.x + tamañoObjetivo &&
      mouseY > posicionObjetivo.y &&
      mouseY < posicionObjetivo.y + tamañoObjetivo
    ) {
      puntos++;
      sonidoDisparo.play();
      nuevaPosicionObjetivo();
    }
  }
// Permite iniciar el juego desde pantalla de INICIO con el ratón
  if (estado === "INICIO") {
    estado = "MENU";
    crearBotonesMenu();
  }
}

// Permite iniciar el juego desde pantalla de INICIO con el teclado
function keyPressed() {
  if (estado === "INICIO") {
    estado = "MENU";
    crearBotonesMenu();
  }
}

// Genera una nueva posición aleatoria para el objetivo
function nuevaPosicionObjetivo() {
  let x = random(0, width - tamañoObjetivo);
  let y = random(0, height - tamañoObjetivo);
  posicionObjetivo = createVector(x, y);
}

// Inicializa variables y estado para comenzar una partida
function iniciarJuego() {
  estado = "RUN";
  puntos = 0;
  tiempoInicio = millis();
  juegoTerminado = false;
  nuevaPosicionObjetivo();
  actualizarDificultad();
  crearBotonesJuego();
}

// Crea botones iniciales 
function crearBotonesInicio() {
  ocultarBotones();
}

// Muestra botones del menú principal
function crearBotonesMenu() {
  ocultarBotones();
  botones.push(crearBoton("Modo Entrenamiento", width / 2 - 110, 150, iniciarJuego));
  botones.push(crearBoton("Social", width / 2 - 110, 200, () => {
    mostrarMensaje("Función no disponible.");
  }));
  botones.push(crearBoton("Tienda", width / 2 - 110, 250, () => {
    mostrarMensaje("Función no disponible.");
  }));
  botones.push(crearBoton("Configuración", width / 2 - 110, 300, () => {
    estado = "CONFIGURACION_GENERAL";
    crearBotonesConfigGeneral();
  }));
  botones.push(crearBoton("Estadísticas", width / 2 - 110, 350, () => {
    estado = "ESTADISTICAS";
    crearBotonesEstadisticas();
  }));
  botones.push(crearBoton("Salir", width / 2 - 110, 400, () => {
    estado = "EXIT";
    ocultarBotones();
  }));
}

// Muestra botón para salir durante el juego
function crearBotonesJuego() {
  ocultarBotones();
  botones.push(crearBoton("Terminar", width - 240, 20, () => {
    estado = "MENU";
    crearBotonesMenu();
  }));
}

// Muestra opciones de configuración general
function crearBotonesConfigGeneral() {
  ocultarBotones();
  botones.push(crearBoton("Cambiar Fondo", width / 2 - 110, 120, () => {
    let index = (imagenes.indexOf(fondoActual) + 1) % imagenes.length;
    fondoActual = imagenes[index];
  }));
  botones.push(crearBoton("Cambiar Música", width / 2 - 110, 170, () => {
    musicaActual.stop();
    let index = (musicas.indexOf(musicaActual) + 1) % musicas.length;
    musicaActual = musicas[index];
    musicaActual.loop();
  }));
  botones.push(crearBoton("Juego", width / 2 - 110, 220, () => {
    estado = "CONFIGURACION_DIFICULTAD";
    crearBotonesConfigDificultad();
  }));
  botones.push(crearBoton("Controles", width / 2 - 110, 270, () => {
    mostrarMensaje("Función no disponible.");
  }));
  botones.push(crearBoton("Video & Sonido", width / 2 - 110, 320, () => {
    mostrarMensaje("Función no disponible.");
  }));
  botones.push(crearBoton("Volver", width / 2 - 110, 370, () => {
    estado = "MENU";
    crearBotonesMenu();
  }));
}

// Muestra opciones para cambiar la dificultad del juego
function crearBotonesConfigDificultad() {
  ocultarBotones();
  botones.push(crearBoton("Cambiar Dificultad", width / 2 - 110, 120, () => {
    if (dificultad === "Facil") dificultad = "Media";
    else if (dificultad === "Media") dificultad = "Dificil";
    else dificultad = "Facil";
    actualizarDificultad();
  }));
  botones.push(crearBoton("Volver", width / 2 - 110, 170, () => {
    estado = "CONFIGURACION_GENERAL";
    crearBotonesConfigGeneral();
  }));
}

// Muestra botones en la sección de estadísticas
function crearBotonesEstadisticas() {
  ocultarBotones();
  botones.push(crearBoton("General", width / 2 - 110, 120, () => {
    mostrarMensaje("Función no disponible.");
  }));
  botones.push(crearBoton("Por modo de juego", width / 2 - 110, 170, () => {
    mostrarMensaje("Función no disponible.");
  }));
  botones.push(crearBoton("Histórico", width / 2 - 110, 220, () => {
    mostrarMensaje("Función no disponible.");
  }));
  botones.push(crearBoton("Análisis de fallo", width / 2 - 110, 270, () => {
    mostrarMensaje("Función no disponible.");
  }));
  botones.push(crearBoton("Volver", width / 2 - 110, 320, () => {
    estado = "MENU";
    crearBotonesMenu();
  }));
}

// Ajusta el tamaño del objetivo según la dificultad seleccionada
function actualizarDificultad() {
  if (dificultad === "Facil") tamañoObjetivo = 200;
  else if (dificultad === "Media") tamañoObjetivo = 150;
  else tamañoObjetivo = 100;
}

// Crea botones
function crearBoton(label, x, y, callback) {
  let btn = createButton(label);
  btn.position(x, y);
  btn.mousePressed(callback);

  btn.style("width", "220px");
  btn.style("text-align", "center");
  btn.style("font-size", "18px");
  btn.style("font-weight", "bold");
  btn.style("padding", "12px");
  btn.style("border-radius", "12px");
  btn.style("border", "2px solid #ffffff");
  btn.style("background-color", "#FF0000");
  btn.style("color", "#fff");
  btn.style("cursor", "pointer");

  return btn;
}

// Elimina todos los botones visibles
function ocultarBotones() {
  for (let btn of botones) {
    btn.remove();
  }
  botones = [];
}

// MEnsaje temporal
function mostrarMensaje(texto, duracion = 2000) {
  mensajeTemporal = texto;
  tiempoMensaje = millis() + duracion;
}
