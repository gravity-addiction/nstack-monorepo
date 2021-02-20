import httpCodes from '@inip/http-codes';
import { FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify';

export const awsKeySecretGet: RouteHandlerMethod = async (
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

      const query = req.query || {},
            key = query.key || '';

      AwsCmdKeys.getAWSKeySecret(userId, key).
      then(results => {
        if (results[0]) { throw results[0]; }
        res.status(200).json(results[1]);
      }).catch(err => {
        res.status(500).json({error: err});
      });

    }
    */

  reply.code(httpCodes.OK);
  return {};
};
