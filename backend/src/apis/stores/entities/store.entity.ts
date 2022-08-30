import { float } from '@elastic/elasticsearch/lib/api/types';
import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { Reservation } from 'src/apis/reservations/entities/reservation.entity';
import { Pick } from 'src/apis/storesPicks/entities/storePick.entity';
import { StoreTag } from 'src/apis/storesTags/entities/storeTag.entity';
import { User } from 'src/apis/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  // OneToMany,
  OneToOne,
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

  @Column({ nullable: true })
  @Field(() => Int)
  entranceFee: number;

  @Column()
  @Field(() => String)
  phone: string;

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
  detailedAddress: string;

  @Column({ default: 0 })
  @Field(() => Float)
  avgRating: float;

  @DeleteDateColumn()
  deletedAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  @ManyToOne(() => Reservation)
  @Field(() => Reservation)
  reservation: Reservation;

  @JoinTable()
  @OneToOne(() => Pick)
  @Field(() => Pick)
  pick: Pick;

  //   @JoinTable()
  //   @OneToMany(() => storeImage, (imgurl) => imgurl.stores)
  //   @Field(() => [String])
  //   imgurl: string[];

  @JoinTable()
  @ManyToMany(() => StoreTag, (storeTag) => storeTag.store)
  @Field(() => [StoreTag])
  storeTag: StoreTag[];
}
