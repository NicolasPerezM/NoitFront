"use client"

import { useCallback } from "react"
import {Particles} from "react-tsparticles"
import type { Engine } from "tsparticles-engine"
import { loadSlim } from "tsparticles-slim"

export default function ParticlesBackground() {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine)
  }, [])

  return (
    <div className="h-full w-full bg-black">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          fullScreen: { enable: false },
          background: { color: { value: "#2f2f2f" } },
          fpsLimit: 120,
          detectRetina: true,
          particles: {
            color: { value: "#E15D12" },
            links: {
              color: "#ffffff",
              distance: 180,
              enable: true,
              opacity: 0.5,
              width: 1,
            },
            collisions: { enable: true },
            move: {
              direction: "none",
              enable: true,
              outModes: { default: "bounce" },
              random: false,
              speed: 1,
              straight: false,
            },
            number: {
              density: { enable: true, area: 800 },
              value: 80,
            },
            opacity: { value: 0.5 },
            shape: { type: "circle" },
            size: { value: { min: 1, max: 5 } },
          },
          interactivity: {
            events: {
              onHover: { enable: true, mode: "grab" },
              onClick: { enable: true, mode: "push" },
              resize: true,
            },
            modes: {
              grab: { distance: 140, links: { opacity: 1 } },
              push: { quantity: 4 },
              repulse: { distance: 200, duration: 0.4 },
            },
          },
        }}
        className="h-full w-full"
      />
    </div>
  )
}


