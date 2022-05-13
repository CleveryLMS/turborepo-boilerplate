import { Progress } from '@chakra-ui/react';

export const CourseProgress = ({ value }: { value?: number }) => {
  return (
    <Progress
      value={value ? 100 : 0}
      w="100%"
      sx={{
        '& > div': {
          background: `linear-gradient(90deg, #0BF082 0%, #0BF082 ${value + '%'}, rgba(62, 68, 97, 0.6) ${
            100 - (value || 0) + '%'
          }, rgba(62, 68, 97, 0.6) 100%)`,
        },
      }}
    />
  );
};
