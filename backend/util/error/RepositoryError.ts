export class RepositoryError extends Error {
  constructor(
    message: string,
    public context?: any,
  ) {
    super(message);
    this.name = "RepositoryError";
  }
}
