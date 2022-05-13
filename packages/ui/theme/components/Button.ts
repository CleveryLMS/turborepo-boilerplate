export const Button = {
  baseStyle: {
    h: 'auto',
    w: 'fit-content',
    p: '5px 20px',
    rounded: '8px',
    fontSize: '15px',
    fontWeight: 'bold',
    lineHeight: '18px',
  },
  variants: {
    default: { bg: 'gray_4', color: 'white' },
    disabled: { bg: 'var(--chakra-colors-gray_3)', color: 'white' },
    icon: { bg: 'gray_4', color: 'white', p: '5px 20px 5px 15px' },

    primary: { bg: 'primary', color: 'white' },
    primary_icon: { bg: 'primary', color: 'white', p: '5px 20px 5px 15px' },

    gray: { bg: 'var(--chakra-colors-gray_3)' },
    gray_icon: { bg: 'var(--chakra-colors-gray_3)', p: '5px 20px 5px 15px' },

    outline: { bg: 'white', border: '1px solid', borderColor: 'gray_3' },
    outline_icon: { bg: 'white', border: '1px solid', borderColor: 'gray_3', p: '5px 20px 5px 15px' },
  },
};
