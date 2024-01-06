import { CustomExceptionBase } from './custom.exception.base';

export class RepositoryException extends CustomExceptionBase {
  constructor(message, cause) {
    super(message, cause);
  }
}
