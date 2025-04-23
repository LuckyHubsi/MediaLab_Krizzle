export class DatabaseError extends Error {
  constructor(
    message: string,
    public context?: any,
  ) {
    super(message);
    this.name = "DatabaseError";
  }
}
