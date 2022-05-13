import { IUser, ApiItem } from '..';

export interface IAnalitica extends ApiItem {
  grupo: number;
  campanya: number;
  palabraClave: number;
}
