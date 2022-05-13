import { Flex, Box, Icon, Spinner } from '@chakra-ui/react';

import { BiBook, BiDotsVerticalRounded, BiPencil, BiTrash } from 'react-icons/bi';

import { Menu } from '../../../core';
import { INota } from 'data';

import './CardNota.scss';
import 'react-quill/dist/quill.bubble.css';
import { OpenParser } from 'ui';

export type CardNotaProps = {
  nota: INota;
  title?: string;
  isLoading?: boolean;
  onDelete: () => void;
  onEdit: (nota: INota) => any;
};

export const CardNota = ({ nota, onDelete, onEdit, title, isLoading }: CardNotaProps) => {
  return (
    <Flex border="none" pos="relative" p="0px" className="card-nota" overflow="hidden" w="100%">
      {isLoading && (
        <Flex
          cursor="not-allowed"
          zIndex="4"
          style={{ backdropFilter: 'blur(2px)' }}
          pos="absolute"
          boxSize="100%"
          bg="blackAlpha.500"
          justify="center"
          align="center"
        >
          <Spinner color="white" thickness="3px" />
        </Flex>
      )}
      <Flex className="card-nota" maxH="250px" overflow="hidden" cursor="pointer" onClick={() => onEdit(nota)}>
        <Flex align="center" justify="space-between">
          <Flex direction="column">
            <Box fontSize="px" fontWeight="bold">
              <OpenParser value={nota.titulo} />
            </Box>

            <Flex align="center" color="gray_4" mb="10px">
              <Icon mr="10px" as={BiBook} />

              <Box fontSize="14px">{title}</Box>
            </Flex>
          </Flex>

          <Menu
            icon={BiDotsVerticalRounded}
            items={[
              { icon: BiPencil, label: 'Editar', onClick: () => onEdit(nota) },
              { icon: BiTrash, label: 'Borrar', onClick: onDelete },
            ]}
          />
        </Flex>
        <OpenParser value={nota.contenido} />
      </Flex>
    </Flex>
  );
};
