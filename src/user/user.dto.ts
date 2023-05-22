import { IsString, ValidateNested, IsOptional } from 'class-validator';
import CreateAddressDto from '../address/address.dto';

class CreateUserDto {
  @IsString()
  public email: string;

  @IsString()
  public name: string;

  @IsString()
  public password: string;

  @IsOptional()
  @ValidateNested()
  address: CreateAddressDto;
}

export default CreateUserDto;