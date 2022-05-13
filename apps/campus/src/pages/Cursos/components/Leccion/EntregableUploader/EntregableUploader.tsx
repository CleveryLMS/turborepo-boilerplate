import { Flex, Icon } from '@chakra-ui/react';

import { FilePondFile } from 'filepond';
import { FilePond } from 'react-filepond';

import { getItem } from 'data';
import { LOGIN_TOKEN } from 'data';

import './EntregableUploader.scss';
import 'filepond/dist/filepond.min.css';

export interface InformationFilepondProps {
  name: string;
  putEP: string;
  onLoad?: (response: any) => string;
  onUpdateFiles?: (files: FilePondFile[]) => void;
}

export const EntregableUploader = ({ name, putEP, onLoad, onUpdateFiles }: InformationFilepondProps) => {
  return (
    <Flex fontSize="14px" direction="column" w="100%">
      <FilePond
        className="filepond-entregableuploader"
        onupdatefiles={onUpdateFiles}
        name={name}
        labelIdle={`Sube tus archivos<br /><span class="filepond--label-action">O búscalos</span>`}
        server={{
          url: process.env.NX_API_URL,
          process: {
            url: putEP,
            method: 'PUT',
            headers: { Authorization: `Bearer ${getItem(LOGIN_TOKEN)}` },
            onerror: (error) => console.log({ error }),
            onload: onLoad,
          },
        }}
      />
    </Flex>
  );
};
