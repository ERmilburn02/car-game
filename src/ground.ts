import {
  b2World,
  type b2BodyDef,
  b2PolygonShape,
  type b2FixtureDef,
  type XY,
  b2Body,
} from "@box2d/core";

export class Ground {
  private size: XY;
  private groundBody: b2Body;
  constructor(world: b2World) {
    this.size = { x: 50, y: 1 };

    const groundBodyDef: b2BodyDef = {
      position: { x: 0, y: -16 },
    };
    this.groundBody = world.CreateBody(groundBodyDef);
    const groundShape = new b2PolygonShape();
    groundShape.SetAsBox(this.size.x, this.size.y);
    const groundFixtureDef: b2FixtureDef = {
      shape: groundShape,
    };

    this.groundBody.CreateFixture(groundFixtureDef);
  }

  public Render(ctx: CanvasRenderingContext2D) {
    const position = this.groundBody.GetPosition();
    ctx.fillRect(
      position.x - this.size.x,
      position.y - this.size.y,
      this.size.x * 2,
      this.size.y * 2
    );
  }
}
