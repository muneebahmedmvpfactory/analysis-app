import { ApiProperty } from '@nestjs/swagger';

export class AudioFrameCountResponseDto {
  @ApiProperty()
  framesCount: number;
}
