import httpCodes from '@inip/http-codes';
import { FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify';

export const awsLsVideoGet: RouteHandlerMethod = async (
    request: FastifyRequest,
    reply: FastifyReply
): Promise<any> => {

/*
[
      Tokens.validateToken,
      eRBAC.can(
        async (req: Request, res: Response) => UsersRegister.getRole(req, Tokens.getTokenInfo(req, res).user, 'users'),
        's3:cloud-home'
      )
    ],
    async (req: Request, res: Response) => {
      basicLs(req, res).then(lsResult => {
        if (lsResult[0]) { throw lsResult[0]; }

        if (lsResult[1].Contents && lsResult[1].Contents.length) {
          return VideoUtils.fetchVideoBatch(lsResult[1].Contents).
          then(vidResults => {
            if (vidResults[0]) { throw vidResults[0]; }
            lsResult[1].Contents = vidResults[1];
            return lsResult;
          }).catch(err => [err]);

        } else { return lsResult; }
      }).then(lsResult => {
        if (lsResult[0]) { throw lsResult[0]; }

        if (lsResult[1].CommonPrefixes && lsResult[1].CommonPrefixes.length) {
          const query = req.query || {},
          server = query.server || '';
          return VideoUtils.fetchFolderBatchS3(server, lsResult[1].Name, lsResult[1].Prefix, lsResult[1].CommonPrefixes).
          then(folResults => {
            if (folResults[0]) { throw folResults[0]; }
            lsResult[1].CommonPrefixes = folResults[1];
            return lsResult;
          }).catch(err => [err]);

        } else { return lsResult; }
      }).then(lsResult => {
        if (lsResult[0]) { throw lsResult[0]; }
        res.status(200).json(lsResult[1]);
      }).catch(err => {
        res.status(500).json({error: err});
      });
    }
*/


/* users */
/*
[
      Tokens.validateToken,
      eRBAC.can(
        async (req: Request, res: Response) => UsersRegister.getRole(req, Tokens.getTokenInfo(req, res).user, 'users'),
        's3:cloud-home'
      )
    ],
    async (req: Request, res: Response) => {
      const userId = Tokens.getTokenInfo(req, res).user;

      if (!userId) {
        return res.status(404).json({error: 'No User Supplied'});
      }

      const query = req.query || {},
            bucket = query.bucket || '',
            server = query.server || '',
            key = query.key || '',
            max = query.max || 0,
            startAfter = query.start_after || '',
            continueToken = query.cont || '';

      const userCreds = await AwsCmdKeys.getAWSRequestCreds(userId);
      if (userCreds[0]) {
        res.status(500).json({error: userCreds[0]});
        return;
      }

      // Set blank region by querystring, pry should be database specific later
      if (server && !userCreds[1].region) { userCreds[1].region = server; }

      AwsCmdS3.lsFolder(AwsKeys.S3(userCreds[1]), bucket, key, max, startAfter, continueToken).
      then(lsResult => {
        if (lsResult[0]) { throw lsResult[0]; }

        if (lsResult[1].Contents) {
          return VideoUtils.fetchVideoBatch(lsResult[1].Contents).
          then(vidResults => {
            if (vidResults[0]) { throw vidResults[0]; }
            lsResult[1].Contents = vidResults[1];
            return lsResult;
          }).catch(err => [err]);

        } else { return lsResult; }
      }).
      then(lsResult => {
        if (lsResult[0]) { throw lsResult[0]; }
        res.status(200).json(lsResult[1]);
      }).catch(err => {
        res.status(500).json({error: err});
      });
    }
    */

/* aws users */
/*
[
      Tokens.validateToken,
      eRBAC.can(
        async (req: Request, res: Response) => UsersRegister.getRole(req, Tokens.getTokenInfo(req, res).user, 'users'),
        's3:cloud-home'
      )
    ],
    async (req: Request, res: Response) => {
      const userId = Tokens.getTokenInfo(req, res).user;

      if (!userId) {
        return res.status(404).json({error: 'No User Supplied'});
      }

      const query = req.query || {},
            bucket = query.bucket || '',
            server = query.server || '',
            key = query.key || '',
            max = query.max || 0,
            startAfter = query.start_after || '',
            continueToken = query.cont || '';

      const userCreds = await AwsCmdKeys.getAWSRequestCreds(userId);
      if (userCreds[0]) {
        res.status(500).json({error: userCreds[0]});
        return;
      }

      // Set blank region by querystring, pry should be database specific later
      if (server && !userCreds[1].region) { userCreds[1].region = server; }

      AwsCmdS3.lsFolder(AwsKeys.S3(userCreds[1]), bucket, key, max, startAfter, continueToken).
      then(lsResult => {
        if (lsResult[0]) { throw lsResult[0]; }

        if (lsResult[1].Contents) {
          return VideoUtils.fetchVideoBatch(lsResult[1].Contents).
          then(vidResults => {
            if (vidResults[0]) { throw vidResults[0]; }
            lsResult[1].Contents = vidResults[1];
            return lsResult;
          }).catch(err => [err]);

        } else { return lsResult; }
      }).
      then(lsResult => {
        if (lsResult[0]) { throw lsResult[0]; }
        res.status(200).json(lsResult[1]);
      }).catch(err => {
        res.status(500).json({error: err});
      });
    }
*/
  reply.code(httpCodes.OK);
  return {};
};
