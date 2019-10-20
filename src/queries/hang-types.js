import { me, hangTypes } from './fragments';

export const getHangTypes = `query {
  ${me}
  ${hangTypes}
}`;
