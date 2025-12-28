import {
  b2Body,
  b2BodyType,
  b2PolygonShape,
  b2RevoluteJointDef,
  b2World,
  type b2BodyDef,
  type b2FixtureDef,
  type XY,
  b2RevoluteJoint,
  b2CircleShape,
} from "@box2d/core";
export class Car {
  private speed = 25;

  private body: b2Body;
  private shape: b2PolygonShape;
  private size: XY;

  private wheels: b2Body[];
  private wheelJoints: b2RevoluteJoint[];
  private wheelRadius = 0.5;

  public get position() {
    return this.body.GetPosition();
  }

  constructor(world: b2World, initialPos: XY) {
    const bodyDef: b2BodyDef = {
      type: b2BodyType.b2_dynamicBody,
      position: initialPos,
    };

    this.body = world.CreateBody(bodyDef);
    this.shape = new b2PolygonShape();
    this.size = { x: 1.5, y: 0.5 };
    this.shape.SetAsBox(this.size.x, this.size.y);

    const carFixture: b2FixtureDef = {
      shape: this.shape,
      density: 1.0,
      friction: 0.3,
    };
    this.body.CreateFixture(carFixture);

    const wheel1 = this.CreateWheel(
      world,
      initialPos.x - 1,
      initialPos.y - 0.5
    );
    const wheel2 = this.CreateWheel(
      world,
      initialPos.x + 1,
      initialPos.y - 0.5
    );

    this.wheels = [wheel1, wheel2];

    const joint1 = this.ConnectWheel(
      this.body,
      wheel1,
      { x: initialPos.x - 1, y: initialPos.y - 0.5 },
      world
    );
    const joint2 = this.ConnectWheel(
      this.body,
      wheel2,
      { x: initialPos.x + 1, y: initialPos.y - 0.5 },
      world
    );

    this.wheelJoints = [joint1, joint2];
  }

  private CreateWheel(world: b2World, x: number, y: number): b2Body {
    //[0,this.position.y],[this.position.x, this.position.y]
    const wheelDef: b2BodyDef = {
      type: b2BodyType.b2_dynamicBody,
      position: { x: x, y: y },
    };
    const wheelBody = world.CreateBody(wheelDef);
    const wheelShape = new b2CircleShape(this.wheelRadius);

    const wheelFixtureDef: b2FixtureDef = {
      shape: wheelShape,
      density: 1.0,
      friction: 1.0,
    };

    wheelBody.CreateFixture(wheelFixtureDef);
    return wheelBody;
  }

  private ConnectWheel(
    body: b2Body,
    wheel: b2Body,
    anchor: XY,
    world: b2World
  ) {
    const jointDef = new b2RevoluteJointDef();
    jointDef.Initialize(body, wheel, anchor);
    jointDef.enableMotor = true;
    jointDef.maxMotorTorque = 1000;
    jointDef.motorSpeed = 0;
    const joint = world.CreateJoint(jointDef);
    return joint;
  }

  public Move(input: number) {
    const motorSpeed = input * this.speed;

    for (const joint of this.wheelJoints) {
      joint.SetMotorSpeed(motorSpeed);
    }
  }

  public Render(ctx: CanvasRenderingContext2D) {
    // body
    ctx.save();
    const transform = this.body.GetTransform();
    ctx.translate(transform.p.x, transform.p.y);
    ctx.rotate(transform.q.GetAngle());
    ctx.beginPath();
    ctx.moveTo(this.shape.m_vertices[0].x, this.shape.m_vertices[0].y);
    for (let i = 1; i < this.shape.m_vertices.length; i++) {
      ctx.lineTo(this.shape.m_vertices[i].x, this.shape.m_vertices[i].y);
    }
    ctx.closePath();
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.strokeStyle = "white";
    ctx.stroke();
    ctx.restore();

    // wheels
    ctx.fillStyle = "black";
    ctx.strokeStyle = "white";
    for (const wheel of this.wheels) {
      ctx.beginPath();
      ctx.arc(
        wheel.GetPosition().x,
        wheel.GetPosition().y,
        this.wheelRadius,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.stroke();
    }
  }
}
