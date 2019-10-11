import { interpret, Machine, StateMachine, Interpreter } from "xstate";

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

export class Train {
  public x: number = 0;
  public y: number = 0;
  public state: Interpreter<TrainContext, TrainStateSchema, TrainEvent>;

  constructor() {
    this.x = 0;
    this.y = 0;

    const machine = Machine<TrainContext, TrainStateSchema, TrainEvent>({
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
          on: {
            STOP: "stop"
          }
        },
        downloading: {
          on: {
            STOP: "stop"
          }
        }
      }
    });

    this.state = interpret(machine);

    this.state.onTransition(state => {
      console.log(state.value);

      switch (state.value) {
        case "stop":
          this.x = 0;
          this.y = 0;
          break;
        case "running":
          this.x = 100;
          this.y = 100;
          break;
      }
    });

    this.state.start();
  }
}
