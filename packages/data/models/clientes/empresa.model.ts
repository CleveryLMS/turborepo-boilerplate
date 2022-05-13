import { ApiItem } from '../common.model';

import { AdminConfig } from '../config/admin';
import { CampusConfig } from '../config/campus';

export interface IEmpresa extends ApiItem {
  nombre: string;
  cif: string;

  email: string;
  sector: string;
  telefono: string;
  personaContacto: string;

  configAdmin?: typeof AdminConfig;
  configCampus?: typeof CampusConfig;
}
