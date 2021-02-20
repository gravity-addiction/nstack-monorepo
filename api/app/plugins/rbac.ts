// Original Code By: https://github.com/DeadAlready/easy-rbac.git
import { FastifyInstance } from 'fastify';

interface RBACObj {
  can: any;
  canGlob: any[];
  inherits: any[];
}

export const isMatch = (promises: any) => {
  if (promises.length < 1) {
    return Promise.resolve(false);
  }
  return Promise.all(
    promises.map(($p: any) =>
      $p
        .catch((err: any) =>
          /// debug('Underlying promise rejected', err);
          false
        )
        .then((result: any) => {
          if (result) {
            throw new Error('authorized');
          }
        })
    )
  )
    .then(() => false)
    .catch(err => err && err.message === 'authorized');
};

export const isGlob = (str: string) => str.includes('*');

export const globToRegex = (str: string) => new RegExp('^' + str.replace(/\*/g, '.*'));

export class RBAC {
  public roles: any;
  public _init: any;
  private _inited!: boolean;

  constructor(
    public fastify: FastifyInstance,
    roles: any
  ) {
    fastify.log.debug('RBAC Roles: %O', roles);
    this._inited = false;
    if (typeof roles !== 'function' && typeof roles.then !== 'function') {
      fastify.log.debug('sync init');
      // Add roles to class and mark as inited
      this.roles = this._parseRoleMap(roles);
      this._inited = true;
    } else {
      fastify.log.debug('async init');
      this._init = this.asyncInit(roles);
    }
  }

  _parseRoleMap(roles: any) {
    this.fastify.log.debug('parsing rolemap');
    // If not a function then should be object
    if (typeof roles !== 'object') {
      throw new TypeError('Expected input to be object');
    }

    const map = new Map();

    // Standardize roles
    Object.keys(roles).forEach(role => {
      const roleObj: RBACObj = {
        can: {},
        canGlob: [],
        inherits: [],
      };
      // Check can definition
      if (!Array.isArray(roles[role].can)) {
        throw new TypeError('Expected roles[' + role + '].can to be an array');
      }
      if (roles[role].inherits) {
        if (!Array.isArray(roles[role].inherits)) {
          throw new TypeError('Expected roles[' + role + '].inherits to be an array');
        }
        roleObj.inherits = [];
        roles[role].inherits.forEach((child: any) => {
          if (typeof child !== 'string') {
            throw new TypeError('Expected roles[' + role + '].inherits element');
          }
          if (!roles[child]) {
            throw new TypeError('Undefined inheritance role: ' + child);
          }
          roleObj.inherits.push(child);
        });
      }
      // Iterate allowed operations
      roles[role].can.forEach((operation: any) => {
        // If operation is string
        if (typeof operation === 'string') {
          // Add as an operation
          if (!isGlob(operation)) {
            roleObj.can[operation] = 1;
          } else {
            roleObj.canGlob.push({name: globToRegex(operation), original: operation});
          }
          return;
        }
        // Check if operation has a .when function
        if (typeof operation.when === 'function' && (typeof operation.name === 'string' || Array.isArray(operation.name))) {
          const arrNames = (typeof operation.name === 'string') ? [operation.name] : operation.name;
          arrNames.forEach((name: string) => {
            if (!isGlob(name)) {
              roleObj.can[name] = operation.when;
            } else {
              roleObj.canGlob.push({name: globToRegex(name), original: name, when: operation.when});
            }
          });
          return;
        }

        this.fastify.log.error('Unexpected Operation %s', operation);
        throw new TypeError('Unexpected operation type: ' + operation);
      });

      map.set(role, roleObj);
    });

    return map;
  }

  async asyncInit(roles: any) {
    // If opts is a function execute for async loading
    if (typeof roles === 'function') {
      roles = await roles();
    }
    if (typeof roles.then === 'function') {
      roles = await roles;
    }

    // Add roles to class and mark as inited
    this.roles = this._parseRoleMap(roles);
    this._inited = true;
  }

  async can(role: any, operation: string, params?: any): Promise<any> {

    // If not inited then wait until init finishes
    if (!this._inited) {
      this.fastify.log.debug('Not inited, wait');
      await this._init.catch((e: Error) => {
        this.fastify.log.error('Init Failed: %s', (e.message || ''));
        this.fastify.log.error(e.message);
        return false;
      });
      this.fastify.log.debug('Init complete, continue');
    }

    if (Array.isArray(role)) {
      this.fastify.log.trace('array of roles, try all');
      return isMatch(role.map(r => this.can(r, operation, params)));
    }

    if (typeof role !== 'string') {
      this.fastify.log.error('Expected first parameter to be string : role');
      return false;
    }

    if (typeof operation !== 'string') {
      this.fastify.log.error('Expected second parameter to be string : operation');
      return false;
    }

    const $role = this.roles.get(role);

    if (!$role) {
      if ($role !== '') {
        this.fastify.log.error('Undefined role');
      }
      return false;
    }

    // IF this operation is not defined at current level try higher
    if (!$role.can[operation] && !$role.canGlob.find((glob: any) => glob.name.test(operation))) {
      this.fastify.log.trace('Not allowed at this level, try higher');
      // If no parents reject
      if (!$role.inherits || $role.inherits.length < 1) {
        this.fastify.log.trace('No inherit, reject false');
        return false;
      }
      // Return if any parent resolves true or all reject
      return isMatch($role.inherits.map((parent: any) => {
        this.fastify.log.trace('Try from: %s', parent);
        return this.can(parent, operation, params);
      }));
    }

    // We have the operation resolve
    if ($role.can[operation] === 1) {
      this.fastify.log.trace('We have a match, resolve');
      return true;
    }

    // Operation is conditional, run async function
    if (typeof $role.can[operation] === 'function') {
      this.fastify.log.trace('Operation is conditional, run fn: %O', params);
      return await $role.can[operation](params).catch((e: Error) => {
        this.fastify.log.error('conditional fn threw: %s', (e.message || ''));
        this.fastify.log.error(e.message);
        return false;
      });
    }

    // Try globs
    const globMatch = $role.canGlob.find((glob: any) => glob.name.test(operation));
    if (globMatch && !globMatch.when) {
      this.fastify.log.trace(`We have a globmatch (${globMatch.original}), resolve`);
      return true;
    }

    if (globMatch && globMatch.when) {
      this.fastify.log.trace(`We have a conditional globmatch (${globMatch.original}), run fn`);
      return await globMatch.when(params).catch((e: Error) => {
        this.fastify.log.error('conditional function threw: %s', (e.message || ''));
        this.fastify.log.error(e.message);
        return false;
      });
    }

    // No operation reject as false
    this.fastify.log.error('Shouldnt have reached here, something wrong, reject');
    return false;
//    throw new Error('something went wrong');
  }
}
