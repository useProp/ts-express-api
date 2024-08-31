import { AuthService } from '../auth.service';
import { TokenData } from '../../interfaces/tokenData.interface';
import { AppDataSource } from '../../data-source';
import { User } from '../../users/user.entity';
import { HttpException } from '../../exceptions/http.exception';

jest.mock('../../data-source', () => {
  return {
    AppDataSource: {
      getRepository: jest.fn().mockReturnValue({
        findOne: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
      }),
    }
  }
});

describe('AuthorizationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('when cookie is created', () => {
    const tokenData: TokenData = {
      token: '',
      expiresIn: 1,
    }
    it('should return a string', () => {
      const authService = new AuthService();
      expect(typeof authService.createCookie(tokenData)).toEqual('string');
    });
  });

  describe('when registering a user', () => {
    describe('if the email is already taken', () => {
      it('should throw an error', async () => {
        const newUser = new User();
        newUser.name = 'User';
        newUser.email = 'email@email.com';
        newUser.password = '12345';
        (AppDataSource.getRepository(User).findOne as jest.Mock)
          .mockResolvedValue(newUser);
        const authService = new AuthService();
        await expect(authService.register(newUser))
          .rejects
          .toMatchObject(new HttpException(400, 'Email already in use'));

      });
    });

    describe('if the email is not taken', () => {
      it('should not throw an error', async () => {
        const newUser = new User();
        newUser.name = 'User';
        newUser.email = 'email@email.com';
        newUser.password = '12345';
        (AppDataSource.getRepository(User).findOne as jest.Mock)
          .mockReturnValue(null);
        (AppDataSource.getRepository(User).create as jest.Mock)
          .mockReturnValue({
            ...newUser,
            id: 0,
          });
        (AppDataSource.getRepository(User).save as jest.Mock)
          .mockReturnValue(Promise.resolve());
        const authService = new AuthService();
        process.env.JWT_SECRET = '12345';
        await expect(authService.register(newUser))
          .resolves
          .toBeDefined();
      });
    });
  });
});
