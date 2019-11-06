import { IsString } from '_core/_auth/_middlewares/class-validator';

class LogInDto {
  @IsString()
  public email: string;

  @IsString()
  public password: string;
}

export default LogInDto;
