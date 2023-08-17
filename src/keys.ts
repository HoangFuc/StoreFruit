import {TokenService, UserService} from '@loopback/authentication';
import {BindingKey} from '@loopback/core';
import {Account} from './models';
import {Credentials} from './repositories';
import {PasswordHasher} from './services/hashPassword.service';

export namespace TokenServiceConstants {
  export const TOKEN_SECRET_VALUE = '138asda8213';
  export const TOKEN_EXPIRES_IN_VALUE = '7h';
}
export namespace TokenServiceBindings {
  export const TOKEN_SECRET = BindingKey.create<string>(
    'authentication.jwt.secret',
  );
  export const TOKEN_EXPIRES_IN = BindingKey.create<string>(
    'authentication.jwt.expiresIn',
  );
  export const TOKEN_SERVICE = BindingKey.create<TokenService>(
    'services.authentication.jwt.tokenservice',
  );
}

export namespace PasswordHasherBindings {
  export const PASSWORD_HASHER = BindingKey.create<PasswordHasher>(
    'services.hasher',
  );
  export const ROUNDS = BindingKey.create<number>('services.hasher.rounds');
}

export namespace UserServiceBindings {
  export const USER_SERVICE = BindingKey.create<UserService<Account, Credentials>>(
    'services.user.service',
  );
}


export const RESOURCE_ID = BindingKey.create<string>('resourceId');
