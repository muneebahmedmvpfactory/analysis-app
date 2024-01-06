import * as mocks from 'node-mocks-http';
import { checkFileExtension } from './utils';

let mockCallback;

describe('Utils functions', () => {
  beforeEach(async () => {
    mockCallback = jest.fn((x) => x);
  });
  describe('Allow MP3 File', () => {
    it('should allowed mp3 file', async () => {
      const fileMock = {
        fieldname: 'uploadedFile',
        originalname: 'uploadedFile.mp3',
        encoding: '7bit',
      };

      const req = mocks.createRequest();
      checkFileExtension(req, fileMock, mockCallback);
      expect(mockCallback.mock.calls).toHaveLength(1);
      expect(mockCallback.mock.results[0].value).toBeNull();
    });

    it('should fail for all, other than mp3', async () => {
      const fileMock = {
        fieldname: 'uploadedFile',
        originalname: 'uploadedFile.xlsx',
        encoding: '7bit',
      };

      const req = mocks.createRequest();
      checkFileExtension(req, fileMock, mockCallback);
      expect(mockCallback.mock.calls).toHaveLength(1);
      expect(mockCallback.mock.results[0].value).toBeDefined();
    });
  });
});
