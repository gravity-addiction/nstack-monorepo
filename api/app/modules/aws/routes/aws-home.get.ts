import httpCodes from '@inip/http-codes';
import { FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify';


export const awsHomeGet: RouteHandlerMethod = async (
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
    (req: Request, res: Response) => {
      const userId = Tokens.getTokenInfo(req, res).user;

      if (!userId) {
        return res.status(404).json({error: 'No User Supplied'});
      }

      Promise.all([
        AwsCmdHome.getHomeUser(userId),
        AwsCmdKeys.getAWSKeys(userId)
      ]).
      then(([homeResult, keyResult]) => {
        if (homeResult[0]) { throw homeResult[0]; }
        if (keyResult[0]) { throw keyResult[0]; }
        try { homeResult[1].keys = keyResult[1]; } catch (e) { }
        res.status(200).json(homeResult[1]);
      }).catch(err => {
        res.status(500).json({error: err});
      });
    }
*/
  reply.code(httpCodes.OK);
  return {};
};
