import { User } from '../../users/user.entity';
import { AppDataSource } from '../../data-source';
import { AuthController } from '../auth.controller';
import App from '../../app';
import * as request from 'supertest';

jest.mock('../../data-source', () => {
  return {
    AppDataSource: {
      initialize: jest.fn().mockReturnValue({}),
      getRepository: jest.fn().mockReturnValue({
        findOne: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
      }),
    }
  }
});

describe('AuthController', () => {
  describe('POST /auth/register', () => {
    describe('if the email is not taken', () => {
      it('response should have the set-cookie header with the authorization token', async () => {
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
        process.env.JWT_SECRET = '12345';
        const app = new App([
          new AuthController(),
        ], 5000);
        return request(app.getServer())
          .post(`/auth/register`)
          .send(newUser)
          .expect('Set-Cookie', /^Authorization=.+/);
      });
    });
  });
});