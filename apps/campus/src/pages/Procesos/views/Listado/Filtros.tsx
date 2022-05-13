import { useState, useEffect } from 'react';

import { BiTrash } from 'react-icons/bi';
import { Flex, Box, Icon } from '@chakra-ui/react';

import {
  FilterCheckbox,
  FilterRangeInput,
  FilterInput,
} from '../../../../shared/components';

export const ProcesosFiltros = ({
  onChange,
}: {
  onChange: (filters: string) => void;
}) => {
  const [ciudad, setCiudad] = useState<string>();
  const [presencialidad, setPresencialidad] = useState<boolean>();
  const [jornada, setJornada] = useState<boolean>();
  const [salarioMin, setSalarioMin] = useState<number>();
  const [salarioMax, setSalarioMax] = useState<number>();
  const [habilidades, setHabilidades] = useState<string[]>([]);

  useEffect(() => {
    let _filters = '';

    if (ciudad) _filters += `&ciudad=${ciudad}`;
    if (presencialidad) _filters += `&presencialidad=${presencialidad}`;
    if (salarioMax) _filters += `&salarioMax=${salarioMax}`;
    if (salarioMin) _filters += `&salarioMin=${salarioMin}`;
    if (habilidades?.length > 0)
      _filters = `&habilidades=[${habilidades
        .map((item: any) => `${item.value}:${item.meta?.pivot_nivel}`)
        .join(',')}]`;

    onChange(_filters);
  }, [habilidades, ciudad, presencialidad, jornada, salarioMin, salarioMax]);

  const resetValues = () => {
    setCiudad(undefined);
    setPresencialidad(undefined);
    setJornada(undefined);
    setSalarioMin(undefined);
    setSalarioMax(undefined);
    setHabilidades([]);
  };

  return (
    <Flex
      h="100%"
      w="330px"
      minW="330px"
      gap="28px"
      overflow="hidden"
      direction="column"
      p="28px 24px 24px"
    >
      <Flex justify="space-between">
        <Box fontSize="18px" fontWeight="bold" lineHeight="21px">
          Filtros de búsqueda
        </Box>

        <Icon
          as={BiTrash}
          cursor="pointer"
          color="primary"
          boxSize="20px"
          onClick={resetValues}
        />
      </Flex>

      <Flex direction="column" gap="25px" overflow="auto">
        <FilterInput
          label="Ciudad"
          name="ciudad"
          updateValue={setCiudad}
          defaultValue={ciudad}
        />

        <FilterCheckbox
          name="presencialidad"
          label="Tipo presencialidad"
          updateValue={(e) => setPresencialidad(e.presencialidad)}
          defaultValue={{ label: presencialidad ? 'Presencial' : 'En remoto' }}
          options={[
            { label: 'Presencial', value: 'true' },
            { label: 'En remoto', value: 'false' },
          ]}
        />

        <FilterCheckbox
          name="jornada"
          label="Tipo jornada"
          updateValue={(e) => setJornada(e.jornada)}
          defaultValue={{ label: jornada ? 'completa' : 'parcial' }}
          options={[
            { label: 'Completa', value: 'true' },
            { label: 'Parcial', value: 'false' },
          ]}
        />

        <FilterRangeInput
          label="Salario Anual"
          minInput={{ name: 'salarioMin', placeholder: 'min. €' }}
          maxInput={{ name: 'salarioMax', placeholder: 'max. €' }}
          updateValue={(e) => {
            setSalarioMin(e.salarioMin);
            setSalarioMax(e.salarioMax);
          }}
        />
      </Flex>
    </Flex>
  );
};
