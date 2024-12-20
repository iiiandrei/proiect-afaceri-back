import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { AnnouncementEntity } from './announcement.entity';

@Entity({ name: 'user_basket_items' })
export class UserBasketEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'announcement_id', type: 'bigint' })
  announcementId: number;

  @Column({ name: 'user_id', type: 'bigint' })
  userId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => AnnouncementEntity, (announcement) => announcement.files)
  @JoinColumn({ name: 'announcement_id' })
  announcement: AnnouncementEntity;

  @ManyToOne(() => UserEntity, (user) => user.announcements)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
