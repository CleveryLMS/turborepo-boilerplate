import { UserRolEnum } from '../..';
import { IAdminConfig } from './admin.config';

type IConfig = {
  admin: IAdminConfig;
};

const RolConfig: IConfig = {
  admin: {
    CLIENTES_SHOW: {
      label: 'Activar página de clientes',
      value: true,
    },
  },
};

export const AdminConfig = {
  [UserRolEnum.ADMIN]: RolConfig,
  [UserRolEnum.SUPERVISOR]: RolConfig,
  [UserRolEnum.PROFESOR]: RolConfig,
  [UserRolEnum.EDITOR]: RolConfig,
  [UserRolEnum.ESTUDIANTE]: RolConfig,
};
