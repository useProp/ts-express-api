import { IsString } from 'class-validator';

class CreateAddressDto {
  @IsString()
  public city: string;

  @IsString()
  public street: string;
}

export default CreateAddressDto;