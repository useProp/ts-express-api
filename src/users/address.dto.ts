import { IsString } from 'class-validator';

export class CreateAddressDto {
  @IsString()
  country: string;

  @IsString()
  city: string;

  @IsString()
  street: string;
}