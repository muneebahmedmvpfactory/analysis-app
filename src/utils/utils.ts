import { HttpStatus } from '@nestjs/common';
import { RepositoryException } from '../exceptions/repository.exception';

export const checkFileExtension = (req, file, callback) => {
  if (!file.originalname.match(/\.(mp3)$/)) {
    return callback(
      new RepositoryException('Only MP3 file allowed', HttpStatus.BAD_REQUEST),
      false,
    );
  }

  return callback(null, true);
};
