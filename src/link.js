import { Graphics } from "pixi.js";
import { Node } from "./node.js";

export class Link {
  constructor(nodeA, nodeB) {
    this.nodeA = nodeA;
    this.nodeB = nodeB;
    this.match = nodeA.comparePersonality(nodeB.personality);
    this.age = 0; // Age in simulation steps
    this.strength = 0.1; // Initial strength
    this.line = new Graphics();
  }

  draw() {
    this.line.clear();
    this.line.setStrokeStyle({
      width: this.strength * 8,
      color: 0xffffff,
      alpha: 1,
    });
    this.line
      .moveTo(this.nodeA.x, this.nodeA.y)
      .lineTo(this.nodeB.x, this.nodeB.y);
    this.line.stroke();
    return this.line;
  }

  update(allLinks) {
    this.age += 1;

    const distance = this.nodeA.distanceTo(this.nodeB);
    const distanceFactor = Math.exp(-distance / 300);
    let growth = 0;
    let decay = 0;
    // let startOver = Math.random() < 0.05 ? 1 : 0;
    // const growth = 0.09 * this.match * (1 + mutuals);
    // const decay = 0.09 * (1-this.match) * (1 - distanceFactor);

    const inertia = Math.min(this.age / 1000, 1);
    if (this.match >= 0.5) {
      growth = 0.002 * (this.match - 0.5) * 2 ;
    } else {
      decay = 0.002 * (0.5 - this.match) * 2 * (1 - distanceFactor) * (1 - inertia);
    }
    this.strength += growth - decay;
    this.strength = Math.min(Math.max(this.strength, 0), 1);

    if (this.strength == 0) {
      this.delete(allLinks);
    }

    console.log(
      "Link;",
      this.nodeA.id,
      " to ",
      this.nodeB.id,
      " with strength ",
      this.strength
    );
    return this.draw();
  }

  countMutualLinks() {
    const aFriends = new Set(this.nodeA.friends);
    const bFriends = new Set(this.nodeB.friends);

    let shared = 0;
    for (let n of aFriends) if (bFriends.has(n)) shared++;

    return shared / Math.max(aFriends.size, 1);
  }

  delete(allLinks) {
    this.nodeA.links = this.nodeA.links.filter((l) => l !== this);
    this.nodeB.links = this.nodeB.links.filter((l) => l !== this);

    this.nodeA.friends = this.nodeA.friends.filter((f) => f !== this.nodeB);
    this.nodeB.friends = this.nodeB.friends.filter((f) => f !== this.nodeA);

    allLinks = allLinks.filter((l) => l !== this);
  }
}
