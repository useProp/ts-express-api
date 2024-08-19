import { IsString } from 'class-validator';

export class CreateAddressDto {
  @IsString()
  public country: string;

  @IsString()
  public city: string;

  @IsString()
  public street: string;
}