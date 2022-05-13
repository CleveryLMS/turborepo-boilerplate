import { useRef } from 'react';

import { BiLock } from 'react-icons/bi';
import { motion } from 'framer-motion';
import { Box, Flex, Icon, List, ListItem, Text } from '@chakra-ui/react';

import { useHover } from 'utils';

interface cardProps {
  fase: string;
  descripcion: string;
  isActive?: boolean;
  isCompleted?: boolean;

  toPassState?: any;

  'data-cy'?: string;
}

const datosCard: cardProps[] = [
  {
    fase: 'Incubación',
    descripcion: 'En este nivel te introduciremos y prepararemos académicamente para ser desarrollador.',
    isActive: true,

    toPassState: { content: '', contentBloqued: '' },
    'data-cy': 'como_funciona_card_Incubación',
  },
  {
    fase: 'Aceleración',
    descripcion: 'Una vez alcances este nivel te empezaremos a preparar para las ofertas de trabajo.',

    toPassState: {
      content: ['Completar un curso', "Apuntarse a un 'Commit' o 'Intensivo'", 'Verificar tu cuenta de Discord'],
      contentBloqued: '',
    },
  },
  {
    fase: 'Laboral',
    descripcion: 'Cuando consigas tu vacante podrás seguir formándote en OpenBootcamp.',

    toPassState: {
      content: [
        "Completa al menos un 'Commit' o 'Intensivo'",
        'Entrega un proyecto final',
        "Firma el contrato de 'Compromiso y Esfuerzo'",
      ],
      contentBloqued: 'Accede a Fase Aceleración para comprobar los requisitos necesarios para desbloquear la Fase Laboral',
    },
  },
];

export const ComoFunciona = () => {
  return (
    <Flex
      boxSize="100%"
      align="center"
      overflowX="auto"
      overflowY="visible"
      paddingBottom="10px"
      data-cy="home_como_funciona_ob"
    >
      {datosCard.map((c: cardProps, index: number) => (
        <CardItem
          card={c}
          id={index + 1}
          key={`datos_card-item-${index}`}
          isLast={datosCard.length - 1 === index}
          prevIsActive={!!datosCard[index - 1]?.isActive}
        />
      ))}
    </Flex>
  );
};

const CardItem = ({
  card,
  id,
  isLast,
  prevIsActive,
}: {
  card: cardProps;
  id: number;
  isLast: boolean;
  prevIsActive: boolean;
}) => {
  const hoverRef = useRef(null);
  const isHover = useHover(hoverRef);

  return (
    <Flex align="center" ref={hoverRef} data-cy={card['data-cy']}>
      {id !== 1 && (
        <Flex
          bg="gray_2"
          minW="20px"
          h="10px"
          borderTop="1px solid var(--chakra-colors-gray_3)"
          borderBottom="1px solid var(--chakra-colors-gray_3)"
        />
      )}
      <Flex
        rounded="22px"
        bgGradient={card.isActive ? 'linear(to-br, #6D78E5, #5A9CF9, #4FC0D3)' : ''}
        bg={card.isActive ? '' : 'gray_3'}
        p={card.isActive ? '2px' : '1px'}
        justify="center"
        align="center"
        position="relative"
      >
        {!card.isActive && (
          <Flex
            transition="all 0.3s linear"
            as={motion.div}
            h="195px"
            w="332px"
            align="flex-start"
            direction="column"
            p="28px 24px"
            bg="white"
            rounded="20px"
            position="absolute"
            zIndex="10"
            initial={{ clipPath: 'circle(0% at 50% 0%)' }}
            animate={{
              clipPath: isHover ? 'circle(200% at 50% 0%)' : 'circle(0% at 50% 0%)',
            }}
          >
            <Flex
              w="100%"
              justify="center"
              align="center"
              direction="column"
              color="black"
              opacity="0.5"
              fontSize="14px"
              gap="12px"
            >
              <Icon as={BiLock} boxSize="30px" />

              {prevIsActive ? (
                <List>
                  {card?.toPassState &&
                    card?.toPassState?.content?.map((c: any, i: number) => (
                      <ListItem gap="4px" display="flex" alignItems="center" key={`card_item-list_item-${i}`}>
                        <Box boxSize="12px" border="1px" />
                        {c}
                      </ListItem>
                    ))}
                </List>
              ) : (
                card?.toPassState?.contentBloqued
              )}
            </Flex>
          </Flex>
        )}

        <Flex
          h="195px"
          w="332px"
          bg="white"
          p="28px 24px"
          rounded="20px"
          align="flex-start"
          direction="column"
          position="relative"
          opacity={card.isActive || card.isCompleted ? 1 : 0.5}
        >
          {card.isActive && <Pointer />}

          <Text
            color={card.isActive || card.isCompleted ? 'transparent' : 'black'}
            bgGradient={card.isActive || card.isCompleted ? 'linear(to-br, #7E5BFD, #21F479)' : ''}
            bgClip={card.isActive || card.isCompleted ? 'text' : ''}
            fontSize={{ base: '22px', sm: '28px' }}
            fontWeight="bold"
            mb="12px"
          >
            {id}
          </Text>

          <Flex align="center" w="100%" mb="15px" gap="6px">
            <Text fontSize="18px" textTransform="uppercase">
              Fase
            </Text>

            <Text fontSize="18px" textTransform="uppercase" fontWeight="bold">
              {card.fase}
            </Text>
          </Flex>

          <Text fontSize="14px" lineHeight="22px">
            {card.descripcion}
          </Text>
        </Flex>
      </Flex>

      {!isLast && (
        <Flex
          h="10px"
          bg="gray_2"
          minW="20px"
          borderTop="1px solid var(--chakra-colors-gray_3)"
          borderBottom="1px solid var(--chakra-colors-gray_3)"
        />
      )}
    </Flex>
  );
};

const Pointer = () => (
  <Icon width="56" height="39" zIndex="10" top="-10px" left="55px" position="absolute" viewBox="0 0 56 39">
    <svg width="56" height="39" fill="none" viewBox="0 0 56 39" xmlns="http://www.w3.org/2000/svg">
      <g filter="url(#filter0_d_1504_716)">
        <path
          d="M26.7276 19.4716L9.35378 2.05321C8.59803 1.29552 9.13328 0 10.2021 0H45.7979C46.8667 0 47.402 1.29552 46.6462 2.05321L29.2724 19.4716C28.5697 20.1761 27.4303 20.1761 26.7276 19.4716Z"
          fill="url(#paint0_linear_1504_716)"
        />
      </g>

      <defs>
        <filter
          id="filter0_d_1504_716"
          x="0"
          y="0"
          width="56"
          height="39"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset dy="10" />
          <feGaussianBlur stdDeviation="4.5" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.126615 0 0 0 0 0.920833 0 0 0 0 0.87318 0 0 0 0.25 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1504_716" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1504_716" result="shape" />
        </filter>

        <linearGradient
          id="paint0_linear_1504_716"
          x1="5.4324"
          y1="-4.46643"
          x2="62.6254"
          y2="38.6853"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#7E5BFD" />
          <stop offset="1" stopColor="#21F479" />
        </linearGradient>
      </defs>
    </svg>
  </Icon>
);
