import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { Pet } from 'src/apis/pets/entities/pet.entity';
import { StoreImg } from 'src/apis/storesImgs/entities/storeImg.entity';
import { StoreTag } from 'src/apis/storesTags/entities/storeTag.entity';
import { StrLocationTag } from 'src/apis/strLocationsTags/entities/strLocationTag.entity';
import { User } from 'src/apis/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  // JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
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

  @Column({ type: 'varchar', nullable: false })
  @Field(() => String)
  name: string;

  @Column({ nullable: true })
  @Field(() => String)
  description: string;

  @Column({ nullable: true })
  @Field(() => Int)
  entranceFee: number;

  @Column({ nullable: true })
  @Field(() => String)
  phone: string;

  @Column({ nullable: true })
  @Field(() => Int)
  bigDog: number;

  @Column({ nullable: true })
  @Field(() => Int)
  smallDog: number;

  @Column({ nullable: true })
  @Field(() => String)
  open: string;

  @Column({ nullable: true })
  @Field(() => String)
  close: string;

  @Column({ nullable: true })
  @Field(() => String)
  address: string;

  @Column({ nullable: true })
  @Field(() => String)
  addressDetail: string;

  @Column({ default: 5.0, type: 'float', nullable: true })
  @Field(() => Float)
  avgRating: number;

  @Column({ nullable: true })
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

  @JoinColumn()
  @OneToMany(() => StoreImg, (storeImg) => storeImg.store)
  @Field(() => [StoreImg])
  storeImg: StoreImg[];

  @JoinColumn()
  @OneToMany(() => Pet, (pet) => pet.store)
  @Field(() => [Pet])
  pet: Pet[];

  //테스트용
  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  @JoinTable()
  @ManyToMany(() => StoreTag, (storeTag) => storeTag.store)
  @Field(() => [StoreTag])
  storeTag: StoreTag[];
}
