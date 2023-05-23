import PgDataSource from '../pg-data-source';
import User from '../user/user.entity';
import CreateUserDto from '../user/user.dto';
import UserWithThatEmailAlreadyExistsException from '../exceptions/UserWithThatEmailAlreadyExists.exception';
import * as bcrypt from 'bcrypt';
import TokenData from '../interfaces/tokenData.interface';
import DataStoredInToken from '../interfaces/dataStoredInToken.interface';
import * as jwt from 'jsonwebtoken';
import LoginDto from './login.dto';
import WrongCredentialsException from '../exceptions/WrongCredentials.exception';

class AuthenticationService {
  private userRepo = PgDataSource.getRepository(User);

  public async registration (userData: CreateUserDto) {
    const isEmailAvailable = await this.userRepo.findOneBy({ email: userData.email });
    if (isEmailAvailable) {
      throw new UserWithThatEmailAlreadyExistsException(userData.email);
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = this.userRepo.create({
      ...userData,
      password: hashedPassword,
    });
    await this.userRepo.save(user);

    const token = this.createToken(user);
    const cookie = this.createCookie(token);

    return { user, cookie }
  }

  public async login({ email, password }: LoginDto) {
    const user = await this.userRepo.findOneBy({ email });
    if (!user) {
      throw new WrongCredentialsException();
    }

    const isPasswordCorrect = bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new WrongCredentialsException();
    }

    const token = this.createToken(user);
    const cookie = this.createCookie(token);

    return { user, cookie }
  }

  public createToken(user: User): TokenData {
    const expiresIn = 60 * 60;
    const payload: DataStoredInToken = { id: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
    return {
      token,
      expiresIn,
    };
  }

  public createCookie({ token, expiresIn }: TokenData): string {
    return `Authorization=${token}; HttpOnly; Max-Age=${expiresIn}`;
  }
}

export default AuthenticationService;