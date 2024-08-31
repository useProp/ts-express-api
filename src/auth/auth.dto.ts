import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { CreateAddressDto } from '../addresses/address.dto';

export class RegisterDto {
  @IsString()
  public name: string;

  @IsString()
  public email: string;

  @IsString()
  public password: string;

  @IsOptional()
  @ValidateNested()
  public address?: CreateAddressDto;
}

export class LoginDto {
  @IsString()
  public email: string;

  @IsString()
  public password: string;
}

export class TwoFactorTokenDto {
  token: string;
}