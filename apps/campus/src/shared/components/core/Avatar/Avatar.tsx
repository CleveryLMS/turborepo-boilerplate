import stc from 'string-to-color';
import { Center, Image } from '@chakra-ui/react';

type AvatarProps = {
  src?: string;
  name?: string;
  size?: string;
  rounded?: string;
  bgColor?: string;
  fontSize?: string;
};

export const Avatar = ({
  src,
  name = 'NA',
  size,
  fontSize = '15px',
  rounded = '50%',
  bgColor = 'primary',
}: AvatarProps) => {
  return src ? (
    <Image
      src={src}
      alt={name}
      fit="cover"
      minW={size}
      minH={size}
      boxSize={size}
      rounded={rounded}
      bgColor={stc(name || 'Lorem Ipsum')}
    />
  ) : (
    <Center
      minW={size}
      minH={size}
      bg={bgColor}
      color="#fff"
      boxSize={size}
      lineHeight="20px"
      fontWeight="bold"
      rounded={rounded}
      fontSize={fontSize}
      textTransform="uppercase"
    >
      {name}
    </Center>
  );
};
