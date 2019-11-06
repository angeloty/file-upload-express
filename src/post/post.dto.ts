import { IsString } from '_core/_auth/_middlewares/class-validator';

class CreatePostDto {
  @IsString()
  public content: string;

  @IsString()
  public title: string;
}

export default CreatePostDto;
