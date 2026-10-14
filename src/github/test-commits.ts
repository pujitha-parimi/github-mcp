
import { getRecentCommits } from "./repositories.js";

async function main(): Promise<void> {
  const commits = await getRecentCommits(
    "pujitha-parimi",
    "github-mcp-server",
    5
  );

  console.log("Recent commits retrieved successfully!");
  console.log("Number of commits:", commits.length);

  for (const commit of commits) {
    console.log("\nCommit:", commit.sha.slice(0, 7));
    console.log("Message:", commit.commit.message.split("\n")[0]);
    console.log("Author:", commit.commit.author?.name ?? "Unknown");
    console.log("Date:", commit.commit.author?.date ?? "Unknown");
    console.log("URL:", commit.html_url);
  }
}

main().catch((error: unknown) => {
  console.error(
    "Commit test failed:",
    error instanceof Error ? error.message : error
  );
  process.exitCode = 1;
});
