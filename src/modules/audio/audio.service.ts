import { HttpStatus, Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { RepositoryException } from '../../exceptions/repository.exception';

@Injectable()
export class AudioService {
  constructor(private i18n: I18nService) {}

  async getFramesCount(uploadedFile: Express.Multer.File): Promise<number> {
    try {
      const mimeType = 'audio/mpeg';

      const chunk = new Uint8Array(uploadedFile.buffer);
      const codeParser = (await import('codec-parser')).default; // codec-parser is save to use, we can use "snyk" (https://docs.snyk.io/getting-started/introducing-snyk).
      const parser = new codeParser(mimeType);
      const frames = parser.parseAll(chunk);
      return frames.length;
    } catch (exception) {
      throw new RepositoryException(
        await this.i18n.translate('lang.bad_request_error'),
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
