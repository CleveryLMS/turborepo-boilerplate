import { Flex } from '@chakra-ui/react';
import { FilePond } from 'react-filepond';

import { getItem } from 'data';
import { LOGIN_TOKEN } from 'data';

import './AvatarUploader.scss';
import 'filepond/dist/filepond.min.css';

export const AvatarUploader = ({ name, putEP, onLoad }: { name: string; putEP: string; onLoad: (data: any) => any }) => {
  return (
    <Flex h="70px" fontSize="14px" direction="column" minW="240px" whiteSpace="nowrap" w="fit-content">
      <FilePond
        className="filepond-avataruploader"
        name={name}
        labelIdle="Subir una foto nueva"
        server={{
          url: process.env.NX_API_URL,
          process: {
            url: putEP,
            method: 'PUT',
            headers: { Authorization: `Bearer ${getItem(LOGIN_TOKEN)}` },
            onerror: (error) => console.log({ error }),
            onload: (data) => onLoad(data),
          },
        }}
      />
    </Flex>
  );
};
