import { Flex, Box } from '@chakra-ui/react';

import { PerfilSelect } from '../../components';
import { getEstados, getPaises, IEstado, IPais } from 'data';
import { useEffect, useState } from 'react';

type TabDatosProps = {
  pending: boolean;
  setPending: (e?: any) => void;
  pais: any;
  setPais: (e?: any) => void;
  estado: any;
  setEstado: (e?: any) => void;
  trabajoRemoto: boolean;
  setTrabajoRemoto: (e?: any) => void;
  posibilidadTraslado: boolean;
  setPosibilidadTraslado: (e?: any) => void;
};

export const TabDatos = ({
  pending,
  setPending,
  pais,
  setPais,
  estado,
  setEstado,
  trabajoRemoto,
  setTrabajoRemoto,
  posibilidadTraslado,
  setPosibilidadTraslado,
}: TabDatosProps) => {
  const [countries, setCountries] = useState([]);
  const [estados, setEstados] = useState([]);

  useEffect(() => {
    getAllCountries();
  }, []);

  useEffect(() => {
    if (pais) getAllEstados();
  }, [pais]);

  const getAllCountries = async () => {
    let paises: any = await getPaises({});
    setCountries(
      paises.map((c: IPais) => ({
        label: c.bandera + ' ' + c.nombre,
        value: { label: c.nombre, value: c },
      }))
    );
  };

  const getAllEstados = async () => {
    let estados: any = await getEstados({ query: [{ pais_id: pais.id }] });
    setEstados(
      estados.map((e: IEstado) => ({
        label: e.nombre,
        value: { label: e.nombre, value: e },
      }))
    );
  };

  return (
    <Flex direction="column">
      <Box fontSize="18px" fontWeight="bold" mb="27.5px">
        Datos
      </Box>

      <PerfilSelect
        label="País"
        name="pais"
        placeholder="Elige un país del listado"
        defaultValue={pais ? { label: `${pais.bandera} ${pais.nombre}`, value: pais } : undefined}
        options={countries}
        onChange={(e: any) => {
          if (!pending) setPending(true);
          setPais(e.value);
        }}
      />

      <PerfilSelect
        label="Región"
        name="estado"
        placeholder="Elige una región del listado"
        options={estados}
        defaultValue={estado ? { label: estado.nombre, value: estado } : estado}
        onChange={(e: any) => {
          if (!pending) setPending(true);
          setEstado(e.value);
        }}
        isDisabled={!pais || !pais?.nombre}
      />

      <PerfilSelect
        name="trabajoRemoto"
        label="Presencialidad"
        onChange={(e: any) => {
          if (!pending) setPending(true);
          setTrabajoRemoto(e);
        }}
        options={[
          { label: 'Remoto', value: true },
          { label: 'Presencial', value: false },
        ]}
        defaultValue={{
          label: trabajoRemoto ? 'Remoto' : 'Presencial',
          value: trabajoRemoto,
        }}
      />

      <PerfilSelect
        name="posibilidadTraslado"
        label="Posibilidad de traslado"
        onChange={(e: any) => {
          if (!pending) setPending(true);
          setPosibilidadTraslado(e);
        }}
        options={[
          { label: 'Sí', value: true },
          { label: 'No', value: false },
        ]}
        defaultValue={{
          label: posibilidadTraslado ? 'Sí' : 'No',
          value: posibilidadTraslado,
        }}
      />
    </Flex>
  );
};
