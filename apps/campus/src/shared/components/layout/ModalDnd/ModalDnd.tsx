import { useCallback, useEffect, useState } from 'react';

import { Box, Flex, Icon } from '@chakra-ui/react';
import { BiX, BiGridAlt, BiWindows, BiWindow } from 'react-icons/bi';

type Border =
  | 'left'
  | 'top'
  | 'right'
  | 'bottom'
  | 'bottomleftCorner'
  | 'bottomRightCorner';

let anchor = { x: 0, y: 0 };

interface ModalDndProps {
  isOpen: boolean;
  titulo: string;
  onClose: () => void;
  children?: React.ReactNode;
}

export const ModalDnd = ({
  isOpen,
  titulo,
  onClose,
  ...props
}: ModalDndProps) => {
  const [isMaximized, setIsMaximized] = useState<boolean>(false);

  const [x, setX] = useState<number>(window.innerWidth - 580 - 50);
  const [y, setY] = useState<number>(80);
  const [h, setH] = useState<number>(580);
  const [w, setW] = useState<number>(580);

  const handleMouseMove = useCallback((e) => move(e, anchor), []);
  const handleResizeLB = useCallback((e) => resizeLB(e, anchor), []);
  const handleResizeRB = useCallback((e) => resizeRB(e, anchor), []);
  const handleResizeL = useCallback((e) => resizeL(e, anchor), []);
  const handleResizeR = useCallback((e) => resizeR(e, anchor), []);
  const handleResizeB = useCallback((e) => resizeB(e, anchor), []);

  useEffect(() => {
    setX(window.innerWidth - 580 - 50);
    setY(80);
    setH(580);
    setW(580);
  }, [isOpen]);

  const move = (e: any, anchor: { x: number; y: number }) => {
    setX(Math.max(0, e.pageX - anchor.x));
    setY(Math.max(0, e.pageY - anchor.y));
    window.addEventListener(
      'mouseup',
      () => {
        window.removeEventListener('mousemove', handleMouseMove);
      },
      { once: true }
    );
  };

  /* RESIZE */
  const resizeLB = (e: any, anchor: { x: number; y: number }) => {
    if (
      anchor.x - e.pageX > 580 &&
      anchor.x - e.pageX < window.innerWidth - 50
    ) {
      setX(e.pageX);
      setW(anchor.x - e.pageX);
    }
    setH(Math.max(580, e.pageY - anchor.y));
    window.addEventListener(
      'mouseup',
      () => {
        window.removeEventListener('mousemove', handleResizeLB);
      },
      { once: true }
    );
  };

  const resizeRB = (e: any, anchor: { x: number; y: number }) => {
    setW(Math.max(580, e.pageX - anchor.x));
    setH(Math.max(580, e.pageY - anchor.y));
    window.addEventListener(
      'mouseup',
      () => {
        window.removeEventListener('mousemove', handleResizeRB);
      },
      { once: true }
    );
  };

  const resizeL = (e: any, anchor: { x: number; y: number }) => {
    if (anchor.x - e.pageX > 580) {
      setX(e.pageX);
      setW(anchor.x - e.pageX);
    }
    window.addEventListener(
      'mouseup',
      () => {
        window.removeEventListener('mousemove', handleResizeL);
      },
      { once: true }
    );
  };

  const resizeR = (e: any, anchor: { x: number; y: number }) => {
    setW(Math.max(580, e.pageX - anchor.x));
    window.addEventListener(
      'mouseup',
      () => {
        window.removeEventListener('mousemove', handleResizeR);
      },
      { once: true }
    );
  };

  const resizeB = (e: any, anchor: { x: number; y: number }) => {
    setH(Math.max(580, e.pageY - anchor.y));
    window.addEventListener(
      'mouseup',
      () => {
        window.removeEventListener('mousemove', handleResizeB);
      },
      { once: true }
    );
  };

  /* END RESIZE */

  const handleMouseDown = async (e: any) => {
    anchor = { x: e.nativeEvent.pageX - x, y: e.nativeEvent.pageY - y };
    window.addEventListener('mousemove', handleMouseMove);
  };

  const handleDoubleClick = () => {
    setW(580);
    setH(580);
  };

  const onResizeMouseDown = (border: Border) => {
    switch (border) {
      case 'bottomleftCorner':
        anchor = { x: x + w, y: y };
        window.addEventListener('mousemove', handleResizeLB);
        break;
      case 'bottomRightCorner':
        anchor = { x: x, y: y };
        window.addEventListener('mousemove', handleResizeRB);
        break;
      case 'left':
        anchor = { x: x + w, y: y };
        window.addEventListener('mousemove', handleResizeL);
        break;
      case 'right':
        anchor = { x: x, y: y };
        window.addEventListener('mousemove', handleResizeR);
        break;
      case 'bottom':
        anchor = { x: x, y: y };
        window.addEventListener('mousemove', handleResizeB);
        break;
    }
  };

  return (
    <Flex
      h={isMaximized ? '100%' : h}
      w={isMaximized ? '100%' : w}
      minH="580px"
      bg="white"
      rounded={isMaximized ? '0px' : '20px'}
      top={`${isMaximized ? 0 : y}px`}
      left={`${isMaximized ? 0 : x}px`}
      position="fixed"
      direction="column"
      display={isOpen ? 'flex' : 'none'}
      boxShadow="0px 4px 29px rgba(0, 0, 0, 0.25)"
      zIndex="100"
    >
      <Flex
        w="100%"
        bg="black"
        gap="16px"
        p="12px 20px"
        color="white"
        align="center"
        cursor={isMaximized ? 'default' : 'pointer'}
        roundedTop={isMaximized ? '0px' : '20px'}
        onMouseDown={isMaximized ? () => {} : handleMouseDown}
        onDoubleClick={handleDoubleClick}
      >
        <Icon as={BiGridAlt} boxSize="24px" />

        <Box fontSize="14px" fontWeight="bold" lineHeight="17px">
          {titulo}
        </Box>

        <Flex align="center" ml="auto">
          <Icon
            cursor="pointer"
            as={isMaximized ? BiWindows : BiWindow}
            color="gray_4"
            boxSize="26px"
            onClick={() => setIsMaximized(!isMaximized)}
          />
          <Icon
            cursor="pointer"
            as={BiX}
            color="gray_4"
            boxSize="32px"
            onClick={onClose}
          />
        </Flex>
      </Flex>

      {props.children}

      {!isMaximized && (
        <>
          <Box
            onMouseDown={() => onResizeMouseDown('left')}
            cursor="ew-resize"
            position="absolute"
            left="-10px"
            bottom="-10px"
            top="-10px"
            w="20px"
          />
          <Box
            onMouseDown={() => onResizeMouseDown('right')}
            cursor="ew-resize"
            position="absolute"
            right="-10px"
            bottom="-10px"
            top="-10px"
            w="20px"
          />
          <Box
            onMouseDown={() => onResizeMouseDown('bottom')}
            cursor="ns-resize"
            position="absolute"
            right="-10px"
            bottom="-10px"
            left="-10px"
            h="20px"
          />
          <Box
            onMouseDown={() => onResizeMouseDown('bottomleftCorner')}
            cursor="nesw-resize"
            position="absolute"
            left="-10px"
            bottom="-10px"
            h="30px"
            w="30px"
          />
          <Box
            onMouseDown={() => onResizeMouseDown('bottomRightCorner')}
            cursor="nwse-resize"
            position="absolute"
            right="-10px"
            bottom="-10px"
            h="30px"
            w="30px"
          />
        </>
      )}
    </Flex>
  );
};
