import { useEffect, useState } from 'react';

import { Box, Flex, Icon } from '@chakra-ui/react';
import { BiCheckbox, BiCheckboxChecked } from 'react-icons/bi';

type FilterCheckboxProps = {
  label: string;
  name: string;
  defaultValue?: any;
  updateValue: (e?: any) => any;
  options?: { label: string; value: any }[];
};

export const FilterCheckbox = ({ label, name, defaultValue, options, updateValue }: FilterCheckboxProps) => {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const checkValue = (val?: any) => {
    setValue(val);

    updateValue({ [name]: val });
  };

  return (
    <Flex w="100%" direction="column" gap="12px">
      <Box as="label" fontSize="14px" lineHeight="16px" fontWeight="bold">
        {label}
      </Box>

      <Flex direction="column" gap="16px">
        {options?.map((opt) => (
          <Flex
            gap="8px"
            align="center"
            overflow="hidden"
            cursor="pointer"
            onClick={() => checkValue(opt.value === value ? null : opt.value)}
          >
            <Icon as={opt.value === value ? BiCheckboxChecked : BiCheckbox} boxSize="24px" color="gray_4" />

            <Box
              w="100%"
              fontWeight="medium"
              fontSize="15px"
              lineHeight="18px"
              overflow="hidden"
              whiteSpace="nowrap"
              textOverflow="ellipsis"
            >
              {opt.label}
            </Box>
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
};
