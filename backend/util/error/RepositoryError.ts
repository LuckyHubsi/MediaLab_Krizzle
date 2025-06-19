// Repository Error with specific types to differentiate between causes
export class RepositoryError extends Error {
  constructor(
    public type:
      | "No Connection"
      | "Query Failed"
      | "Fetch Failed"
      | "Not Found"
      | "Insert Failed"
      | "Update Failed"
      | "Delete Failed"
      | "Transaction Failed",
  ) {
    super();
    this.name = "RepositoryError";
  }
}
