import { IsString } from 'class-validator';

class CreatePostDto {
  @IsString()
  authorId: string;

  @IsString()
  title: string;

  @IsString()
  content: string;
}

export default CreatePostDto;