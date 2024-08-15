import { IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  public title: string;

  @IsString()
  public content: string;
}

export class PatchPostDto {
  @IsString()
  @IsOptional()
  public title?: string;

  @IsString()
  @IsOptional()
  public content?: string;
}