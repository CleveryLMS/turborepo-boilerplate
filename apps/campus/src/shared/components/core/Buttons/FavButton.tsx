import Icon, { IconProps } from '@chakra-ui/icon';
import { Box, BoxProps, Flex } from '@chakra-ui/layout';
import { BiStar } from 'react-icons/bi';
import star from '../../../../assets/UI/FavButton/star.svg';

export interface FavButtonProps extends BoxProps {
  isFavved?: boolean;
  onClick?: (arg: any) => any;
}

export const FavButton = ({ isFavved, onClick, ...props }: FavButtonProps) => {
  return isFavved ? (
    <Box onClick={onClick} bgImg={star} bgSize="cover" color="#EFC55B" {...props} />
  ) : (
    <Flex align="center" justify="center" {...props} onClick={onClick}>
      <Icon as={BiStar} _hover={{ color: '#EFC55B', cursor: 'pointer' }} fontSize="22px" bgSize="cover" color="gray_4" />
    </Flex>
  );
};
