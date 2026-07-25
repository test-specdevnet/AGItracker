interface Fetcher {
  fetch(input: Request): Promise<Response>;
}

interface D1Result<T = unknown> {
  results: T[];
  success: boolean;
  meta: Record<string, unknown>;
}

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = Record<string, unknown>>(): Promise<T | null>;
  all<T = Record<string, unknown>>(): Promise<D1Result<T>>;
  run<T = Record<string, unknown>>(): Promise<D1Result<T>>;
}

interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch<T = Record<string, unknown>>(
    statements: D1PreparedStatement[],
  ): Promise<Array<D1Result<T>>>;
}

declare module "node:fs/promises" {
  export function access(path: string): Promise<void>;
  export function mkdir(
    path: string,
    options?: { recursive?: boolean },
  ): Promise<string | undefined>;
  export function rm(
    path: string,
    options?: { recursive?: boolean; force?: boolean },
  ): Promise<void>;
  export function cp(
    source: string,
    destination: string,
    options?: { recursive?: boolean },
  ): Promise<void>;
}
