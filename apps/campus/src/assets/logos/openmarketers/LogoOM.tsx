import { chakra, ChakraProps } from '@chakra-ui/react';

export const LogoOM = ({ ...props }: ChakraProps) => (
  <chakra.svg
    width="180"
    height="180"
    viewBox="0 0 180 180"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#clip0_815_5488)">
      <path
        d="M65.4545 63.709L122.727 107.332L180 63.709V178.22H65.4545V63.709Z"
        fill="#F54A87"
      />

      <ellipse
        cx="65.4547"
        cy="66.4349"
        rx="65.4547"
        ry="65.4349"
        fill="#0BF082"
      />

      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M65.4558 131.869V63.7083L118.811 104.348C106.946 121.005 87.4703 131.869 65.4564 131.869C65.4562 131.869 65.456 131.869 65.4558 131.869Z"
        fill="#D0385C"
      />
    </g>

    <defs>
      <clipPath id="clip0_815_5488">
        <rect width="180" height="180" fill="white" />
      </clipPath>
    </defs>
  </chakra.svg>
);
