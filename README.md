# Social Network Simulation

This project simulates a social network using nodes and links. Nodes represent individuals with unique personalities and varying outgoing tendencies. Links form between nodes based on personality similarity, proximity, and other dynamic factors.

The simulation is visualized using [Pixi.js](https://pixijs.com/) and allows step-by-step progression via a "Next Tick" button.

---

## Features

- **Node Creation**: Nodes are dynamically generated with positions influenced by population density.
- **Link Formation**: Links form between nodes based on personality similarity and distance.
- **Link Dynamics**: Link strength grows or decays depending on match, distance, and age of the connection.
- **Density Visualization**: Grid-based density visualization shows areas of high and low population.
- **Interactive Map**: Click-and-drag to pan around the network.
- **Step Simulation**: Control the simulation tick-by-tick using a button.

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/social-network.git
cd social-network
