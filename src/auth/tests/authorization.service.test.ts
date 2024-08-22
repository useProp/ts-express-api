import { AuthService } from '../auth.service';
import { TokenData } from '../../interfaces/tokenData.interface';
import * as typeorm from 'typeorm';
import { RegisterDto } from '../auth.dto';
import { User } from '../../users/user.entity';
import { HttpException } from '../../exceptions/http.exception';
import { AppDataSource } from '../../data-source';
import { Repository } from 'typeorm';

jest.mock("typeorm", () => ({
  ...(jest.requireActual("typeorm") as any),
  getRepository: jest.fn(),
}));

describe('AuthService', () => {
  describe('createCookie', () => {
    const tokenData: TokenData = {
      token: '',
      expiresIn: 60 * 60,
    };
    const authService = new AuthService();
    it('should be a string', () => {
      expect(typeof authService.createCookie(tokenData)).toEqual('string');
    });
  });

  describe('register', () => {
    let mockRepository: jest.Mocked<Repository<User>>;
    const userData: RegisterDto = {
      name: 'test',
      email: 'test@test.com',
      password: '12345',
    };

    beforeAll(() => {
      mockRepository = {
        findOne: jest.fn(() => Promise.resolve(userData)),
      } as any;
    });
    it('should return the error', async () => {
      const authService = new AuthService();
      await expect(authService.register(userData))
        .rejects
        .toMatchObject(new HttpException(400, `User already exists`));
    });
  })
});