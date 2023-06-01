import { IsString } from 'class-validator';

class CreateAddressDto {
  @IsString()
  public country: string;

  @IsString()
  public city: string;

  @IsString()
  public street: string;
}

export default CreateAddressDto;