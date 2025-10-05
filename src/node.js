import { Graphics } from "pixi.js";
import { Link } from "./link.js";

export class Node {
  constructor(x, y, id) {
    this.x = x;
    this.y = y;
    this.id = id;
    this.radius = 15;
    this.circle = new Graphics().fill({ color: 0xffffff });
    //============Core Properties=============================
    this.links = [];
    this.friends = [];
    this.outgoing = this.randomOutgoing();
    this.maxLinks = Math.floor(this.outgoing * 0.5); // Max links is 50 for most outgoing node, 1 for least
    this.personality = BigInt.asUintN(
      64,
      BigInt(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER))
    ); //random 64 bit integer for comparing personalities
  }
  draw() {
    this.circle.clear();
    this.circle.circle(0, 0, this.radius).fill({ color: 0xffffff });
    this.circle.x = this.x;
    this.circle.y = this.y;
    return this.circle;
  }
  //returns a random number from a normal distribution with mean 50 and stddev 15, clamped between 1 and 100
  randomOutgoing() {
    let u = 0,
      v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    num = 50 + num * 15;
    console.log("Outgoing: ", Math.round(num));
    return Math.min(Math.max(Math.round(num), 1), 100);
  }

  // Compares this node's personality with another node's personality
  // Returns a similarity score between 0 and 1 (1 means identical, 0 means completely different)
  // Expected average score for random personalities is 0.5
  comparePersonality(otherPersonality) {
    let xor = this.personality ^ otherPersonality;
    let diffBits = xor.toString(2).split("1").length - 1;
    return 1 - diffBits / 64;
  }

  distanceTo(otherNode) {
    return Math.hypot(this.x - otherNode.x, this.y - otherNode.y);
  }

  formLinks(allNodes, allLinks) {
    if (this.links.length >= this.maxLinks) return;
    const maxDistance = 300;

    for (let target of allNodes) {
      if (target === this) continue;
      if (this.friends.some((n) => n === target)) continue;

      const distance = this.distanceTo(target);
      if (distance > maxDistance) continue;

      const probA = this.outgoing / 100;
      const probB = target.outgoing / 100;
      if (Math.random() < (probA + probB) / 2) {
        const newLink = new Link(this, target);
        this.links.push(newLink);
        target.links.push(newLink);
        this.friends.push(target);
        target.friends.push(this);

        allLinks.push(newLink);


        if (this.links.length >= this.maxLinks) break;
      }
    }
  }
}
