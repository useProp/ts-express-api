import { IsString } from 'class-validator';

class TwoFactorAuthenticationDto {
  @IsString()
  twoFactorAuthenticationCode: string;
}

export default TwoFactorAuthenticationDto;