import { chakra, ChakraProps } from '@chakra-ui/react';

export const LogoOB = ({ ...props }: ChakraProps) => {
  return (
    <chakra.svg
      width="30"
      height="35"
      viewBox="0 0 30 35"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <ellipse
        cx="11.5563"
        cy="11.5375"
        rx="11.5563"
        ry="11.5375"
        fill="#0BF082"
      />

      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M23.9491 11.5371H11.5557V23.6375H11.5562V34.1596H23.9496C27.291 34.1596 29.9998 31.4508 29.9998 28.1094C29.9998 25.8553 28.7671 23.8892 26.9391 22.8482C28.7668 21.8072 29.9993 19.8412 29.9993 17.5873C29.9993 14.2459 27.2905 11.5371 23.9491 11.5371Z"
        fill="#047AF3"
      />

      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M23.1125 11.5391C23.1123 17.9109 17.9384 23.0762 11.5562 23.0762C11.556 23.0762 11.5558 23.0762 11.5557 23.0762V11.5391H23.1125Z"
        fill="#0DC0CB"
      />
    </chakra.svg>
  );
};
