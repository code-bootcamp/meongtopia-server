import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { StoreTag } from 'src/apis/storesTags/entities/storeTag.entity';
import { StrLocationTag } from 'src/apis/strLocationsTags/entities/strLocationTag.entity';
import { User } from 'src/apis/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  // JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  // OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Store {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  storeID: string;

  @Column({ type: 'varchar', length: 20, unique: true, nullable: false })
  @Field(() => String)
  name: string;

  @Column()
  @Field(() => String)
  description: string;

  @Column()
  @Field(() => Int)
  entranceFee: number;

  @Column()
  @Field(() => String)
  phone: string;

  @Column()
  @Field(() => Int)
  bigDog: number;

  @Column()
  @Field(() => Int)
  smallDog: number;

  @Column()
  @Field(() => String)
  open: string;

  @Column()
  @Field(() => String)
  close: string;

  @Column()
  @Field(() => String)
  address: string;

  @Column()
  @Field(() => String)
  addressDetail: string;

  @Column({ default: 5, type: 'float' })
  @Field(() => Float)
  avgRating: number;

  @Column()
  @Field(() => String)
  menuImg: string;

  @DeleteDateColumn()
  deletedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => StrLocationTag)
  @Field(() => StrLocationTag)
  locationTag: StrLocationTag;

  //배포할때
  // @JoinColumn()
  // @OneToOne(() => User)
  // @Field(() => User)
  // user: User;
  //테스트용
  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  @JoinTable()
  @ManyToMany(() => StoreTag, (storeTag) => storeTag.store)
  @Field(() => [StoreTag])
  storeTag: StoreTag[];
}
