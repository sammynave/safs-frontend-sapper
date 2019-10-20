import { upcomingHangs } from '../queries/fragments';

export const participateInHang = `mutation participateInHang($hangId: String!) {
    participateInHang(input: { hangId: $hangId }) {
      ${upcomingHangs}
    }
  }
`;

export const declineToParticipateInHang = `mutation declineToParticipateInHang($hangId: String!) {
    declineToParticipateInHang(input: { hangId: $hangId }) {
      ${upcomingHangs}
    }
  }
`;
