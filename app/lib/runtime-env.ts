let runtimeDb: D1Database | undefined;

export function setRuntimeDb(db: D1Database | undefined) {
  runtimeDb = db;
}

export function getRuntimeDb() {
  return runtimeDb;
}
