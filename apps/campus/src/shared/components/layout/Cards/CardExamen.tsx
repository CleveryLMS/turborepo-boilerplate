import { Flex, Box, Icon } from '@chakra-ui/react';
import { BiAward, BiBarChartAlt2, BiCheckboxChecked, BiTimeFive } from 'react-icons/bi';
import { Avatar } from '../..';

import { IExamen } from 'data';
import { fmtMnts } from 'utils';

export const CardExamen = ({
  examen,
  isActive,
  isCompleted,
  icon,
  onClick,
}: {
  icon?: string;
  examen: IExamen;
  isActive?: boolean;
  isCompleted?: boolean;
  onClick: () => void;
}) => (
  <Flex w="100%" bg="white" rounded="20px" justify="space-between" align="center" p="24px" onClick={onClick}>
    <Flex w="100%" cursor="pointer" direction="column" justify="space-between">
      <Flex w="100%" gap="18px" align="center">
        <Avatar size="60px" rounded="10px" src={examen?.imagen?.url} name=" " />

        <Flex w="100%" direction="column" gap="6px" overflow="hidden">
          <Box
            whiteSpace="nowrap"
            overflow="hidden"
            lineHeight="19px"
            textOverflow="ellipsis"
            fontWeight="bold"
            fontSize="16px"
          >
            {examen?.nombre}
          </Box>

          <Flex align="center" gridColumnGap="12px" wrap="wrap">
            <Flex align="center" gap="5px">
              <Icon as={BiBarChartAlt2} boxSize="20px" color="gray_6" />

              <Box whiteSpace="nowrap" fontSize="14px" fontWeight="semibold" lineHeight="16px" color="gray_4">
                {examen?.certificacion?.nivel === 1 ? 'Iniciado' : examen?.certificacion?.nivel === 2 ? 'Medio' : 'Avanzado'}
              </Box>
            </Flex>

            <Flex align="center" gap="5px">
              <Icon as={BiCheckboxChecked} boxSize="20px" color="gray_6" />

              <Box whiteSpace="nowrap" fontSize="14px" fontWeight="semibold" lineHeight="16px" color="gray_4">
                {examen?.numPreguntas || 0} Preguntas
              </Box>
            </Flex>

            {examen?.certificacion?.meta?.duracionExamenes ? (
              <Flex align="center" gap="5px">
                <Icon as={BiTimeFive} boxSize="20px" color="#8B8FA2" />

                <Box whiteSpace="nowrap" fontSize="14px" fontWeight="semibold" lineHeight="16px" color="gray_3">
                  {fmtMnts(examen?.certificacion?.meta?.duracionExamenes)}
                </Box>
              </Flex>
            ) : null}
          </Flex>
        </Flex>
      </Flex>
    </Flex>

    {examen?.meta?.isCompleted && (
      <Flex
        rounded="full"
        align="center"
        justify="center"
        filter="drop-shadow(0px 4px 20px rgba(38, 200, 171, 0.3))"
        bg="linear-gradient(227.34deg, #14E390 -4.81%, #24CCA7 97.15%)"
      >
        <Icon as={BiAward} w="46px" h="46px" maxW="46px" maxH="46px" p="8px" color="#fff" />
      </Flex>
    )}
  </Flex>
);

// const CardExamenSidebar = ({ examen, icon, onClick }: { examen: IExamen; icon?: string; onClick: () => void }) => (
//   <Flex className="card-examen card-examen__sidebar" onClick={onClick}>
//     <Flex minW="60px" h="60px" rounded="15px" overflow="hidden">
//       <Image src={icon} fit="cover" transform="scale(1.7)" />
//     </Flex>

//     <Flex direction="column" w="100%" gridRowGap="7px">
//       <Box fontSize="19px" fontWeight="bold">
//         {examen?.nombre}
//       </Box>

//       <Box fontSize="15px" fontWeight="medium" color="gray_4">
//         {examen?.curso?.titulo} · {examen?.duracion || 0} min
//       </Box>
//     </Flex>

//     <Flex
//       minW="40px"
//       h="40px"
//       bg="white"
//       align="center"
//       justify="center"
//       border="2px solid"
//       borderColor="gray_5"
//       rounded="14px"
//     >
//       <Icon as={BiPlay} boxSize="24px" color="gray_4" />
//     </Flex>
//   </Flex>
// );
