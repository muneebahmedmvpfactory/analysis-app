import { Test } from '@nestjs/testing';
import { AudioController } from './audio.controller';
import { AudioService } from './audio.service';
import { createMock } from '@golevelup/ts-jest';

describe('AudioController', () => {
  let audioController: AudioController;
  let audioService: AudioService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [AudioController],
    })
      .useMocker(() => createMock())
      .compile();

    audioService = module.get<AudioService>(AudioService);
    audioController = module.get<AudioController>(AudioController);
  });

  it('should be defined', () => {
    expect(audioController).toBeDefined();
    expect(audioService).toBeDefined();
  });

  describe('getFramesCount', () => {
    it('should return frame count', async () => {
      const file: Express.Multer.File = {
        originalname: 'sample.mp3',
        mimetype: 'audio/mpeg',
        path: '/',
        buffer: Buffer.from('one,two,three'),
        fieldname: '',
        encoding: '',
        size: 0,
        stream: null,
        destination: '',
        filename: 'sample.mp3',
      };

      const uploadUpdateWorkationSpy = jest
        .spyOn(audioService, 'getFramesCount')
        .mockResolvedValue(6096);

      const result = await audioController.getFramesCount(file);

      expect(result).toBeDefined();
      expect(uploadUpdateWorkationSpy).toBeCalledTimes(1);
      expect(uploadUpdateWorkationSpy).toBeCalledWith(file);

      expect(result.framesCount).toBe(6096);
    });

    it('should return error', async () => {
      try {
        await audioController.getFramesCount(null);
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
      }
    });
  });
});
