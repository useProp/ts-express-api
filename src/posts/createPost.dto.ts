import { IsString } from 'class-validator';

class CreatePostDto {
  @IsString()
  author: string;

  @IsString()
  title: string;

  @IsString()
  content: string;
}

export { CreatePostDto };