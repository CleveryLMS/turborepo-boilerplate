import { useContext } from 'react';

import { Flex, Box, useToast } from '@chakra-ui/react';

import { onFailure } from 'utils';
import { PerfilAsyncSelect, PerfilSelect } from '../../components';
import { updateProgresoGlobal, getUserByID, getRutas, IRuta } from 'data';
import { LoginContext, ProgresoGlobalContext, RoadmapContext } from '../../../../shared/context';

export const TabRuta = () => {
  const toast = useToast();

  const { user, setUser } = useContext(LoginContext);
  const { ruta, setRuta } = useContext(RoadmapContext);
  const { progresoGlobal } = useContext(ProgresoGlobalContext);

  const handleOnRoadmapChange = (event: any) => {
    if (!progresoGlobal?.id) {
      onFailure(toast, 'Error inesperado', 'Por favor, actualize la página y contacte con soporte si el error persiste.');
      return Promise.reject();
    }

    return updateProgresoGlobal({
      id: progresoGlobal?.id,
      progresoGlobal: { rutaId: event },
    })
      .then(async (res) => {
        const dataUser = await getUserByID({ id: user?.id || 0 });

        if (!dataUser.isAxiosError) {
          setUser({ ...dataUser });
          setRuta(dataUser?.progresoGlobal?.ruta ? { ...dataUser.progresoGlobal?.ruta } : null);
        } else console.error({ error: dataUser });
      })
      .catch((err) => console.error({ err }));
  };

  const loadRutasByNombre = async (value: string) => {
    const _rutas = await getRutas({ query: [{ privada: false }] });

    return _rutas?.data?.map((ruta: IRuta) => ({
      value: ruta.id,
      label: ruta.nombre,
    }));
  };

  return (
    <Flex direction="column">
      <Box fontSize="18px" fontWeight="bold" mb="27.5px">
        Hoja de ruta
      </Box>

      <PerfilAsyncSelect
        defaultOptions
        name="ruta_id"
        label="Hoja de ruta activa"
        loadOptions={loadRutasByNombre}
        onChange={handleOnRoadmapChange}
        placeholder="Escribe para buscar"
        isDisabled={process.env.NX_EDIT_ROADMAP === 'FALSE'}
        defaultValue={{ label: ruta?.nombre, value: ruta?.id }}
      />
    </Flex>
  );
};
