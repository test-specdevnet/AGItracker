import { getRuntimeDb } from "../../lib/runtime-env";
import {
  loadAgentSnapshot,
  runVectorAgent,
  snapshotIsFresh,
} from "../../lib/vector-agent";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const db = getRuntimeDb();
    if (db) {
      const snapshot = await loadAgentSnapshot(db);
      if (snapshot && snapshotIsFresh(snapshot)) {
        return Response.json(snapshot);
      }
      return Response.json(
        await runVectorAgent({ db, trigger: "request" }),
      );
    }
  } catch (error) {
    console.error("VECTOR-01 persistent sweep failed", error);
  }

  return Response.json(await runVectorAgent());
}
