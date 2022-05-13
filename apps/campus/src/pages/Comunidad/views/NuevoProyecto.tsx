import { useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import * as Yup from 'yup';
import { Form as FormikForm, Formik } from 'formik';
import { useToast, Flex, Button, Box, Text } from '@chakra-ui/react';

import { LoginContext } from '../../../shared/context';
import { onSuccess, onFailure } from 'utils';
import { addProyecto, getHabilidades, updateProyecto, useProyecto } from 'data';
import { FormAsyncSelect, FormInput, FormSelect } from '../../../shared/components';
import { FormTextEditor } from 'ui';

export const NuevoProyecto = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const { user } = useContext(LoginContext);
  const _proyectoId = useParams();
  const proyectoId = parseInt(_proyectoId.proyecto || '');

  const { proyecto: defaultValue } = useProyecto({ id: proyectoId });
  const validationSchema = Yup.object().shape({
    titulo: Yup.string()
      .min(2, 'Título demasiado corto!')
      .required('El título es obligatorio.')
      .typeError('El título es obligatorio.'),
    enlaceGithub: Yup.string()
      .min(2, 'El enlace a Github es demasiado corto!')
      .required('El enlace a Github es obligatorio.')
      .typeError('El enlace a Github es obligatorio.')
      .matches(/\W*(github.com)\W*/, 'El enlace debe de ser a GitHub.'),
    enlaceDemo: Yup.string()
      .min(2, 'El enlace a la demo es demasiado corto!')
      .required('El enlace a la demo es obligatorio.')
      .typeError('El enlace a la demo es obligatorio.'),
    contenido: Yup.string().notRequired().nullable(),
    publico: Yup.boolean().notRequired(),
    habilidades: Yup.array().of(Yup.number()).notRequired(),
  });

  const initialValues = {
    titulo: defaultValue?.titulo || '',
    enlaceGithub: defaultValue?.enlaceGithub || '',
    enlaceDemo: defaultValue?.enlaceDemo || '',
    contenido: defaultValue?.contenido || '',
    publico: defaultValue?.publico || false,
    habilidades: defaultValue?.habilidades?.map((hab: any) => hab.id) || [],
  };

  const submitForm = (values: any) => {
    if (!user?.id) {
      onFailure(toast, 'Error inesperado', 'Por favor, actualize la página y contacte con soporte si el error persiste.');
      return;
    }

    const proyecto = {
      userId: user?.id,
      titulo: values.titulo,
      publico: values.publico,
      contenido: values.contenido,
      enlaceDemo: values.enlaceDemo,
      enlaceGithub: values.enlaceGithub,
      habilidades: values.habilidades,
    };

    if (defaultValue?.id) {
      updateProyecto({ id: defaultValue?.id, proyecto })
        .then((e: any) => {
          onSuccess(toast, e.message);
          navigate(`/comunidad/${e.value?.id}`);
        })
        .catch((error: any) => {
          console.error('❌ Algo ha fallado...', error);
          onFailure(toast, error.title, error.message);
        });
    } else {
      addProyecto({ proyecto })
        .then((e: any) => {
          onSuccess(toast, e.message);
          navigate(`/comunidad/${e.value?.id}`);
        })
        .catch((error: any) => {
          console.error('❌ Algo ha fallado...', error);
          onFailure(toast, error.title, error.message);
        });
    }
  };

  const loadHabilidades = async (value: any) => {
    const _habilidades = await getHabilidades({ query: [{ nombre: value }] });

    return _habilidades?.data?.map((hab: any) => ({
      value: hab.id,
      label: hab.nombre,
    }));
  };

  function onKeyDown(keyEvent: any) {
    if ((keyEvent.charCode || keyEvent.keyCode) === 13) keyEvent.stopPropagation();
  }

  return (
    <Formik
      onSubmit={submitForm}
      validationSchema={validationSchema}
      initialValues={initialValues}
      style={{ height: '100%', paddingBottom: '20px' }}
    >
      {(formik) => {
        const { handleSubmit } = formik;

        return (
          <Flex
            w="100% "
            rounded="12px"
            border="1px solid var(--chakra-colors-gray_3)"
            bg="white"
            h="min-content"
            m={{ base: '20px', sm: '40px' }}
          >
            <FormikForm onSubmit={handleSubmit} onKeyDown={onKeyDown} style={{ width: '100%' }}>
              <Flex p="30px" gap="27px" w="100%" direction="column">
                <Text variant="h1_heading"> {defaultValue ? 'Editar proyecto' : 'Crear proyecto'}</Text>

                <Box bg="gray_3" h="1px" />

                <FormInput
                  labelColor="black"
                  name="titulo"
                  label="Título del proyecto*"
                  placeholder="Introduce el título del proyecto"
                />

                <FormInput
                  labelColor="black"
                  name="enlaceGithub"
                  label="Enlace a Github *"
                  placeholder="Introduce el enlace a github"
                />

                <FormInput
                  labelColor="black"
                  name="enlaceDemo"
                  label="Enlace de la demo *"
                  placeholder="Introduce el enlace a la demo"
                />

                <FormSelect
                  labelColor="black"
                  name="publico"
                  label="¿El proyecto es público?"
                  placeholder="Selecciona una opción"
                  options={[
                    { label: 'Proyecto público', value: true },
                    { label: 'Proyecto privado', value: false },
                  ]}
                />

                <FormAsyncSelect
                  isMulti
                  name="habilidades"
                  label="Habilidades"
                  loadOptions={loadHabilidades}
                  placeholder="Escribe para buscar"
                  defaultValue={
                    defaultValue
                      ? defaultValue?.habilidades?.map((hab: any) => ({
                          label: hab.nombre,
                          value: hab.id,
                        }))
                      : undefined
                  }
                />
                <FormTextEditor
                  name="contenido"
                  label="Descripción del proyecto"
                  placeholder="Introduce la descripción del proyecto"
                />
              </Flex>

              <Flex p="30px" gap="30px">
                <Button h="40px" bg="primary" color="white" fontSize="14px" fontWeight="semibold" type="submit">
                  {defaultValue ? 'Guardar Cambios' : 'Añadir Proyecto'}
                </Button>
              </Flex>
            </FormikForm>{' '}
          </Flex>
        );
      }}
    </Formik>
  );
};
