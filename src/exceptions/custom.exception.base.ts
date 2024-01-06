export class CustomExceptionBase extends Error {
  // Base class for custom exception
  public cause: string;
  constructor(message, cause) {
    super(message);
    this.cause = cause;
  }
}
