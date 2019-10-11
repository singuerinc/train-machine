import { Train } from "./train";

const t = new Train();

console.log(t.x, t.y);

t.state.send("RUN");

console.log(t.x, t.y);
