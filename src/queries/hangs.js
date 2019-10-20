import { me, upcomingHangs, hangTypes } from './fragments';

export const getUpcomingHangs = `query {
  ${me}
  ${upcomingHangs}
}`;

export const getMyHangs = `query getMyHangs($startBefore: ISO8601DateTime, $startAfter: ISO8601DateTime){
  ${me}
  myHangs(startBefore: $startBefore, startAfter: $startAfter) {
    id,
    startAt,
    endAt,
    hangParticipants {
      id,
      user { username }
    }
    hangType {
      name,
      hangSubscriptions {
        user { username }
      }
    }
  }
  ${hangTypes}
}`;
