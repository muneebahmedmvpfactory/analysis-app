import { Test } from '@nestjs/testing';
import { AudioService } from './audio.service';
import { I18nService } from 'nestjs-i18n';

describe('AudioService', () => {
  let audioService: AudioService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: I18nService,
          useValue: {
            translate: jest.fn(),
          },
        },
        AudioService,
      ],
    }).compile();

    audioService = await moduleRef.resolve(AudioService);
  });

  it('should be defined', () => {
    expect(audioService).toBeDefined();
  });
});
