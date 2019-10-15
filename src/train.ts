import * as PIXI from "pixi.js";
import { interpret, Interpreter, Machine, StateMachine } from "xstate";
import anime from "animejs";
import { Subject } from "rxjs";

interface TrainContext {}

interface TrainStateSchema {
  states: {
    stop: {};
    running: {};
    loading: {};
    downloading: {};
  };
}

type TrainEvent =
  | { type: "RUN" }
  | { type: "STOP" }
  | { type: "LOAD" }
  | { type: "DOWNLOAD" };

export class Train extends PIXI.Graphics {
  private machine: StateMachine<TrainContext, TrainStateSchema, TrainEvent>;
  public states: Interpreter<TrainContext, TrainStateSchema, TrainEvent>;
  public cargo: number = 0;

  cargoChanged = new Subject<number>();

  constructor() {
    super();

    this.beginFill(0xff0000);
    this.drawRect(0, 0, 10, 10);
    this.endFill();

    this.machine = Machine<TrainContext, TrainStateSchema, TrainEvent>({
      strict: true,
      initial: "stop",
      states: {
        stop: {
          on: {
            RUN: "running",
            LOAD: "loading",
            DOWNLOAD: "downloading"
          }
        },
        running: {
          on: {
            STOP: "stop"
          }
        },
        loading: {
          onEntry: () => {
            this.cargo = 200;
            this.cargoChanged.next(this.cargo);
          },
          on: {
            STOP: "stop",
            DOWNLOAD: "downloading"
          }
        },
        downloading: {
          onEntry: () => {
            this.cargo = 0;
            this.cargoChanged.next(this.cargo);
          },
          on: {
            STOP: "stop",
            LOAD: "loading"
          }
        }
      }
    });

    this.states = interpret(this.machine);

    this.states.onTransition(state => {
      console.log(state.value);
    });

    this.states.start();

    this.interactive = true;

    this.on("click", () => {
      if (this.states.state.value === "stop") {
        this.states.send("DOWNLOAD");
      } else if (this.states.state.value === "downloading") {
        this.states.send("LOAD");
      } else if (this.states.state.value === "loading") {
        this.states.send("STOP");
        this.states.send("RUN");
      }
    });
  }

  go({ x, y }: { x: number; y: number }) {
    this.states.send("RUN");
    anime({
      targets: this,
      x,
      y,
      duration: 3000,
      easing: "easeInOutQuart"
    });
  }
}
