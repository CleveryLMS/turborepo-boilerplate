import React from 'react';
import Particles from 'react-tsparticles';

export const Confetti = () => {
  return (
    <Particles
      id="tsparticles"
      options={{
        fpsLimit: 120,
        interactivity: {
          events: {
            resize: true,
          },

          modes: {
            bubble: {
              distance: 400,
              duration: 2,
              opacity: 0.8,
              size: 40,
            },
            push: {
              quantity: 4,
            },
            repulse: {
              distance: 200,
              duration: 0.4,
            },
          },
        },

        particles: {
          color: {
            value: ['#C93548', '#F6C34D', '#2C50CC', '#45ACB2'],
            animation: {
              enable: false,
              speed: 30,
            },
          },

          move: {
            direction: 'bottom',
            enable: true,
            outModes: {
              default: 'out',
            },
            size: true,
            speed: {
              min: 1,
              max: 3,
            },
          },
          number: {
            value: 200,
            density: {
              enable: true,
              area: 800,
            },
          },
          opacity: {
            value: 1,
            animation: {
              enable: false,
              startValue: 'max',
              destroy: 'min',
              speed: 100,
              sync: true,
            },
          },
          rotate: {
            value: {
              min: 0,
              max: 360,
            },
            direction: 'random',
            animation: {
              enable: true,
              speed: 60,
            },
          },
          tilt: {
            direction: 'random',
            enable: true,
            value: {
              min: 0,
              max: 360,
            },
            animation: {
              enable: true,
              speed: 60,
            },
          },
          shape: {
            type: ['square'],
          },
          size: {
            value: {
              min: 3,
              max: 5,
            },
          },
        },
        detectRetina: true,
        roll: {
          darken: {
            enable: true,
            value: 30,
          },
          enlighten: {
            enable: true,
            value: 30,
          },
          enable: true,
          speed: {
            min: 15,
            max: 25,
          },
        },
        wobble: {
          distance: 30,
          enable: true,
          move: true,
          speed: {
            min: -15,
            max: 15,
          },
        },
      }}
    />
  );
};
