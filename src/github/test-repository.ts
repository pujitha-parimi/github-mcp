
import { getRepository } from "./repositories.js";

async function main(): Promise<void> {
  const repository = await getRepository(
    "pujitha-parimi",
    "github-mcp-server"
  );

  console.log("Repository details retrieved successfully!");
  console.log("Name:", repository.full_name);
  console.log("Description:", repository.description);
  console.log("Stars:", repository.stargazers_count);
  console.log("Forks:", repository.forks_count);
  console.log("Open issues:", repository.open_issues_count);
  console.log("Language:", repository.language);
  console.log("Updated at:", repository.updated_at);
  console.log("URL:", repository.html_url);
}

main().catch((error: unknown) => {
  console.error(
    "Repository test failed:",
    error instanceof Error ? error.message : error
  );
  process.exitCode = 1;
});
