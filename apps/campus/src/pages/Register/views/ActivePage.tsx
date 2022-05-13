import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { BsDiscord } from 'react-icons/bs';
import {
  Button,
  Flex,
  Box,
  Text,
  Image,
  useDisclosure,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalBody,
} from '@chakra-ui/react';

import { ActiveVector } from '../components';
import { LayoutContext } from 'apps/campus/src/shared/context';

import { LogoOBFullBlack } from 'apps/campus/src/assets/logos/openbootcamp/LogoOBFullBlack';
import { LogoOMFullBlack } from 'apps/campus/src/assets/logos/openmarketers/LogoOMFullBlack';
import { LogoImaginaFullBlack } from 'apps/campus/src/assets/logos/imagina/LogoImaginaFullBlack';

export const ActivePage = () => {
  const navigate = useNavigate();

  const { isMobile } = useContext(LayoutContext);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (isMobile) onOpen();
  }, [isMobile]);

  return (
    <Flex
      p="75px"
      gap="60px"
      boxSize="100%"
      align="center"
      justify="start"
      direction="column"
    >
      {process.env.NX_ORIGEN_CAMPUS === 'OPENBOOTCAMP' ? (
        <LogoOBFullBlack />
      ) : process.env.NX_ORIGEN_CAMPUS === 'OPENMARKETERS' ? (
        <LogoOMFullBlack w="184" h="51" />
      ) : (
        <LogoImaginaFullBlack w="184" h="51" />
      )}

      <Flex
        h="100%"
        gap="60px"
        align="center"
        justify="center"
        direction="column"
      >
        <Flex
          h="100%"
          gap="28px"
          align="center"
          justify="center"
          direction="column"
        >
          <Text variant="h1_heading">¡Bienvenido a OpenBootcamp!</Text>

          <ActiveVector />

          <Text
            maxW="750px"
            color="gray_6"
            fontSize="21px"
            lineHeight="32px"
            textAlign="center"
            variant="card_title"
          >
            Gran parte del éxito de OpenBootcamp lo tiene su Comunidad. Entra y
            aprende junto a nuestro equipo y a tus nuev@s compañer@s.
          </Text>
        </Flex>

        <Flex
          w="100%"
          gap="20px"
          maxW="380px"
          align="center"
          justify="center"
          direction="column"
        >
          {process.env.NX_SHOW_DISCORD !== 'FALSE' && (
            <Box
              as="a"
              w="100%"
              target="_blank"
              rel="noreferrer"
              href="https://discord.gg/tzDGcwkn4R"
            >
              <Button
                w="100%"
                h="auto"
                p="15px"
                bg="#475AE1"
                rounded="14px"
                color="white"
                fontSize="18px"
                fontWeight="bold"
                lineHeight="22px"
                _hover={{ opacity: '0.8' }}
                rightIcon={<BsDiscord />}
              >
                Ir a Discord
              </Button>
            </Box>
          )}

          <Button
            data-cy="go_to_campus"
            w="100%"
            h="auto"
            p="15px"
            color="white"
            bg="primary"
            rounded="14px"
            fontSize="18px"
            fontWeight="bold"
            lineHeight="22px"
            _hover={{ opacity: '0.8' }}
            onClick={() => navigate('/')}
          >
            Empezar a formarme
          </Button>
        </Flex>
      </Flex>

      <RedirectToPCModal isOpen={isOpen} onClose={onClose} />
    </Flex>
  );
};

const RedirectToPCModal = ({ isOpen, onClose }: any) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>¡Estás desde el móvil!</ModalHeader>

        <ModalBody>
          La experiencia en móvil es limitada, te recomendamos usar nuestro
          campus virtual desde un ordenador de sobremesa o portátil.
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Cerrar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
