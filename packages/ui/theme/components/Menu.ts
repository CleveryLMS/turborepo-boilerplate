import { menuAnatomy as parts } from '@chakra-ui/anatomy';
import type { PartsStyleFunction, SystemStyleFunction, SystemStyleObject } from '@chakra-ui/theme-tools';

/** Estilo custom del menuList */
const baseStyleList: SystemStyleFunction = (props) => {
  return {
    bg: 'white',
    color: 'black',
  };
};

/** Estilo custom del menuItem */
const baseStyleItem: SystemStyleFunction = (props) => {
  return {
    color: 'gray_4',
    fontSize: '16px',
    fontWeight: 'bold',
    _hover: { bg: 'gray_1' },
    _focus: { bg: 'gray_1' },
  };
};

/** Estilo custom del menuButton */
const baseStyleButton: SystemStyleObject = {
  bg: 'gray_2',
  p: '5px 10px',
  rounded: '8px',
  _hover: { filter: 'brightness(90%)' },
};

const baseStyle: PartsStyleFunction<typeof parts> = (props) => ({
  button: baseStyleButton,
  list: baseStyleList(props),
  item: baseStyleItem(props),
});

export const Menu = {
  parts: parts.keys,
  baseStyle,
};
