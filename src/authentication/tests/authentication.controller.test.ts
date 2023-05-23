import * as request from 'supertest';
import CreateUserDto from '../../user/user.dto';
import PgDataSource from '../../pg-data-source';
import App from '../../app';
import AuthenticationController from '../authentication.controller';
import * as process from 'process';

(PgDataSource as any).getRepository = jest.fn();

describe('Authentication controller', () => {

  describe('POST /auth/register', () => {

    describe('if the email is not taken', () => {
      it('should have an Authorization cookie in response', () => {
        const userData: CreateUserDto = {
          address: null,
          email: 'test@mail.com',
          name: 'test',
          password: '12345',
        };
        process.env.JWT_SECRET = 'jwt-secret';
        (PgDataSource as any).getRepository.mockReturnValue({
          findOneBy: () => Promise.resolve(null),
          create: () => ({
            ...userData,
            id: 0,
          }),
          save: () => Promise.resolve(),
        });
        const authController = new AuthenticationController();
        const app = new App([
          authController,
        ]);
        return request(app.getServer())
          .post(`${authController.path}/register`)
          .send(userData)
          .expect('Set-Cookie', /^Authorization=.+/);
      });
    });

  });

});