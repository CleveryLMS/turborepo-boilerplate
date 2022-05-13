import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { BiPlus } from 'react-icons/bi';
import Masonry from 'react-masonry-css';
import { Flex, Tabs, Tab, TabPanel, TabPanels, TabList, Skeleton, Button, Icon } from '@chakra-ui/react';

import { ProyectoModal } from './Modal';
import { GlobalCard, GlobalCardType } from '../../../shared/components';
import { FavoritosContext, LoginContext } from '../../../shared/context';
import { IProyecto, useProyectos, useProyecto, FavoritoTipoEnum } from 'data';

const ComunidadList = () => {
  const navigate = useNavigate();
  const { user } = useContext(LoginContext);

  const [tabIndex, setTabIndex] = useState<number>(0);

  const [proyecto, setProyecto] = useState<IProyecto>();

  const { proyectos, isLoading } = useProyectos({
    query: [{ limit: 500 }, { publico: true }],
  });

  const { proyectos: proyectosPropios, isLoading: isLoadingPropios } = useProyectos({
    strategy: 'invalidate-on-undefined',
    query: [{ user_id: user?.id }, { limit: 500 }],
  });

  const _proyectoID = useParams().proyectoID || null;
  const { proyecto: _proyecto } = useProyecto({
    id: +(_proyectoID || 0),
    strategy: 'invalidate-on-undefined',
  });

  useEffect(() => {
    if (_proyecto) setProyecto(_proyecto);
  }, [_proyecto]);

  return (
    <Flex w="100%">
      <ProyectoModal
        proyecto={proyecto}
        isOpen={proyecto !== undefined}
        onClose={() => setProyecto(undefined)}
        onClickNext={() => setProyecto(proyectos[proyectos.indexOf(proyecto) + 1])}
        onClickPrev={() => setProyecto(proyectos[proyectos.indexOf(proyecto) - 1])}
      />

      <Tabs w="100%" p="20px" tabIndex={tabIndex} onChange={(i) => setTabIndex(i)} _focus={{ outline: 'none' }}>
        <TabList w="100%" p="0px" borderBottom="1px solid var(--chakra-colors-gray_3)">
          <Flex direction={{ base: 'column-reverse', sm: 'row' }} w="100%">
            <Flex w="100%">
              <Tab
                color="gray_4"
                fontSize="15px"
                fontWeight="bold"
                _selected={{
                  color: 'primary',
                  borderBottom: '4px solid var(--chakra-colors-primary)',
                }}
              >
                Comunidad
              </Tab>

              <Tab
                color="gray_4"
                fontSize="15px"
                fontWeight="bold"
                _selected={{
                  color: 'primary',
                  borderBottom: '4px solid var(--chakra-colors-primary)',
                }}
              >
                Mis proyectos
              </Tab>
            </Flex>
            <Button
              ml={{ base: '0', sm: '50px' }}
              mb={{ base: '20px', sm: '0' }}
              w="fit-content"
              px="40px"
              bg="primary"
              color="white"
              fontWeight="bold"
              _hover={{ bg: 'var(--chakra-colors-primary_dark)' }}
              onClick={() => navigate('/comunidad/new')}
              rightIcon={<Icon boxSize="20px" as={BiPlus} />}
            >
              Crear proyecto
            </Button>
          </Flex>
        </TabList>

        <TabPanels w="100%" p="0px">
          <TabPanel w="100%">
            <TabProyectos proyectos={proyectos} isLoading={isLoading} setProyecto={setProyecto} />
          </TabPanel>

          <TabPanel w="100%">
            <TabProyectosPropios proyectos={proyectosPropios} isLoading={isLoadingPropios} setProyecto={setProyecto} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
};
export default ComunidadList;

interface TabMisProyectosProps {
  proyectos?: IProyecto[];
  isLoading?: boolean;
  setProyecto: (proyecto: IProyecto) => void;
}

const TabProyectos = ({ proyectos, setProyecto, isLoading = false }: TabMisProyectosProps) => {
  const navigate = useNavigate();

  const { user } = useContext(LoginContext);
  const { favoritos, addFavorito, removeFavorito } = useContext(FavoritosContext);

  return (
    <Flex w="100%" direction="column" gap="40px" position="relative">
      <Masonry
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
        breakpointCols={{ default: 4, 1800: 3, 1400: 2, 1000: 1 }}
      >
        {isLoading ? (
          new Array(10).fill(1).map((a, i) => (
            <Flex h="fit-content" key={`proyecto-${i}`}>
              <Flex
                w="100%"
                bg="white"
                rounded="2xl"
                justify="start"
                cursor="pointer"
                overflow="hidden"
                transition="all 0.2s ease"
                border="1px solid var(--chakra-colors-gray_3)"
                _hover={{ backgroundColor: 'var(--chakra-colors-gray_2)' }}
              >
                <Flex direction="column" p="20px" w="100%">
                  <Skeleton h="200px" w="100%" rounded="5px" mb="24px" />
                  <Skeleton h="22px" w="50%" mb="10px" />
                  <Skeleton h="22px" w="100%" mb="5px" />
                  <Skeleton h="22px" w="100%" mb="5px" />
                  <Skeleton h="22px" w="100%" mb="20px" />

                  <Flex w="100%" justify="space-between" mb="24px">
                    <Skeleton h="22px" w="32%" />
                    <Skeleton h="22px" w="32%" />
                    <Skeleton h="22px" w="32%" />
                  </Flex>

                  <Flex w="100%" justify="space-between">
                    <Skeleton h="20px" w="75px" />
                    <Skeleton h="30px" w="30px" rounded="full" />
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
          ))
        ) : (proyectos?.length || 0) === 0 ? (
          <GlobalCard onClick={() => navigate('/comunidad/new')} type={GlobalCardType.PROYECTO_NUEVO} props={{}} />
        ) : (
          proyectos?.map((proyecto: any, index: number) => (
            <GlobalCard
              key={`proyecto-${index}`}
              onClick={() => setProyecto(proyecto)}
              type={GlobalCardType.PROYECTO_PUBLICO}
              props={{
                proyecto: proyecto,
                isFavved: favoritos?.find((f) => f.tipo === FavoritoTipoEnum.PROYECTO && f.objetoId === proyecto.id),
                onFav: () => {
                  const fav = favoritos?.find((f) => f.tipo === FavoritoTipoEnum.PROYECTO && f.objetoId === proyecto.id);

                  if (fav) removeFavorito(fav);
                  else if (user?.id)
                    addFavorito({
                      tipo: FavoritoTipoEnum.PROYECTO,
                      objetoId: proyecto.id,
                      objeto: proyecto,
                      userId: user?.id,
                    });
                },
              }}
            />
          ))
        )}
      </Masonry>
    </Flex>
  );
};

const TabProyectosPropios = ({ proyectos, setProyecto, isLoading = false }: TabMisProyectosProps) => {
  const navigate = useNavigate();

  const { user } = useContext(LoginContext);
  const { favoritos, addFavorito, removeFavorito } = useContext(FavoritosContext);

  return (
    <Flex w="100%" direction="column" gap="40px" position="relative">
      <Masonry
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
        breakpointCols={{ default: 4, 1800: 3, 1400: 2, 1000: 1 }}
      >
        {isLoading ? (
          new Array(10).fill(1).map((a, i) => (
            <Flex h="fit-content" key={`proyecto-${i}`}>
              <Flex
                w="100%"
                bg="white"
                rounded="2xl"
                justify="start"
                cursor="pointer"
                overflow="hidden"
                transition="all 0.2s ease"
                border="1px solid var(--chakra-colors-gray_3)"
                _hover={{ backgroundColor: 'var(--chakra-colors-gray_2)' }}
              >
                <Flex direction="column" p="20px" w="100%">
                  <Skeleton h="200px" w="100%" rounded="5px" mb="24px" />
                  <Skeleton h="22px" w="50%" mb="10px" />
                  <Skeleton h="22px" w="100%" mb="5px" />
                  <Skeleton h="22px" w="100%" mb="5px" />
                  <Skeleton h="22px" w="100%" mb="20px" />

                  <Flex w="100%" justify="space-between" mb="24px">
                    <Skeleton h="22px" w="32%" />
                    <Skeleton h="22px" w="32%" />
                    <Skeleton h="22px" w="32%" />
                  </Flex>

                  <Flex w="100%" justify="space-between">
                    <Skeleton h="20px" w="75px" />
                    <Skeleton h="30px" w="30px" rounded="full" />
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
          ))
        ) : (proyectos?.length || 0) === 0 ? (
          <GlobalCard onClick={() => navigate('/comunidad/new')} type={GlobalCardType.PROYECTO_NUEVO} props={{}} />
        ) : (
          proyectos?.map((proyecto: any, index: number) => (
            <GlobalCard
              key={`proyecto-${index}`}
              onClick={() => setProyecto(proyecto)}
              type={GlobalCardType.PROYECTO_PROPIO}
              props={{
                proyecto: proyecto,
                isFavved: favoritos?.find((f) => f.tipo === FavoritoTipoEnum.PROYECTO && f.objetoId === proyecto.id),
                onFav: () => {
                  const fav = favoritos?.find((f) => f.tipo === FavoritoTipoEnum.PROYECTO && f.objetoId === proyecto.id);

                  if (fav) removeFavorito(fav);
                  else if (user?.id)
                    addFavorito({
                      tipo: FavoritoTipoEnum.PROYECTO,
                      objetoId: proyecto.id,
                      objeto: proyecto,
                      userId: user?.id,
                    });
                },
              }}
            />
          ))
        )}
      </Masonry>
    </Flex>
  );
};
