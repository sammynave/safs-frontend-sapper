export const getUpcomingHangs = `query {
      me {
        id,
        username
      },
      upcomingHangs {
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
  }
`;
