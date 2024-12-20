import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { UserBasketEntity } from './user-basket-item.entity';

@Entity({ name: 'announcements' })
export class AnnouncementEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'user_id', type: 'bigint' })
  userId: number;

  @Column()
  title: string;

  @Column()
  details: string;

  @Column()
  file: string;

  @Column()
  price: number;

  @Column({ name: 'phone_number' })
  phoneNumber: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.announcements)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @OneToMany(
    () => UserBasketEntity,
    (UserBasketEntity) => UserBasketEntity.announcement,
  )
  files: UserBasketEntity[];
}
