export const me = `me { id, username }`;

export const upcomingHangs = `upcomingHangs {
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
}`;

export const hangTypes = `hangTypes {
  id,
  name,
  hangSubscriptions {
    user { username }
  }
}`
