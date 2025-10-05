import { Application, Graphics, TilingSprite, Container } from "pixi.js";
import { Node } from "./node.js";
import { Population } from "./population.js";
// import { Link } from "./link.js";

(async () => {
  const app = new Application();

  await app.init({
    resizeTo: window,
    backgroundColor: 0x1099bb,
    resolution: window.devicePixelRatio||1,
    autoDensity: true,
    antialias: true,
  });
  app.canvas.style.position = "absolute";
  document.body.appendChild(app.canvas);

  const mapContainer = new Container();
  mapContainer.x = app.screen.width / 2;
  mapContainer.y = app.screen.height / 2;
  app.stage.addChild(mapContainer);

  const button = document.createElement("button");
  button.textContent = "Next Tick";
  button.style.position = "absolute";
  button.style.top = "10px";
  button.style.left = "10px";
  button.style.padding = "6px 12px";
  document.body.appendChild(button);

  button.addEventListener("click", () => {
    stepSimulation();
  });

  const gridSize = 50;
  const gridGraphics = new Graphics();
  gridGraphics.setStrokeStyle({ width: 1, color: 0xffffff, alpha: 0.1 });
  gridGraphics.moveTo(gridSize, 0).lineTo(gridSize, gridSize);
  gridGraphics.moveTo(0, gridSize).lineTo(gridSize, gridSize);
  gridGraphics.stroke();

  // Generate the texture
  const gridTexture = app.renderer.generateTexture(gridGraphics);

  // Create TilingSprite using modern options
  const grid = new TilingSprite({
    texture: gridTexture,
    width: app.screen.width * 50,
    height: app.screen.height * 50,
    anchor: { x: 0.5, y: 0.5 },
  });
  grid.x = 0;
  grid.y = 0;
  mapContainer.addChild(grid);

  const pop = new Population(
    app,
    mapContainer,
    app.screen.width,
    app.screen.height,
    200
  );

  const nodes = [];
  for (let i = 0; i < 10; i++) {
    const x = (Math.random() - 0.5) * app.screen.width;
    const y = (Math.random() - 0.5) * app.screen.height;
    const n = new Node(x, y, i);
    mapContainer.addChild(n.draw());
    nodes.push(n);
    pop.nodes.push(n);
  }
  const links = [];

  function stepSimulation() {
    const newNodes = pop.spawnNewNodes(0.1);
    for (let n of newNodes) {
      mapContainer.addChild(n.draw());
      nodes.push(n);
    }
    for (let node of nodes) node.formLinks(nodes, links);
    for (let link of links) {
      mapContainer.addChild(link.update(links));
    }
    pop.update();
  }

  // Dragging logic
  let dragging = false;
  let dragStart = { x: 0, y: 0 };
  let mapStart = { x: 0, y: 0 };

  app.stage.interactive = true;
  app.stage.on("pointerdown", (event) => {
    dragging = true;
    dragStart = event.getLocalPosition(app.stage);
    mapStart = { x: mapContainer.x, y: mapContainer.y };
  });
  app.stage.on("pointerup", () => (dragging = false));
  app.stage.on("pointerupoutside", () => (dragging = false));
  app.stage.on("pointermove", (event) => {
    if (dragging) {
      const current = event.getLocalPosition(app.stage);
      mapContainer.x = mapStart.x + (current.x - dragStart.x);
      mapContainer.y = mapStart.y + (current.y - dragStart.y);
    }
  });
})();
