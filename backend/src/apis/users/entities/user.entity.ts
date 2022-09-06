import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
// import { Store } from 'src/apis/stores/entities/store.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  // OneToMany,
  // JoinTable,
} from 'typeorm';

//enum
export enum USER_ROLE_ENUM {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  CLIENT = 'CLIENT',
}
//enum type 등록
registerEnumType(USER_ROLE_ENUM, {
  name: 'USER_ROLE_ENUM',
});

@ObjectType()
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  userID: string;

  @Column({ type: 'varchar', length: 20, unique: true, nullable: false })
  @Field(() => String)
  name?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  @Field(() => String)
  nickname?: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  @Field(() => String)
  email: string;

  @Column({ nullable: true })
  @Field(() => String)
  password?: string;

  @Column({ type: 'char', length: 11, nullable: true })
  @Field(() => String)
  phone: string;

  @Column({ type: 'int', unsigned: true, default: 0, nullable: true })
  @Field(() => Int)
  point?: number;

  @Column({ nullable: true })
  @Field(() => String)
  storeName?: string;

  @Column({ nullable: true })
  @Field(() => String)
  businessLicenseImg?: string;

  @Column({ nullable: true })
  @Field(() => String)
  profileImgUrl: string;

  @Column({ type: 'enum', enum: USER_ROLE_ENUM, nullable: true })
  @Field(() => USER_ROLE_ENUM)
  role?: string;

  @DeleteDateColumn()
  deletedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
