import {UserService} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import {PasswordHasherBindings} from '../keys';
import {Account} from '../models';
import {AccountRepository, Credentials} from '../repositories';
import {BcryptHasher} from './hashPassword.service';

export class MyUserService implements UserService<Account, Credentials>{

  constructor(

    @repository(AccountRepository)
    public accountRepository: AccountRepository,

    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public hasher: BcryptHasher,

  ) { }

  async verifyCredentials(credentials: Credentials): Promise<Account> {

    const foundAccount = await this.accountRepository.findOne({
      where: {
        username: credentials.username,
      },
    });

    if (!foundAccount) throw new HttpErrors.NotFound('User not found')

    // const hash = await this.hasher.hashPassword(credentials.password);
    const passwordMatches = await this.hasher.comparePassword(
      credentials.password, foundAccount.password
    );
    console.log(foundAccount.password);
    // console.log(hash);
    console.log(passwordMatches);

    if (!passwordMatches) throw new HttpErrors.NotFound('Password is wrong!!')

    return foundAccount;
  }


  convertToUserProfile(account: Account): UserProfile {
    let name = '';
    if (account.username) name = account.username

    return {
      [securityId]: `${account.id}`,
      name: name,
      id: account.id,
    };
  }

}
