import { me, upcomingHangs, hangTypes, myHangs } from './fragments';

export const getUpcomingHangs = `query {
  ${me}
  ${upcomingHangs}
}`;

export const getMyHangs = `query getMyHangs {
  ${me}
  ${myHangs}
  ${hangTypes}
}`;
