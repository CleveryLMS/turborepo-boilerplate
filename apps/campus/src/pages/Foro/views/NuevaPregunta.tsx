import { useContext, useRef, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Box, Button, Flex, Input, Select } from '@chakra-ui/react';

import { OpenEditor } from 'ui';
import { LoginContext } from '../../../shared/context';
import { PreguntaTipoEnum, addForoPregunta, useForoTema } from 'data';

const NuevaPregunta = () => {
  const navigate = useNavigate();

  const inputRef = useRef<any>();

  const { temaId } = useParams<any>();
  const { user } = useContext(LoginContext);
  const { data: tema } = useForoTema({ id: +(temaId || 0) });

  const [titulo, setTitulo] = useState<string>('');
  const [contenido, setContenido] = useState<string>('');
  const [tipo, setTipo] = useState<PreguntaTipoEnum>(PreguntaTipoEnum.AYUDA);

  useEffect(() => {
    if (inputRef.current) setTimeout(() => inputRef.current.focus(), 0);
  }, []);

  const subirPregunta = () => {
    if (!temaId || !user?.id) return;

    addForoPregunta({
      pregunta: {
        temaId: +temaId,
        tipo: tipo,
        titulo: titulo,
        contenido: contenido,
        userId: user?.id,
        fijado: false,
      },
    }).then((data) => {
      navigate(`/foro/${temaId}/${data.value?.id}`);
    });
  };

  return (
    <Flex gap="24px" boxSize="100%" direction="column" p={{ base: '18px', md: '34px' }}>
      <Box w="100%" fontSize="24px" fontWeight="bold" lineHeight="29px">
        Escribe tu pregunta sobre {tema?.titulo}
      </Box>

      <Box h="1px" bg="gray_3" />

      <Flex w="100%" gap="24px" direction="column" p={{ base: '18px', md: '34px' }}>
        <Flex
          gap={{ base: '10px', sm: '40px' }}
          align={{ base: 'start', sm: 'center' }}
          direction={{ base: 'column', sm: 'row' }}
        >
          <Box minW="150px" textAlign={{ base: 'start', sm: 'end' }}>
            Tema
          </Box>

          <Select data-cy="select_tema" isDisabled value={tema?.id} bg="white" border="1px solid var(--chakra-colors-gray_3)">
            <option value={tema?.id} data-cy={`${tema?.id}_select_tema`}>
              {tema?.titulo}
            </option>
          </Select>
        </Flex>

        <Flex
          gap={{ base: '10px', sm: '40px' }}
          align={{ base: 'start', sm: 'center' }}
          direction={{ base: 'column', sm: 'row' }}
        >
          <Box minW="150px" textAlign={{ base: 'start', sm: 'end' }}>
            Título pregunta
          </Box>

          <Input
            data-cy="titulo_pregunta_input"
            ref={inputRef}
            bg="white"
            value={titulo}
            border="1px solid var(--chakra-colors-gray_3)"
            onChange={(e: any) => setTitulo(e.target.value)}
          />
        </Flex>

        <Flex
          gap={{ base: '10px', sm: '40px' }}
          align={{ base: 'start', sm: 'center' }}
          direction={{ base: 'column', sm: 'row' }}
        >
          <Box minW="150px" textAlign={{ base: 'start', sm: 'end' }}>
            Categoría
          </Box>

          <Select
            bg="white"
            value={tipo}
            data-cy="categoria_pregunta_select"
            border="1px solid var(--chakra-colors-gray_3)"
            onChange={(e) => {
              const res: any = e.target.value;
              setTipo(res);
            }}
          >
            {Object.values(PreguntaTipoEnum).map((value) => (
              <option value={value} style={{ textTransform: 'capitalize' }}>
                {value?.replaceAll('_', ' ')}
              </option>
            ))}
          </Select>
        </Flex>

        <Flex
          h="100%"
          gap={{ base: '10px', sm: '40px' }}
          align={{ base: 'start', sm: 'center' }}
          direction={{ base: 'column', sm: 'row' }}
        >
          <Box minW="150px" textAlign={{ base: 'start', sm: 'end' }}>
            Contenido
          </Box>

          <OpenEditor
            updateDataOnChange
            value={contenido}
            onChange={setContenido}
            placeholder="Escribe una pregunta"
            data-cy="contenido_pregunta_open_editor"
          />
        </Flex>

        <Flex
          h="100%"
          gap={{ base: '10px', sm: '40px' }}
          align={{ base: 'start', sm: 'center' }}
          direction={{ base: 'column', sm: 'row' }}
        >
          <Box minW="150px" textAlign={{ base: 'start', sm: 'end' }} />

          <Button
            data-cy="subir_pregunta_button"
            bg="primary"
            color="#fff"
            p="10px 16px"
            rounded="10px"
            w="fit-content"
            onClick={subirPregunta}
            isDisabled={!titulo || !contenido}
          >
            Subir pregunta
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default NuevaPregunta;
