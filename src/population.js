import { Node } from "./node.js";
// import { Link } from "./link.js";
import { Graphics } from "pixi.js";

export class Population {
  constructor(app, mapContainer, width, height, cellSize = 200) {
    this.width = width;
    this.height = height;
    this.cellSize = cellSize;
    this.cols = Math.ceil(width / cellSize);
    this.rows = Math.ceil(height / cellSize);
    this.nodes = [];
    this.grid = [];
    this.app = app;
    this.mapContainer = mapContainer;
    this.density = Array.from({ length: this.rows }, () =>
      new Array(this.cols).fill(0)
    );
    this.gridOverlay = new Graphics();
    mapContainer.addChild(this.gridOverlay);
  }

  addNode(x, y, id) {
    const n = new Node(x, y, id);
    this.mapContainer.addChild(n.draw());
    this.nodes.push(n);
  }

  computeDensity() {
    // reset grid
    for (let r = 0; r < this.rows; r++) {
      this.density[r].fill(0);
    }

    // count nodes per cell
    for (let node of this.nodes) {
      const c = Math.floor((node.x + this.width / 2) / this.cellSize);
      const r = Math.floor((node.y + this.height / 2) / this.cellSize);
      if (r >= 0 && r < this.rows && c >= 0 && c < this.cols) {
        this.density[r][c] += 1;
       }
    }

   const totalNodes = this.nodes.length || 1

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        this.density[r][c] /= totalNodes;
        console.log("density: ", this.density[r][c]);
      }
    }
  }

  spawnNewNodes(rate = 0.1) {
    if (this.nodes.length === 0) return [];

    const newNodes = [];
    for (let r = 0; r < this.rows; r++) {
        for (let c = 0; c < this.cols; c++) {
            const d = this.density[r][c];
            const expectedNew = rate * Math.pow(d, 1.5);
            if (Math.random() < expectedNew){
                const x = c * this.cellSize - this.width / 2 + Math.random() * this.cellSize;
                const y = r * this.cellSize - this.height / 2 + Math.random() * this.cellSize;
                
                const n = new Node(x, y, this.nodes.length + newNodes.length);
                newNodes.push(n);
                this.nodes.push(n);
            }
        }
    }
    return newNodes;

  }

  //   moveNodes(stepSize = 2) {}

  drawDensityGrid() {
    this.gridOverlay.clear();

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const density = this.density[r][c];
        const color = Math.floor(0x0000ff * density + 0xff0000 * (1 - density));
        const alpha = 0.15 + density * 0.35;

        this.gridOverlay.rect(
          c * this.cellSize - this.width / 2,
          r * this.cellSize - this.height / 2,
          this.cellSize,
          this.cellSize
        );
        this.gridOverlay.fill({ color, alpha });
      }
    }
  }

  update() {
    this.computeDensity();
    this.drawDensityGrid();
  }
}
