import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import Post from '../post/post.entity';

@Entity()
class Category {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column()
  public name: string;

  @ManyToMany(() => Post, (post: Post) => post.categories)
  public posts: Post[];
}

export default Category;