/**
 * CustomError extends Error to carry HTTP status metadata.
 */
export class CustomError extends Error {
  readonly status: number;
  readonly statusText?: string;

  constructor(message: string, status: number, statusText?: string) {
    super(message);

    this.name = "CustomError";
    this.status = status;
    this.statusText = statusText;

    // Ensure `instanceof CustomError` works after transpilation.
    Object.setPrototypeOf(this, new.target.prototype);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }
  }
}
