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

function preload() {
  for (let i = 0; i < 3; i++) {
    imagenes[i] = loadImage(`media/imagen${i}.jpg`);
    musicas[i] = loadSound(`media/musica${i}.mp3`);
  }

  objetivo = loadImage("media/objetivo.png");
  sonidoDisparo = loadSound("media/disparo.mp3");
}

function setup() {
  createCanvas(1280, 720);
  textAlign(CENTER, CENTER);
  textSize(24);

  fondoActual = imagenes[0];
  musicaActual = musicas[0];
  musicaActual.loop();

  crearBotonesInicio();
  nuevaPosicionObjetivo();
  actualizarDificultad();
}

function draw() {
  background(fondoActual);

  if (estado === "INICIO") {
    fill(255);
    textSize(40);
    text("TRAIN AIM", width / 2, height / 2 - 60);
    textSize(24);
    text("Pulsa cualquier tecla para comenzar", width / 2, height / 2 + 10);
  }

  else if (estado === "MENU") {
    fill(255);
    text("MENÚ PRINCIPAL", width / 2, 100);
  }

  else if (estado === "CONFIGURACION_GENERAL") {
    fill(255);
    text("Configuración: General", width / 2, 60);
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
      text("Tiempo terminado!", width / 2, height / 2 - 20);
      text("Puntos: " + puntos, width / 2, height / 2 + 20);
    }
  }

  else if (estado === "EXIT") {
    fill(255);
    text("¡Gracias por jugar!", width / 2, height / 2);
  }
}

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
}

function keyPressed() {
  if (estado === "INICIO") {
    estado = "MENU";
    crearBotonesMenu();
  }
}

function nuevaPosicionObjetivo() {
  let x = random(0, width - tamañoObjetivo);
  let y = random(0, height - tamañoObjetivo);
  posicionObjetivo = createVector(x, y);
}

function iniciarJuego() {
  estado = "RUN";
  puntos = 0;
  tiempoInicio = millis();
  juegoTerminado = false;
  nuevaPosicionObjetivo();
  actualizarDificultad();
  crearBotonesJuego();
}

function crearBotonesInicio() {
  ocultarBotones();
}

function crearBotonesMenu() {
  ocultarBotones();
  botones.push(crearBoton("Modo Entrenamiento", width / 2 - 100, 150, iniciarJuego));
  botones.push(crearBoton("Social", width / 2 - 50, 200, () => {}));
  botones.push(crearBoton("Tienda", width / 2 - 50, 250, () => {}));
  botones.push(crearBoton("Configuración", width / 2 - 80, 300, () => {
    estado = "CONFIGURACION_GENERAL";
    crearBotonesConfigGeneral();
  }));
  botones.push(crearBoton("Estadísticas", width / 2 - 70, 350, () => {
    estado = "ESTADISTICAS";
    crearBotonesEstadisticas();
  }));
  botones.push(crearBoton("Salir", width / 2 - 40, 400, () => {
    estado = "EXIT";
    ocultarBotones();
  }));
}

function crearBotonesJuego() {
  ocultarBotones();
  botones.push(crearBoton("Terminar", width - 120, 20, () => {
    estado = "MENU";
    crearBotonesMenu();
  }));
}

function crearBotonesConfigGeneral() {
  ocultarBotones();
  botones.push(crearBoton("Cambiar Fondo", width / 2 - 70, 120, () => {
    let index = (imagenes.indexOf(fondoActual) + 1) % imagenes.length;
    fondoActual = imagenes[index];
  }));
  botones.push(crearBoton("Cambiar Música", width / 2 - 75, 170, () => {
    musicaActual.stop();
    let index = (musicas.indexOf(musicaActual) + 1) % musicas.length;
    musicaActual = musicas[index];
    musicaActual.loop();
  }));
  botones.push(crearBoton("Juego", width / 2 - 40, 220, () => {
    estado = "CONFIGURACION_DIFICULTAD";
    crearBotonesConfigDificultad();
  }));
  botones.push(crearBoton("Controles", width / 2 - 40, 270, () => {}));
  botones.push(crearBoton("Video & Sonido", width / 2 - 70, 320, () => {}));
  botones.push(crearBoton("Volver", width / 2 - 40, 370, () => {
    estado = "MENU";
    crearBotonesMenu();
  }));
}

function crearBotonesConfigDificultad() {
  ocultarBotones();
  botones.push(crearBoton("Cambiar Dificultad", width / 2 - 90, 120, () => {
    if (dificultad === "Facil") dificultad = "Media";
    else if (dificultad === "Media") dificultad = "Dificil";
    else dificultad = "Facil";
    actualizarDificultad();
  }));
  botones.push(crearBoton("Volver", width / 2 - 40, 170, () => {
    estado = "CONFIGURACION_GENERAL";
    crearBotonesConfigGeneral();
  }));
}

function crearBotonesEstadisticas() {
  ocultarBotones();
  botones.push(crearBoton("General", width / 2 - 40, 120, () => {}));
  botones.push(crearBoton("Por modo de juego", width / 2 - 90, 170, () => {}));
  botones.push(crearBoton("Histórico", width / 2 - 50, 220, () => {}));
  botones.push(crearBoton("Análisis de fallo", width / 2 - 90, 270, () => {}));
  botones.push(crearBoton("Volver", width / 2 - 40, 320, () => {
    estado = "MENU";
    crearBotonesMenu();
  }));
}

function actualizarDificultad() {
  if (dificultad === "Facil") tamañoObjetivo = 200;
  else if (dificultad === "Media") tamañoObjetivo = 150;
  else tamañoObjetivo = 100;
}

function crearBoton(label, x, y, callback) {
  let btn = createButton(label);
  btn.position(x, y);
  btn.mousePressed(callback);
  return btn;
}

function ocultarBotones() {
  for (let btn of botones) {
    btn.remove();
  }
  botones = [];
}
