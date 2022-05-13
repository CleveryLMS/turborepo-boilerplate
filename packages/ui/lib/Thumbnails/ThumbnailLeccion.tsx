import React from 'react';
import { Flex, Text } from '@chakra-ui/react';

import { ICurso, ILeccion } from 'data';

import BgUno from './Backgrounds/background_uno.svg';
import BgDos from './Backgrounds/background_dos.svg';
import BgTres from './Backgrounds/background_tres.svg';

import './ThumbnailLeccion.scss';

export enum ThumbnailSizeEnum {
  MINI = 'mini',
  FULL = 'full',
}

export const ThumbnailLeccion = ({
  moduloNumber,
  leccionNumber,
  leccion,
  size,
  curso,
}: {
  moduloNumber?: number;
  leccionNumber?: number;
  leccion?: ILeccion;
  curso?: ICurso;
  size: any;
}) => {
  const backgroundSelect = (id: any) => {
    if (/[1-3]+$/.test(id)) return BgArray[0];
    else if (/[4-7]+$/.test(id)) return BgArray[1];
    else return BgArray[2];
  };

  return (
    <Flex
      id="thumbnail_leccion"
      bg="#110F33"
      boxSize="100%"
      align="center"
      justify="center"
      style={{
        backgroundSize: 'cover',
        backgroundImage: `url(${backgroundSelect(leccion?.id)})`,
      }}
    >
      {/* TODO:  ENVOLVER TEXT EN SVG */}
      <Flex direction="column" justify="center" align="center" boxSize="100%">
        <Text
          bgGradient="linear(to-l, #1DEE8A, #3544E1)"
          bgClip="text"
          fontSize={size === ThumbnailSizeEnum.FULL ? '' : { base: '16px', md: '11px' }}
          fontWeight="bold"
          lineHeight="auto"
          userSelect="none"
        >
          {curso?.titulo || ''}
        </Text>
        <Flex
          wrap="wrap"
          color="#FFFF"
          fontWeight="bold"
          userSelect="none"
          fontSize={size === ThumbnailSizeEnum.FULL ? '' : { base: '18px', md: '12px' }}
        >{`${moduloNumber || ''}.${leccionNumber || ''}.${leccion?.titulo || ''}`}</Flex>{' '}
      </Flex>
    </Flex>
  );
};

const BgArray = [BgUno, BgDos, BgTres];
