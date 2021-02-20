import { config } from '@lib/config';
import { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from 'fastify';
import { RouteGenericInterface } from 'fastify/types/route';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { stripToken } from './tokens';

const cookieOptions: any = {
  path: '/',
  signed: false,
};

// Fetch Authorization Token
export const retrieveAuthToken = (
    request: FastifyRequest
): string => {
  const tokenIdent = config.auth.authTokenKey || '_AID';
  if (request && request.cookies && request.cookies.hasOwnProperty(tokenIdent)) {
    const cookieToken = request.cookies[tokenIdent] || '';
    if (cookieToken) {
      return cookieToken;
    }
  }

  const authHeader = request.headers['authorization'];
  if (!authHeader) {
    return '';
  }
  const [scheme, token] = authHeader.split(/\s+/);

  if (scheme.toLowerCase() !== 'bearer') {
    return '';
  }
  request.log.debug(scheme, token);
  return token;
};

export const setAuthToken = (
    request: FastifyRequest<RouteGenericInterface, Server, IncomingMessage>,
    reply: FastifyReply<Server, IncomingMessage, ServerResponse, RouteGenericInterface, unknown>,
    token: string,
    rememberme: boolean = false
): void => {
  let cookieSupport = false;

  try {
    if (request.cookies && request.cookies.hasOwnProperty('cookieSupport')) {
      cookieSupport = true;
    }
  } catch (err) {
    cookieSupport = false;
  }


  if (rememberme) {
    cookieOptions.expires = new Date(new Date().setFullYear(new Date().getFullYear() + 2));
  }

  const authToken = stripToken(token);
  if (cookieSupport) {
    request.cookies[(config.auth.authTokenKey || '_AID')] = authToken;
    reply.setCookie((config.auth.authTokenKey || '_AID'), authToken, cookieOptions);
  } else {
    request.headers['authorization'] = `Bearer ${authToken}`;
    reply.header('X-JWT', authToken);
  }
};

export const removeAuthToken = (
  request: FastifyRequest<RouteGenericInterface, Server, IncomingMessage>,
  reply: FastifyReply<Server, IncomingMessage, ServerResponse, RouteGenericInterface, unknown>
): void => {
  let cookieSupport = false;

  try {
    if (request.cookies && request.cookies.hasOwnProperty('cookieSupport')) {
      cookieSupport = true;
    }
  } catch (err) {
    cookieSupport = false;
  }

  if (cookieSupport) {
    request.cookies[(config.auth.authTokenKey || '_AID')] = '';
    reply.clearCookie((config.auth.authTokenKey || '_AID'), cookieOptions);
  }

  request.headers['authorization'] = '';
  reply.header('X-JWT', '');
};

export const splitBearerToken = (credential: string): string => {
  const parts = credential.trim().split(' ') || [];
  if (parts.length === 2) {
    const scheme = parts[0];
    const token = parts[1];

    if (/^Bearer$/i.test(scheme)) {
      return token;
    } else {
      return '';
    }
  } else {
    return '';
  }
};
