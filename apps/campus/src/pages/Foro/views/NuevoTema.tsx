import { useRef, useEffect } from 'react';

import * as Yup from 'yup';
import { Form as FormikForm, Formik } from 'formik';
import { Box, Button, Flex, useToast } from '@chakra-ui/react';

import { FormInput, FormSelect, FormAsyncSelect } from '../../../shared/components';
import { ICurso } from 'data';
import { onFailure, onSuccess } from 'utils';
import { addForoTema, getCursos, getModulos } from 'data';

const NuevoTema = () => {
  const toast = useToast();

  const inputRef = useRef<any>();

  const validationSchema = Yup.object().shape({
    titulo: Yup.string()
      .min(2, '¡Título del tema demasiado corto!')
      .required('El título del tema es obligatorio.')
      .typeError('El título del tema es obligatorio.'),
    descripcion: Yup.string()
      .min(2, '¡Descripción del tema demasiado corta!')
      .required('La descripción del tema es obligatoria.')
      .typeError('La descripción del tema es obligatoria.'),
    publicado: Yup.boolean()
      .required('Debes seleccionar si publicar o no el tema.')
      .typeError('Debes seleccionar si publicar o no el tema.'),
    cursoId: Yup.number().required(),
    moduloId: Yup.number().notRequired().nullable(),
  });

  const initialValues = {
    titulo: '',
    descripcion: '',
    cursoId: undefined,
    moduloId: undefined,
    publicado: undefined,
  };

  useEffect(() => {
    if (inputRef.current) setTimeout(() => inputRef.current.focus(), 0);
  }, []);

  const submitForm = async (values: any) => {
    addForoTema({ tema: values })
      .then((e: any) => {
        onSuccess(toast, `Tema ${values.titulo} publicado correctamente`);
      })
      .catch((error: any) => {
        console.error('❌ Algo ha fallado...', error);
        onFailure(toast, error.title, error.message);
      });
  };

  function onKeyDown(keyEvent: any) {
    if ((keyEvent.charCode || keyEvent.keyCode) === 13) keyEvent.stopPropagation();
  }

  const loadCursos = async (value: string) => {
    const _cursos = await getCursos({
      treatData: false,
      query: [{ titulo: value }],
      strategy: 'invalidate-on-undefined',
    });

    const map_cursos = _cursos?.data?.map((curso: ICurso) => ({
      value: curso.id,
      label: curso.titulo,
    }));

    return map_cursos;
  };

  const loadModulos = async (value: string, cursoId?: number) => {
    const data = await getModulos({
      query: [{ titulo: value }, { curso_id: cursoId }],
    });

    return data?.data?.map((user: any) => ({
      value: user.id,
      label: user.titulo,
    }));
  };

  return (
    <Flex w="100%" direction="column" p={{ base: '18px', sm: '34px' }} gap={{ base: '14px', sm: '24px' }}>
      <Box w="100%" fontSize="24px" fontWeight="bold" lineHeight="29px">
        Crea un nuevo tema para los foros
      </Box>

      <Box h="1px" bg="gray_3" />

      <Formik onSubmit={submitForm} initialValues={initialValues} validationSchema={validationSchema}>
        {(formik) => {
          const { values, handleSubmit } = formik;

          return (
            <FormikForm onSubmit={handleSubmit} onKeyDown={onKeyDown}>
              <Flex direction="column" gap="24px" w="100%" p={{ base: '12px', sm: '34px' }}>
                <FormInput inputRef={inputRef} name="titulo" label="Título *" placeholder="Introduce un título para el tema" />

                <FormInput name="descripcion" label="Descripción *" placeholder="Introduce la descripción del tema" />

                <FormSelect
                  name="publicado"
                  label="Publicar tema *"
                  placeholder="Selecciona una opción"
                  options={[
                    { label: 'Publicado', value: true },
                    { label: 'Oculto', value: false },
                  ]}
                />

                <FormAsyncSelect
                  name="cursoId"
                  label="Curso asociado *"
                  placeholder="Escribe para buscar..."
                  loadOptions={loadCursos}
                />

                <FormAsyncSelect
                  isDisabled={!values?.cursoId}
                  name="moduloId"
                  label="Módulo asociado"
                  placeholder="Escribe para buscar..."
                  loadOptions={(txt: string) => loadModulos(txt, values.cursoId)}
                />

                <Button bg="primary" color="#fff" p="10px 16px" rounded="10px" w="fit-content" type="submit">
                  Subir tema
                </Button>
              </Flex>
            </FormikForm>
          );
        }}
      </Formik>
    </Flex>
  );
};

export default NuevoTema;
