import { IsString } from '_core/_auth/_middlewares/class-validator';

class CreateAddressDto {
  @IsString()
  public street: string;
  @IsString()
  public city: string;
  @IsString()
  public country: string;
}

export default CreateAddressDto;
