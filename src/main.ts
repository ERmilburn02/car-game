import { b2World, type b2StepConfig, type XY } from "@box2d/core";
import "./style.css";
import { Car } from "./car.ts";
import { Ground } from "./ground.ts";

const ZoomSize = 12;

const canvas = document.createElement("canvas");
canvas.width = 960;
canvas.height = 540;
document.body.appendChild(canvas);

const ctx = canvas.getContext("2d");
if (!ctx) throw new Error("No canvas context");

const gravity: XY = { x: 0, y: -10 };

const world = b2World.Create(gravity);

const car = new Car(world, { x: 0, y: -13 });
const ground = new Ground(world);

const timeStep = 1 / 60;
const stepConfig: b2StepConfig = {
  velocityIterations: 6,
  positionIterations: 2,
};
let left: boolean | null = null;
addEventListener("keydown", (event: KeyboardEvent) => {
  switch (event.key.toLowerCase()) {
    case "a":
      left = true;
      break;
    case "d":
      left = false;
      break;
  }
});
addEventListener("keyup", () => {
  left = null;
});
function update() {
  let moveInput = 0;
  if (left !== null) moveInput += left ? 1 : -1;
  car.Move(moveInput);

  world.Step(timeStep, stepConfig);
}
setInterval(update, 1000 / 60);

function render(ctx: CanvasRenderingContext2D) {
  startFrame(ctx, 0, 6, ZoomSize);

  ground.Render(ctx);
  car.Render(ctx);
  endFrame(ctx);

  requestAnimationFrame(() => render(ctx));
}

requestAnimationFrame(() => render(ctx));

function startFrame(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  zoom: number
) {
  // this.center.Set(centerX, centerY);
  // this.zoom = zoom;

  // Draw World
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.save();

  // 0,0 at center of canvas, x right, y up
  ctx.translate(0.5 * ctx.canvas.width, 0.5 * ctx.canvas.height);
  ctx.scale(1, -1);
  // apply camera
  ctx.scale(zoom, zoom);
  ctx.lineWidth /= zoom;
  ctx.translate(-centerX, -centerY);
}

function endFrame(ctx: CanvasRenderingContext2D) {
  ctx.restore();
}

function resizeCanvas(canvas: HTMLCanvasElement) {
  // current screen size
  const screenWidth = Math.max(
    document.documentElement.clientWidth,
    window.innerWidth || 0
  );
  const screenHeight = Math.max(
    document.documentElement.clientHeight,
    window.innerHeight || 0
  );

  // uniform scale for our game
  const scale = Math.min(
    screenWidth / canvas.width,
    screenHeight / canvas.height
  );

  // the "uniformly englarged" size for our game
  const enlargedWidth = Math.floor(scale * canvas.width);
  const enlargedHeight = Math.floor(scale * canvas.height);

  // margins for centering our game
  const horizontalMargin = (screenWidth - enlargedWidth) / 2;
  const verticalMargin = (screenHeight - enlargedHeight) / 2;

  // now we use css trickery to set the sizes and margins
  canvas.style.width = `${enlargedWidth}px`;
  canvas.style.height = `${enlargedHeight}px`;
  canvas.style.marginLeft = canvas.style.marginRight = `${horizontalMargin}px`;
  canvas.style.marginTop = canvas.style.marginBottom = `${verticalMargin}px`;
}

resizeCanvas(canvas);
window.addEventListener("resize", () => resizeCanvas(canvas));
