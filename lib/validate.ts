export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPassword(password: string): boolean {
  return typeof password === "string" && password.length >= 8;
}

export function required(value: unknown): boolean {
  return value !== undefined && value !== null && String(value).trim().length > 0;
}

export function isOneOf<T extends string>(value: unknown, options: readonly T[]): value is T {
  return typeof value === "string" && (options as readonly string[]).includes(value);
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}
