import { Progress } from '@chakra-ui/react';

export const ExamenProgress = ({ value = 0, style }: { value?: number; style?: React.CSSProperties }) => {
  return (
    <Progress
      value={value ? 100 : 0}
      w="100%"
      rounded="10px"
      style={style}
      sx={{
        '& > div': {
          background: `linear-gradient(90deg, var(--chakra-colors-primary) 0%, var(--chakra-colors-primary) ${
            value + '%'
          }, var(--chakra-colors-gray_3) ${value + '%'}, var(--chakra-colors-gray_3) 100%)`,
        },
      }}
    />
  );
};
