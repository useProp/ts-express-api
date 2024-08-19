import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested
} from 'class-validator';

export class CategoryInPostDto {
  @IsNumber()
  public id: number;
}

export class CreatePostDto {
  @IsString()
  public title: string;

  @IsString()
  public content: string;

  @ValidateNested()
  public categories: CategoryInPostDto[];
}

export class UpdatePostDto {
  @IsString()
  @IsOptional()
  public title?: string;

  @IsString()
  @IsOptional()
  public content?: string;
}