import { createDb } from "../src/db/client";
import { SEED_CANDIDATES, seed } from "../src/db/seed";

async function main() {
  await seed(createDb());
  console.log(`Seeded ${SEED_CANDIDATES.length} candidates`);
}

main().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});
