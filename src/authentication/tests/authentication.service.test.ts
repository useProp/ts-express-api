import AuthenticationService from '../authentication.service';
import CreateUserDto from '../../user/user.dto';
import UserWithThatEmailAlreadyExistsException from '../../exceptions/UserWithThatEmailAlreadyExists.exception';
import PgDataSource from '../../pg-data-source';
import * as process from 'process';
import TokenData from '../../interfaces/tokenData.interface';

(PgDataSource as any).getRepository = jest.fn();

describe('Authentication service', () => {

  describe('when creating a cookie', () => {
    it('should be a string', () => {
      const tokenData: TokenData = {
        token: '',
        expiresIn: 1,
      };
      (PgDataSource as any).getRepository.mockReturnValue({});
      const authService = new AuthenticationService();
      expect(typeof authService.createCookie(tokenData))
        .toEqual('string');
    })
  });

  describe('when registering a user', () => {
    describe('if the email is available', () => {
      it('should not throw an error', async () => {
        const userData: CreateUserDto = {
          name: 'test',
          email: 'test@mail.com',
          password: '12345',
          address: null,
        };
        (PgDataSource as any).getRepository.mockReturnValue({
          findOneBy: () => Promise.resolve(null),
          create: () => ({
            ...userData,
            id: 0,
          }),
          save: () => Promise.resolve(),
        });
        const authService = new AuthenticationService();
        process.env.JWT_SECRET = 'jwt-secret';
        await expect(authService.registration(userData))
          .resolves
          .toBeDefined();
      });
    });

    describe('if the email already in use', () => {
      it('should throw an error', async () => {
        const userData: CreateUserDto = {
          name: 'test',
          email: 'test@mail.com',
          password: '12345',
          address: null,
        };
        (PgDataSource as any).getRepository.mockReturnValue({
          findOneBy: () => Promise.resolve(userData)
        });
        const authService = new AuthenticationService();
        await expect(authService.registration(userData))
          .rejects
          .toMatchObject(new UserWithThatEmailAlreadyExistsException(userData.email));
      });
    });
  });
});
