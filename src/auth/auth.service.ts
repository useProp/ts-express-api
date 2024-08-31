import { AppDataSource } from '../data-source';
import { User } from '../users/user.entity';
import { HttpException } from '../exceptions/http.exception';
import * as bcrypt from 'bcrypt';
import { LoginDto, RegisterDto } from './auth.dto';
import * as jwt from 'jsonwebtoken';
import { TokenData } from '../interfaces/tokenData.interface';
import { Repository } from 'typeorm';

export class AuthService {
  private usersRepo: Repository<User>;

  constructor() {
    this.usersRepo = AppDataSource.getRepository(User);
  }

  public login = async (data: LoginDto) => {
    const foundUser = await this.usersRepo.findOne({ where: { email: data.email } });
    if (!foundUser) {
      throw new HttpException(403, 'Wrong Credentials');
    }

    const isPasswordValid = await bcrypt.compare(data.password, foundUser.password);
    if (!isPasswordValid) {
      throw new HttpException(403, 'Wrong Credentials');
    }

    const token = this.generateToken({ id: foundUser.id });

    return { token };
  }

  public register = async (data: RegisterDto) => {
    const foundUser = await this.usersRepo.findOne({ where: { email: data.email } });
    if (foundUser) {
      throw new HttpException(400, 'Email already in use');
    }

    const hashedPassword = bcrypt.hashSync(data.password, 10);
    const newUser = this.usersRepo.create({ ...data, password: hashedPassword });
    await this.usersRepo.save(newUser);
    delete newUser.password;

    const token = this.generateToken({ id: newUser.id });
    const cookie = this.createCookie({ token, expiresIn: 60 });

    return { newUser, token, cookie };
  }

  public generateToken = (payload: any): string => {
    const expiresIn = 60 * 60;
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
  }

  public createCookie = (data: TokenData): string => {
    return `Authorization=${data.token}; HttpOnly; Max-Age=${data.expiresIn}`;
  }
}