import { CreateAddressDto } from '../addresses/address.dto';
import { IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  fullName: string;

  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsString()
  address?: CreateAddressDto;
}