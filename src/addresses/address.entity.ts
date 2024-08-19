import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Address {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public country: string;

  @Column()
  public city: string;

  @Column()
  public street: string;

  @OneToOne(() => User, (user: User) => user.address)
  public user: User;
}
