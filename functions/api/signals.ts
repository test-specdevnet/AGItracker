import {
  ensureAgentSchema,
  loadAgentSnapshot,
  runVectorAgent,
  snapshotIsFresh,
} from "../../app/lib/vector-agent";

interface PagesEnv {
  DB?: D1Database;
}

interface PagesContext {
  env: PagesEnv;
}

export async function onRequestGet({ env }: PagesContext) {
  try {
    if (env.DB) {
      await ensureAgentSchema(env.DB);
      const snapshot = await loadAgentSnapshot(env.DB);
      if (snapshot && snapshotIsFresh(snapshot)) {
        return Response.json(snapshot);
      }
      return Response.json(
        await runVectorAgent({ db: env.DB, trigger: "request" }),
      );
    }
  } catch (error) {
    console.error("VECTOR-01 Pages sweep failed", error);
  }

  return Response.json(await runVectorAgent());
}
