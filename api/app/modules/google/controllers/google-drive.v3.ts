import { GoogleRequests } from '@lib/google';

export const setupFileWatch = (gReq: GoogleRequests) =>
  gReq.tokens.token.then(token => {
    const url = `/drive/v3/changes`;
    return gReq.getRequest(token, 'www.googleapis.com', url);
  });
