import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ImageEntity } from './entities/image.entity';
import { UserEntity } from '../auth/entities/user.entity';
import { DefaultImageEntity } from '../auth/entities/default-image.entity';

@Injectable()
export class ImageRepository extends Repository<ImageEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(ImageEntity, dataSource.createEntityManager());
  }

  async changeUserAvatar(): Promise<void> {
    // get all users
    const users = await this.dataSource.getRepository(UserEntity).find();

    // get all default images
    const defaultImages = await this.dataSource
      .getRepository(DefaultImageEntity)
      .find();

    // set user avatar to default image if avatar equals default image id
    for (const user of users) {
      const randomDefaultImage =
        defaultImages[Math.floor(Math.random() * defaultImages.length)];
      user.avatarUrl = randomDefaultImage.url;
      console.log('user', user.avatarUrl);
      await this.dataSource.getRepository(UserEntity).save(user);
    }
  }
}
