const canvas = document.getElementById("screen");
const ctx = canvas.getContext("2d");

// Ajustar canvas al tamaño real
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

// Tamaños
const radioVisual = 40;
const radioColision = 28;

// 📺 ÁREA DE LA PANTALLA DE BMO (AJUSTA ESTO)
const pantalla = {
  x: -5,
  y: -5,
  width: 460,
  height: 460
};

const gatos = [];

const imagenes = [
  "img/Lucifer.png",
  "img/Momo.png",
  "img/Mota.png",
  "img/Shiro.png",
  "img/Solaris.png"
];

// Comprobar colisión inicial
function posicionValida(x, y) {
  for (let g of gatos) {
    const dx = g.x - x;
    const dy = g.y - y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < radioColision * 2) return false;
  }
  return true;
}

// Crear gatos DENTRO de la pantalla
imagenes.forEach(src => {
  const img = new Image();
  img.src = src;

  let x, y;
  let intentos = 0;

  do {
    x = Math.random() * (pantalla.width - radioVisual * 2) + pantalla.x + radioVisual;
    y = Math.random() * (pantalla.height - radioVisual * 2) + pantalla.y + radioVisual;
    intentos++;
  } while (!posicionValida(x, y) && intentos < 100);

  gatos.push({
    img,
    x,
    y,
    dx: (Math.random() * 1 + 0.5) * (Math.random() < 0.5 ? -1 : 1),
    dy: (Math.random() * 1 + 0.5) * (Math.random() < 0.5 ? -1 : 1)
  });
});

function animar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < gatos.length; i++) {
    const gato = gatos[i];

    gato.x += gato.dx;
    gato.y += gato.dy;

    // Límites reales de la pantalla
    const left = pantalla.x + radioVisual;
    const right = pantalla.x + pantalla.width - radioVisual;
    const top = pantalla.y + radioVisual;
    const bottom = pantalla.y + pantalla.height - radioVisual;

    // Rebotes contra la pantalla
    if (gato.x <= left) {
      gato.x = left;
      gato.dx *= -1;
    }
    if (gato.x >= right) {
      gato.x = right;
      gato.dx *= -1;
    }
    if (gato.y <= top) {
      gato.y = top;
      gato.dy *= -1;
    }
    if (gato.y >= bottom) {
      gato.y = bottom;
      gato.dy *= -1;
    }

    // Colisiones entre gatos
    for (let j = i + 1; j < gatos.length; j++) {
      const otro = gatos[j];

      const dx = gato.x - otro.x;
      const dy = gato.y - otro.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < radioColision * 2 && dist > 0) {
        const nx = dx / dist;
        const ny = dy / dist;

        const solape = radioColision * 2 - dist;

        gato.x += nx * solape / 2;
        gato.y += ny * solape / 2;
        otro.x -= nx * solape / 2;
        otro.y -= ny * solape / 2;

        [gato.dx, otro.dx] = [otro.dx, gato.dx];
        [gato.dy, otro.dy] = [otro.dy, gato.dy];
      }
    }

    // Dibujar
    ctx.drawImage(
      gato.img,
      gato.x - radioVisual,
      gato.y - radioVisual,
      radioVisual * 2,
      radioVisual * 2
    );
  }

  requestAnimationFrame(animar);
}

animar();
