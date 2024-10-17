import * as multer from 'multer';
import { BadRequestException } from '@nestjs/common';

export const multerConfig = {
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // Limit file size to 5MB
  },
  fileFilter: (
    req: any,
    file: { mimetype: string },
    cb: (arg0: Error, arg1: boolean) => void,
  ) => {
    // const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    // if (!allowedTypes.includes(file.mimetype)) {
    //   return cb(new BadRequestException('Invalid file type'), false);
    // }
    cb(null, true);
  },
};
