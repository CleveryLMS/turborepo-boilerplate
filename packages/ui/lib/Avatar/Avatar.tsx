import { Center, Image } from '@chakra-ui/react';

import stc from 'string-to-color';
import { isColorBright } from 'utils';

import './Avatar.module.scss';

interface AvatarProps {
  // Image for avatar
  src?: string;
  // Name for fallback
  name: string;
  // Size
  size?: string;
  // Size for fallback
  fontSize?: string;
  // Have border?
  outline?: boolean;
}

/**
 * Primary UI component for user interaction
 */
export const Avatar = ({ src, name, size, fontSize, outline, ...props }: AvatarProps) => {
  let bg = stc(name);
  return src ? (
    <Image fit="cover" minW={size} minH={size} h={size} w={size} rounded="150px" alt={name} src={src} {...props} />
  ) : (
    <Center
      color={isColorBright(bg) ? 'black' : 'white'}
      bg={bg}
      lineHeight="20px"
      fontWeight="bold"
      w={size}
      h={size}
      minW={size}
      minH={size}
      rounded="50%"
      fontSize={fontSize || '15px'}
      textTransform="uppercase"
      border={outline ? '2px solid var(--chakra-colors-gray_2)' : ''}
      {...props}
    >
      {name}
    </Center>
  );
};
