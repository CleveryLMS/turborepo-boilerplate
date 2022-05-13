import {
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';

type DeleteModalProps = {
  isOpen: any;
  label: any;
  onClose: any;
  onClick: (e?: any) => void;
};

export const DeleteModal = ({ isOpen, onClose, onClick, label }: DeleteModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered={true}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader display="flex">
          Borrar{' '}
          <Box ml="5px" textTransform="capitalize">
            {label}
          </Box>
        </ModalHeader>

        <ModalCloseButton />

        <ModalBody>¿Seguro que quieres borrarlo? Esta acción no puede deshacerse.</ModalBody>

        <ModalFooter>
          <Button colorScheme="red" mr={3} onClick={onClick}>
            Borrar
          </Button>

          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
