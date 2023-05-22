import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import User from '../user/user.entity';

@Entity()
class Address {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column()
  public country: string;

  @Column()
  public city: string;

  @Column()
  public street: string;

  @OneToOne(() => User, (user: User) => user.address)
  public user: User;
}

export default Address;