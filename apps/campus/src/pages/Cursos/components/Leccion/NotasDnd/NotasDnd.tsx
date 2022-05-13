import { useCallback, useContext, useEffect, useRef, useState } from 'react';

import {
  Box,
  Button,
  Center,
  Flex,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Spinner,
  useMediaQuery,
  useToast,
} from '@chakra-ui/react';
import {
  BiX,
  BiPlus,
  BiBook,
  BiTrash,
  BiSearch,
  BiGridAlt,
  BiChevronLeft,
  BiDotsVerticalRounded,
  BiWindows,
  BiWindow,
} from 'react-icons/bi';

import { onFailure } from 'utils';
import { OpenEditor, OpenParser } from 'ui';
import { ILeccion, INota } from 'data';
import { Menu } from '../../../../../shared/components';
import { LoginContext } from '../../../../../shared/context';
import { addNota, deleteNota, getNotas, updateNota } from 'data';

import './quill.snow.css';

type Border = 'left' | 'top' | 'right' | 'bottom' | 'bottomleftCorner' | 'bottomRightCorner';

let anchor = { x: 0, y: 0 };

export const NotasDnd = ({ leccion, state }: { leccion?: ILeccion; state: { isOpen: boolean; onClose: () => void } }) => {
  const notasRef = useRef<any>();
  const { user } = useContext(LoginContext);
  const toast = useToast();

  const [useFullNotes] = useMediaQuery('(max-width: 1024px)');

  const [nota, setNota] = useState<INota>();
  const [notas, setNotas] = useState<INota[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [uploadingNota, setUploadingNota] = useState<INota>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isNewNota, setIsNewNota] = useState<boolean>(false);
  const [isMaximized, setIsMaximized] = useState<boolean>(false);

  const [x, setX] = useState<number>(window.innerWidth - 580 - 50);
  const [y, setY] = useState<number>(80);
  const [h, setH] = useState<number>(580);
  const [w, setW] = useState<number>(580);

  const handleMouseMove = useCallback((e) => move(e, anchor), []);
  const handleResizeLB = useCallback((e) => resizeLB(e, anchor), []);
  const handleResizeRB = useCallback((e) => resizeRB(e, anchor), []);
  const handleResizeL = useCallback((e) => resizeL(e, anchor), []);
  const handleResizeR = useCallback((e) => resizeR(e, anchor), []);
  const handleResizeB = useCallback((e) => resizeB(e, anchor), []);

  //si entramos desde un tamaño predefinido, siempre será full width
  useEffect(() => {
    if (useFullNotes) setIsMaximized(!isMaximized);
  }, []);

  useEffect(() => {
    setX(window.innerWidth - 580 - 50);
    setY(80);
    setH(580);
    setW(580);
  }, [state?.isOpen]);

  const move = (e: any, anchor: { x: number; y: number }) => {
    setX(Math.max(0, e.pageX - anchor.x));
    setY(Math.max(0, e.pageY - anchor.y));

    window.addEventListener('mouseup', () => window.removeEventListener('mousemove', handleMouseMove), { once: true });
  };

  /* RESIZE */
  const resizeLB = (e: any, anchor: { x: number; y: number }) => {
    if (anchor.x - e.pageX > 580 && anchor.x - e.pageX < window.innerWidth - 50) {
      setX(e.pageX);
      setW(anchor.x - e.pageX);
    }
    setH(Math.max(580, e.pageY - anchor.y));
    window.addEventListener('mouseup', () => window.removeEventListener('mousemove', handleResizeLB), { once: true });
  };

  const resizeRB = (e: any, anchor: { x: number; y: number }) => {
    setW(Math.max(580, e.pageX - anchor.x));
    setH(Math.max(580, e.pageY - anchor.y));
    window.addEventListener(
      'mouseup',
      () => {
        window.removeEventListener('mousemove', handleResizeRB);
      },
      { once: true }
    );
  };

  const resizeL = (e: any, anchor: { x: number; y: number }) => {
    if (anchor.x - e.pageX > 580) {
      setX(e.pageX);
      setW(anchor.x - e.pageX);
    }
    window.addEventListener(
      'mouseup',
      () => {
        window.removeEventListener('mousemove', handleResizeL);
      },
      { once: true }
    );
  };

  const resizeR = (e: any, anchor: { x: number; y: number }) => {
    setW(Math.max(580, e.pageX - anchor.x));
    window.addEventListener(
      'mouseup',
      () => {
        window.removeEventListener('mousemove', handleResizeR);
      },
      { once: true }
    );
  };

  const resizeB = (e: any, anchor: { x: number; y: number }) => {
    setH(Math.max(580, e.pageY - anchor.y));
    window.addEventListener(
      'mouseup',
      () => {
        window.removeEventListener('mousemove', handleResizeB);
      },
      { once: true }
    );
  };

  /* END RESIZE */

  const handleMouseDown = async (e: any) => {
    anchor = { x: e.nativeEvent.pageX - x, y: e.nativeEvent.pageY - y };
    window.addEventListener('mousemove', handleMouseMove);
  };

  const handleDoubleClick = () => {
    setW(580);
    setH(580);
  };

  const onResizeMouseDown = (border: Border) => {
    switch (border) {
      case 'bottomleftCorner':
        anchor = { x: x + w, y: y };
        window.addEventListener('mousemove', handleResizeLB);
        break;
      case 'bottomRightCorner':
        anchor = { x: x, y: y };
        window.addEventListener('mousemove', handleResizeRB);
        break;
      case 'left':
        anchor = { x: x + w, y: y };
        window.addEventListener('mousemove', handleResizeL);
        break;
      case 'right':
        anchor = { x: x, y: y };
        window.addEventListener('mousemove', handleResizeR);
        break;
      case 'bottom':
        anchor = { x: x, y: y };
        window.addEventListener('mousemove', handleResizeB);
        break;
    }
  };

  useEffect(() => {
    refreshStateNotas();
  }, [leccion]);

  const refreshStateNotas = async () => {
    if (!leccion?.id) return;

    const notasData = await getNotas({
      query: [{ user_id: user?.id }, { leccion_id: leccion?.id }, { sort_by: 'updatedAt' }, { order: 'desc' }],
    });
    await setNotas(notasData?.data || []);
    await setUploadingNota(undefined);
  };

  const onDeleteNota = async (nota?: INota) => {
    if (!nota?.id) return;

    await setUploadingNota(nota);
    await deleteNota({ id: nota.id }).then(() => refreshStateNotas());
    await setUploadingNota(undefined);
  };

  const guardarNota = (nota: INota) => {
    setUploadingNota(nota);

    if (isNewNota) {
      addNota({
        nota: {
          leccionId: nota.leccionId,
          titulo: nota.titulo,
          contenido: nota.contenido,
        },
      })
        .then(() => refreshStateNotas())
        .catch((e) => onFailure(toast, 'Error', 'No se ha podido crear la nota. Inténtalo de nuevo más tarde.'));
    } else if (nota?.id) {
      updateNota({ id: nota.id, nota })
        .then(() => refreshStateNotas())
        .catch((e) => onFailure(toast, 'Error', 'No se ha podido actualizar la nota. Inténtalo de nuevo más tarde.'));
    } else {
      onFailure(toast, 'Error inesperado', 'Por favor, actualize la página y contacte con soporte si el error persiste.');
      return;
    }

    setIsOpen(false);
  };

  const crearNota = async () => {
    if (!leccion?.id) {
      onFailure(toast, 'Error inesperado', 'Por favor, actualize la página y contacte con soporte si el error persiste.');
      return;
    }

    await setIsNewNota(true);
    await setNota({
      titulo: 'Nueva nota',
      contenido: ' ',
      leccionId: leccion?.id,
    });
    await setIsOpen(true);
  };

  const editarNota = async (nota: INota) => {
    await setIsNewNota(false);
    await setNota(nota);
    await setIsOpen(true);
  };

  return (
    <Flex
      ref={notasRef}
      h={isMaximized ? '100%' : h}
      w={isMaximized ? '100%' : w}
      minH="580px"
      bg="white"
      rounded={isMaximized ? '0px' : '20px'}
      top={`${isMaximized ? 0 : y}px`}
      left={`${isMaximized ? 0 : x}px`}
      position="fixed"
      direction="column"
      display={state.isOpen ? 'flex' : 'none'}
      boxShadow="0px 4px 29px rgba(0, 0, 0, 0.25)"
      zIndex="100"
    >
      <Flex
        w="100%"
        bg="black"
        gap="16px"
        p="12px 20px"
        color="white"
        align="center"
        cursor={isMaximized ? 'default' : 'pointer'}
        roundedTop={isMaximized ? '0px' : '20px'}
        onMouseDown={isMaximized ? () => {} : handleMouseDown}
        onDoubleClick={handleDoubleClick}
      >
        <Icon as={BiGridAlt} boxSize="24px" />

        <Box fontSize="14px" fontWeight="bold" lineHeight="17px">
          Notas
        </Box>

        <Flex align="center" ml="auto">
          <Icon
            cursor="pointer"
            as={isMaximized ? BiWindows : BiWindow}
            color="gray_4"
            boxSize="26px"
            onClick={() => setIsMaximized(!isMaximized)}
          />

          <Icon cursor="pointer" data-cy="button_close_notas" as={BiX} color="gray_4" boxSize="32px" onClick={state.onClose} />
        </Flex>
      </Flex>

      {!isOpen && (
        <>
          <Flex align="center" h="70px" p="15px">
            <InputGroup p="0px">
              <InputLeftElement children={<Icon as={BiSearch} color="gray_4" boxSize="24px" />} />

              <Input
                border="none"
                value={searchQuery}
                placeholder="Buscar notas"
                _focus={{ border: 'none' }}
                onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
                _placeholder={{
                  color: 'gray_4',
                  fontWeight: 'bold',
                  fontSize: '14px',
                }}
              />

              <InputRightElement
                children={
                  <Icon
                    as={BiPlus}
                    data-cy="crear_nota_button"
                    color="gray_4"
                    cursor="pointer"
                    boxSize="28px"
                    onClick={() => crearNota()}
                  />
                }
              />
            </InputGroup>
          </Flex>

          <Box w="100%" h="1px" bg="gray_3" />
        </>
      )}

      <Flex overflowY="scroll" direction="column">
        {!isOpen &&
          notas?.length > 0 &&
          notas
            ?.filter(
              (n: INota) => n.contenido.toLowerCase().includes(searchQuery) || n.titulo.toLowerCase().includes(searchQuery)
            )
            ?.map((nota: INota, i) => (
              <Flex
                key={`nota-${i}`}
                _hover={{ filter: 'brightness(80%)' }}
                cursor="pointer"
                bg="white"
                position="relative"
                data-cy="nota_container"
                mx="30px"
                pb="10px"
                my="10px"
                direction="column"
                borderBottom="solid 1px #E6E6EA;"
                onClick={() => editarNota(nota)}
              >
                <Flex justify="space-between">
                  <Flex gap="10px" align="center" color="gray_4" fontSize="13px">
                    <Icon as={BiBook} boxSize="17px" />

                    <Box>
                      Módulo {leccion?.modulo?.orden} / Lección {leccion?.orden}
                    </Box>
                  </Flex>

                  <Menu
                    icon={BiDotsVerticalRounded}
                    items={[
                      {
                        icon: BiTrash,
                        label: 'Borrar',
                        onClick: () => onDeleteNota(nota),
                      },
                    ]}
                  />
                </Flex>

                <Box fontSize="14px" fontWeight="bold" data-cy={`nota_titulo_${i}`}>
                  {nota.titulo}
                </Box>

                <Box fontSize="14px" data-cy={`nota_contenido_${i}`}>
                  <OpenParser value={nota.contenido} />
                </Box>

                {uploadingNota?.id === nota.id && (
                  <Center boxSize="100%" position="absolute" style={{ backdropFilter: 'blur(2px)' }}>
                    <Spinner />
                  </Center>
                )}
              </Flex>
            ))}

        {isOpen && (
          <NotasEditor
            nota={nota}
            onClose={() => setIsOpen(false)}
            onSave={(n) => guardarNota(n)}
            title={`${leccion?.modulo?.titulo} ${leccion?.titulo}`}
          />
        )}
      </Flex>

      {!isMaximized && (
        <>
          <Box
            w="20px"
            top="-10px"
            left="-10px"
            bottom="-10px"
            cursor="ew-resize"
            position="absolute"
            onMouseDown={() => onResizeMouseDown('left')}
          />

          <Box
            w="20px"
            top="-10px"
            right="-10px"
            bottom="-10px"
            cursor="ew-resize"
            position="absolute"
            onMouseDown={() => onResizeMouseDown('right')}
          />

          <Box
            h="20px"
            left="-10px"
            right="-10px"
            bottom="-10px"
            cursor="ns-resize"
            position="absolute"
            onMouseDown={() => onResizeMouseDown('bottom')}
          />

          <Box
            left="-10px"
            bottom="-10px"
            boxSize="30px"
            position="absolute"
            cursor="nesw-resize"
            onMouseDown={() => onResizeMouseDown('bottomleftCorner')}
          />

          <Box
            right="-10px"
            bottom="-10px"
            boxSize="30px"
            position="absolute"
            cursor="nwse-resize"
            onMouseDown={() => onResizeMouseDown('bottomRightCorner')}
          />
        </>
      )}
    </Flex>
  );
};

const NotasEditor = ({
  nota,
  title,
  onSave,
  onClose,
}: {
  nota?: INota;
  title: string;
  onClose: () => void;
  onSave: (nota: any) => void;
}) => {
  const quillRef = useRef<any>(null);

  useEffect(() => {
    quillRef?.current?.getEditor().focus();
  }, []);

  const [titulo, setTitulo] = useState(nota?.titulo || '');
  const [contenido, setContenido] = useState(nota?.contenido || '');

  useEffect(() => {
    setTitulo(nota?.titulo || '');
    setContenido(nota?.contenido || '');
  }, [nota]);

  return (
    <Flex direction="column" m="2px" h="100%" minH="500px">
      <Button w="100px" background="transparent" onClick={onClose} leftIcon={<Icon w="25px" h="25px" as={BiChevronLeft} />}>
        Volver
      </Button>

      <Flex direction="column">
        <Input
          m="0px"
          border="none"
          fontSize="21px"
          fontWeight="bold"
          background="transparent"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />

        <Flex mt="5px" color="gray_4" align="center">
          <Icon ml="16px" mr="10px" as={BiBook} />

          <Box fontSize="15px">{title}</Box>
        </Flex>

        <Flex p="10px">
          <OpenEditor value={contenido} onChange={setContenido} placeholder="Escribe tu nota" />
        </Flex>

        <Button
          onClick={() =>
            onSave({
              id: nota?.id,
              leccionId: nota?.leccionId,
              titulo: titulo,
              contenido: contenido,
            })
          }
          color="white"
          mx="10px"
          data-cy="guardar_nota_button"
          mt="70px"
          bg="primary"
        >
          Guardar
        </Button>
      </Flex>
    </Flex>
  );
};
