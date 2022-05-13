import { useEffect, useState } from 'react';

import { Menu as ChakraMenu, MenuButton, Icon, IconButton, MenuList, MenuItem, Portal } from '@chakra-ui/react';

import { BiSlider } from 'react-icons/bi';

interface ItemProps {
  icon?: any;
  label: string;
  disabled?: boolean;
  onClick?: () => void | any;
}

interface MenuProps {
  icon?: any;
  items: ItemProps[];
  className?: string;
}

export const Menu = ({ icon = BiSlider, items = [], className }: MenuProps) => {
  const [_items, setItems] = useState<ItemProps[]>(items);

  useEffect(() => {
    setItems(items);
  }, [items]);

  return (
    <ChakraMenu closeOnSelect={true} isLazy>
      <MenuButton as={IconButton} className={className} onClick={(e) => e.stopPropagation()} icon={<Icon color="gray_4" as={icon} boxSize="21px" />} />

      <Portal>
        <MenuList zIndex={1000} p="10px 0px" maxH="380px" w="fit-content" overflowY="auto" rounded="8px" color="black" bg="white" boxShadow={'0px 10px 30px rgba(1, 20, 52, 0.2)'}>
          {_items?.map((item: ItemProps, index: number) => (
            <MenuItem
              key={`menu-item-${index}`}
              icon={<Icon color="gray_4" as={item.icon} boxSize="19px" />}
              isDisabled={item.disabled}
              onClick={(e) => {
                e.stopPropagation();

                if (item.onClick) item.onClick();
              }}
            >
              {item.label}
            </MenuItem>
          ))}
        </MenuList>
      </Portal>
    </ChakraMenu>
  );
};
