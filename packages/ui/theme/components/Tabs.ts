import { tabsAnatomy as parts } from '@chakra-ui/anatomy';

export const Tabs = {
  parts: parts.keys,
  variants: {
    default: {
      root: { padding: '0px', width: '100%', height: '100%' },
      tablist: { gap: '40px', borderBottom: '2px solid', borderColor: 'gray_2' },
      tab: {
        padding: '0px',
        color: '#A9ACB5',
        fontSize: '14px',
        fontWeight: 'bold',
        lineHeight: '32px',
        borderBottom: '4px solid',
        borderColor: 'white',
        _selected: {
          color: 'black',
          borderBottom: '4px solid',
          borderColor: 'primary',
        },
      },
      tabpanels: { height: '100%' },
      tabpanel: {
        height: '100%',
        padding: '32px 0px 0px',
      },
    },
  },
};
