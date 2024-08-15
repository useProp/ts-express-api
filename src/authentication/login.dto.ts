import { IsString } from 'class-validator';


export class LoginDto {
  @IsString()
  public email: string;

  @IsString()
  public password: string;
}