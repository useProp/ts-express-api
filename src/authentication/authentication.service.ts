import User from '../user/user.interface';
import CreateUserDto from '../user/user.dto';
import UserWithThatEmailAlreadyExistsException from '../exceptions/UserWithThatEmailAlreadyExists.exception';
import * as bcrypt from 'bcrypt';
import TokenData from '../interfaces/tokenData.interface';
import DataStoredInToken from '../interfaces/dataStoredInToken.interface';
import * as jwt from 'jsonwebtoken';
import LoginDto from './login.dto';
import WrongCredentialsException from '../exceptions/WrongCredentials.exception';
import UserService from '../user/user.service';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';
import { Response } from 'express';

class AuthenticationService {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public async registration (userData: CreateUserDto) {
    const isEmailAvailable = await this.userService.getOne({ email: userData.email });
    if (isEmailAvailable) {
      throw new UserWithThatEmailAlreadyExistsException(userData.email);
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = await this.userService.create({
      ...userData,
      password: hashedPassword,
    });

    const token = this.createToken(user);
    const cookie = this.createCookie(token);

    return { user, cookie }
  }

  public async login({ email, password }: LoginDto) {
    const user = await this.userService.getOne({ email });
    if (!user) {
      throw new WrongCredentialsException();
    }

    const isPasswordCorrect = bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new WrongCredentialsException();
    }

    delete user._doc.password;
    delete user._doc.twoFactorAuthenticationCode;

    const token = this.createToken(user);
    const cookie = this.createCookie(token);

    return { user, cookie }
  }

  public createToken(user: User, isTwoFactorAuthenticated = false): TokenData {
    const expiresIn = 60 * 60;
    const payload: DataStoredInToken = { id: user._id, isTwoFactorAuthenticated };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
    return {
      token,
      expiresIn,
    };
  }

  public createCookie({ token, expiresIn }: TokenData): string {
    return `Authorization=${token}; HttpOnly; Max-Age=${expiresIn}`;
  }

  public getTwoFactorAuthenticationCode = () => {
    const { otpauth_url, base32 } = speakeasy.generateSecret({
      name: process.env.TWO_FACTOR_AUTHENTICATION_APP_NAME,
    });
    return { otpauth_url, base32 };
  }

  public respondWithQRCode = async (response: Response, data: string) => {
    return QRCode.toFileStream(response, data);
  }

  public verifyTwoFactorAuthenticationCode = async (code: string, user: User ) => {
    const isCodeValid = speakeasy.totp.verify({
      secret: user.twoFactorAuthenticationCode,
      token: code,
      encoding: 'base32',
    });
    if (!isCodeValid) {
      throw new WrongCredentialsException();
    }
    return true;
  }

}

export default AuthenticationService;