import {
  Controller,
  HttpStatus,
  Inject,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AudioService } from './audio.service';
import { I18nService } from 'nestjs-i18n';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { checkFileExtension } from '../../utils/utils';
import { RepositoryException } from '../../exceptions/repository.exception';
import { Express } from 'express';
import { AudioFrameCountResponseDto } from './audio.dto';

@Controller()
export class AudioController {
  constructor(
    private readonly audioService: AudioService,
    @Inject(I18nService) private i18n: I18nService,
  ) {}

  // Required to show expected response in Swagger
  @ApiOkResponse({
    description: 'Need to return number of frames of uploaded Audio',
    type: AudioFrameCountResponseDto,
    isArray: false,
  })
  // @ApiBearerAuth() Required for jwt token implementation in Swagger
  @ApiTags('Audio')
  @ApiOperation({
    summary: 'Need to return number of frames of uploaded Audio',
  })
  @Post('file-upload')
  // @UseGuards(CustomAuthGuard) Required for jwt validation
  // Used to validate file type
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: checkFileExtension,
    }),
  )
  async getFramesCount(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<AudioFrameCountResponseDto> {
    if (!file) {
      throw new RepositoryException(
        await this.i18n.translate('lang.bad_request_error'),
        HttpStatus.BAD_REQUEST,
      );
    }

    const framesCount = await this.audioService.getFramesCount(file);
    return {
      framesCount,
    };
  }
}
