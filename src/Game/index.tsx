import { Bodies, Engine, Render, Runner, World } from "matter-js";
import { useEffect, useRef } from "react";

const width = 620
const height = 850

const Game = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef(Engine.create());

  useEffect(() => {
    const render = Render.create({
      engine: engineRef.current,
      canvas: canvasRef.current!,
      optinos: {
        wireframes: true,
        background: "#F7F4C8",
        width,
        height,
      },
    });

    render.canvas.width = width
    render.canvas.height = height

    const world = engineRef.current.world;

    const leftWall = Bodies.rectangle(15, 395, 30, 790, {
      isStatic: true,
      render: {fillStyle: "#E6B143"}
    })

    const rightWall = Bodies.rectangle(605, 395, 30, 790, {
      isStatic: true,
      render: {fillStyle: "#E6B143"}
    })

    const ground = Bodies.rectangle(310, 820, 620, 60, {
      isStatic: true,
      render: {fillStyle: "#E6B143"}
    })

    const topLine = Bodies.rectangle(310, 150, 620, 2, {
      name: "topLine",
      isStatic: true,
      isSeonsor: true,
    })

    World.add(world, [
      leftWall,
      rightWall,
      ground,
      topLine
    ])

    Render.run(render);
    Runner.run(engineRef.current);
    return () => {
      Render.stop(render);
      render.canvas.remove();
      render.canvas = null;
      render.context = null;
      render.texture = {};
    };
  }, []);

  return <canvas ref={canvasRef} style={{width, height}} />;
};

export default Game;
