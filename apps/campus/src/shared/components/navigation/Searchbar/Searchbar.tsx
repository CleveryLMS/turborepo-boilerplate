import { BiSearchAlt } from 'react-icons/bi';
import {
  Text,
  Button,
  Icon,
  useDisclosure,
  IconButton,
} from '@chakra-ui/react';

import { SearchbarModal } from './SearchbarModal';
import { useContext } from 'react';
import { LayoutContext } from '../../../context';

export const Searchbar = () => {
  const { isMobile } = useContext(LayoutContext);
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {isMobile ? (
        <IconButton
          onClick={onOpen}
          aria-label="Barra de búsqueda"
          icon={<Icon as={BiSearchAlt} color="gray_4" boxSize="20px" />}
          bg="transparent"
          _hover={{ opacity: 0.8 }}
        />
      ) : (
        <Button
          w="161px"
          bg="gray_2"
          rounded="48px"
          border="gray_3"
          onClick={onOpen}
          p="12px"
          leftIcon={<Icon as={BiSearchAlt} color="gray_4" />}
          style={{ justifyContent: 'flex-start' }}
        >
          <Text variant="button_medium" fontSize="16px" color="gray_4">
            Buscar
          </Text>
        </Button>
      )}

      <SearchbarModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};
