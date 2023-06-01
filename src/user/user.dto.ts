import { IsString, ValidateNested, IsOptional } from 'class-validator';
import CreateAddressDto from './addrss.dto';

class CreateUserDto {
  @IsString()
  public email: string;

  @IsString()
  public name: string;

  @IsString()
  public password: string;

  @IsOptional()
  @ValidateNested()
  public address?: CreateAddressDto;
}

export default CreateUserDto;