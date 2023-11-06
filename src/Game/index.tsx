import { Bodies, Body, Engine, Events, Render, Runner, World } from "matter-js";
import { useEffect, useRef } from "react";
import { FRUITS, TFRUITS } from "../fruits";

const width = 620
const height = 850

const Game = ({setScore} : {setScore:React.Dispatch<React.SetStateAction<number>>}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef(Engine.create());

  useEffect(() => {
    let currentBody: Body;
    let currentFruit: TFRUITS = { radius: 0, name: '', score: 0 };
    let disableAction = false;
    let interval:number | undefined = undefined;

    const render = Render.create({
      engine: engineRef.current,
      canvas: canvasRef.current!,
      options: {
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
      render: { fillStyle: "#E6B143" }
    })

    const rightWall = Bodies.rectangle(605, 395, 30, 790, {
      isStatic: true,
      render: { fillStyle: "#E6B143" }
    })

    const ground = Bodies.rectangle(310, 820, 620, 60, {
      isStatic: true,
      render: { fillStyle: "#E6B143" }
    })

    const topLine = Bodies.rectangle(310, 150, 620, 2, {
      isStatic: true,
      isSensor: true,
      render: { fillStyle: "#E6B143" },
      label: 'topLine'
    })


    World.add(world, [
      leftWall,
      rightWall,
      ground,
      topLine
    ])

    Render.run(render);
    Runner.run(engineRef.current);

    const addFruit = () => {
      const index = Math.floor(Math.random() * 5);
      const fruit = FRUITS[index]

      const body = Bodies.circle(300, 50, fruit.radius, {
        label: index.toString(),
        isSleeping: true,
        render: {
          sprite: {
            texture: `/fruits/${fruit.name}.png`,
            xScale: 1,
            yScale: 1
          }
        },
        restitution: 0.2
      })

      currentBody = body;
      currentFruit = fruit;

      World.add(world, body)
    }

    window.onkeydown = (event) => {
      if (disableAction) return;
      switch (event.code) {
        case 'KeyA':
          if (interval) {
            return;
          }
          interval = setInterval(() => {
            if (currentBody.position.x - currentFruit.radius > 40) {
              Body.setPosition(currentBody, {
                x: currentBody.position.x - 1,
                y: currentBody.position.y,
              })
            }
          },5)
          break;
        case 'KeyD':
          if (interval) {
            return;
          }
          interval = setInterval(() => {
            if (currentBody.position.x + currentFruit.radius < 580) {
              Body.setPosition(currentBody, {
                x: currentBody.position.x + 1,
                y: currentBody.position.y,
              })
            }
          },5)
          break;
        case 'KeyS':
          disableAction = true;
          currentBody.isSleeping = false;

          setTimeout(() => {
            addFruit();
            disableAction = false;
          }, 1000)
          break;
      }
    }

    window.onkeyup = (event) => {
      switch (event.code){
        case 'KeyA':
        case 'KeyD':
          clearInterval(interval);
          interval = undefined;
          break;
      }
    }

    Events.on(engineRef.current, "collisionStart", (event) => {
      event.pairs.forEach((collision) => {
        if (collision.bodyA.label === collision.bodyB.label) {
          const index = parseInt(collision.bodyA.label);
          if (index === FRUITS.length - 1) {
            return
          }

          World.remove(world, [collision.bodyA, collision.bodyB]);

          const newFruit = FRUITS[index + 1];

          const newBody = Bodies.circle(
            collision.collision.supports[0].x,
            collision.collision.supports[0].y,
            newFruit.radius,
            {
              render: {
                sprite: {
                  texture: `/fruits/${newFruit.name}.png`,
                  xScale: 1,
                  yScale: 1
                }
              },
            }
          )
          setScore((prev) => prev + newFruit.score);
          World.add(world, newBody);
        }
        if (
          !disableAction &&
          (collision.bodyA.label === 'topLine' || collision.bodyB.label === 'topLine')) {
          alert('GAME OVER')
        }
      })
    })

    addFruit();

    return () => {
      // Render.stop(render);
      // render.canvas.remove();
      // render.textures = {};
    };
  }, []);

  return <canvas ref={canvasRef} style={{ width, height }} />;
};

export default Game;
