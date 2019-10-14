import * as PIXI from "pixi.js";
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
train.cargoChanged.subscribe(cargo => console.log("train 1 – cargo:", cargo));

app.stage.addChild(train);

const loop = () => {
  requestAnimationFrame(loop);
  app.renderer.render(app.stage);
};

loop();
