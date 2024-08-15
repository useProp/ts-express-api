import { IsString } from 'class-validator';

export class CreateAddressDto {
  @IsString()
  city: string;

  @IsString()
  street: string;
}