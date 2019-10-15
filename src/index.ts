import * as PIXI from "pixi.js";
import * as dat from "dat.gui";
import { Train } from "./train";

let app = new PIXI.Application({
  antialias: false,
  transparent: false,
  resolution: 1
});
app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.autoResize = true;
app.renderer.resize(window.innerWidth, window.innerHeight);

document.body.appendChild(app.view);

const train = new Train();

app.stage.addChild(train);

const loop = () => {
  requestAnimationFrame(loop);
  app.renderer.render(app.stage);
};

loop();

const gui = new dat.GUI({ name: "Train" });
const cargoCtrl = gui.add(train, "cargo");
const coords = gui.addFolder("Coords");
const nextCoords = {
  x: 100,
  y: 100,
  go: function() {
    train.go({ x: nextCoords.x, y: nextCoords.y });
  }
};
coords.add(nextCoords, "x");
coords.add(nextCoords, "y");
coords.add(nextCoords, "go");

train.cargoChanged.subscribe(cargo => {
  console.log("train 1 – cargo:", cargo);
  cargoCtrl.updateDisplay();
});
