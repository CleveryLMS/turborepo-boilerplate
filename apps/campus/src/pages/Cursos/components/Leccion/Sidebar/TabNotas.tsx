import { useState, useEffect, useRef } from 'react';

import ReactQuill from 'react-quill';
import { BiBook, BiChevronLeft, BiPlus, BiSearch } from 'react-icons/bi';
import { Flex, Icon, Box, Input, Button, InputGroup, IconButton } from '@chakra-ui/react';

import { ILeccion, IModulo, INota } from 'data';
import { getNotas, addNota, deleteNota, updateNota } from 'data';
import { GlobalCard, GlobalCardType } from '../../../../../shared/components';

import './quill.snow.css';

const TabNotas = ({
  userId,
  modulo,
  leccion,
  setIsKeyboardDisabled,
}: {
  userId?: number;
  modulo?: IModulo;
  leccion?: ILeccion;
  setIsKeyboardDisabled?: any;
}) => {
  const [nota, setNota] = useState<INota>();
  const [notas, setNotas] = useState<INota[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [uploadingNota, setUploadingNota] = useState<INota>();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    refreshStateNotas();
  }, [leccion]);

  useEffect(() => {
    setIsKeyboardDisabled(nota !== undefined);
  }, [nota]);

  const refreshStateNotas = async () => {
    if (!leccion?.id) return;

    const notasData = await getNotas({
      query: [{ user_id: userId }, { leccion_id: leccion?.id }, { sort_by: 'updatedAt' }, { order: 'desc' }],
    });

    setNotas(notasData?.data || []);
  };

  const onNewNota = async () => {
    return new Promise((resolve, reject) => {
      if (!leccion?.id) return;

      addNota({
        nota: { leccionId: leccion?.id, titulo: 'Nueva nota', contenido: ' ' },
      }).then((res) => {
        refreshStateNotas();
        resolve(res?.value?.data);
      });
    });
  };

  const onDeleteNota = async (id?: number) => {
    if (!id) return;

    await deleteNota({ id }).then(() => refreshStateNotas());
  };

  const onEditNota = async (nota?: INota) => {
    if (!nota?.id) return Promise.reject('No hay ID de nota');

    return await updateNota({ id: nota.id, nota }).then((res: any) => refreshStateNotas());
  };

  const onNotaUpdate = (e: any) => {
    if (nota) setNota({ ...nota, ...e });
  };

  const handleVolver = async () => {
    setIsOpen(false);

    setUploadingNota(nota);
    setNota(undefined);

    await onEditNota(nota);
    setUploadingNota(undefined);
  };

  const handleNewNota = async () => {
    const _nota: any = await onNewNota();
    setNota(_nota);

    setIsOpen(true);
  };

  return (
    <Flex direction="column" gridRowGap="10px" overflow="auto">
      {!isOpen && (
        <Flex rounded="12px" cursor="pointer" gridColumnGap="10px" mb="20px">
          <InputGroup bg="gray_3" h="42px" rounded="12px" w="100%">
            <Icon cursor="default" bg="transparent" border="none" boxSize="42px" p="10px" as={BiSearch} />

            <Input
              p="0px"
              border="none"
              placeholder="Buscar..."
              _focus={{ outline: 'none' }}
              onChange={(e) => {
                e.stopPropagation();
                setSearchQuery(e.target.value.toUpperCase());
              }}
            />
          </InputGroup>

          <IconButton
            h="42px"
            w="42px"
            bg="gray_3"
            rounded="12px"
            aria-label="Borrar nota"
            icon={<Icon boxSize="20px" color="gray_4" as={BiPlus} />}
            onClick={handleNewNota}
          />
        </Flex>
      )}

      {!isOpen &&
        notas?.length > 0 &&
        notas
          ?.filter(
            (n: INota) => n.contenido.toUpperCase().includes(searchQuery) || n.titulo.toUpperCase().includes(searchQuery)
          )
          ?.map((nota: INota) => (
            <GlobalCard
              maxPerRow={1}
              gapBetween="12px"
              type={GlobalCardType.NOTA}
              props={{
                nota: nota,
                onEdit: (nota: any) => {
                  setNota(nota);
                  setIsOpen(true);
                },
                key: 'nota-item-' + nota.id,
                onDelete: () => onDeleteNota(nota?.id),
                isLoading: nota.id === uploadingNota?.id,
                title: modulo?.titulo + '/' + leccion?.titulo,
              }}
            />
          ))}

      {isOpen && (
        <NotasEditor
          nota={nota}
          onClose={handleVolver}
          onNotaUpdate={onNotaUpdate}
          title={`${modulo?.titulo} / ${leccion?.titulo}`}
        />
      )}
    </Flex>
  );
};

export default TabNotas;

const NotasEditor = ({
  nota,
  title,
  onClose,
  onNotaUpdate,
}: {
  nota?: INota;
  title: string;
  onClose: () => void;
  onNotaUpdate: (nota: any) => void;
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

  const onSave = () => {
    onNotaUpdate({ titulo: titulo, contenido: contenido });
    onClose();
  };

  return (
    <Flex direction="column" m="2px" h="100%" minH="500px">
      <Button w="100px" background="transparent" onClick={onClose} leftIcon={<Icon w="25px" h="25px" as={BiChevronLeft} />}>
        Volver
      </Button>

      <Flex mt="40px" direction="column">
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

        <Box h="20px" />

        <ReactQuill ref={quillRef} theme="snow" value={contenido} onChange={setContenido} />
      </Flex>

      <Button
        bg="primary"
        color="white"
        w="fit-content"
        isDisabled={!contenido}
        title={!contenido ? '¡Escribe algo para guardar!' : ''}
        onClick={onSave}
      >
        Guardar
      </Button>
    </Flex>
  );
};
