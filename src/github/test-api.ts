
import { githubRequest } from "./api.js";

interface GitHubUser {
  login: string;
  name: string | null;
  public_repos: number;
}

async function main(): Promise<void> {
  const user = await githubRequest<GitHubUser>("/user");

  console.log("GitHub connection successful!");
  console.log("Username:", user.login);
  console.log("Name:", user.name);
  console.log("Public repositories:", user.public_repos);
}

main().catch((error: unknown) => {
  console.error(
    "GitHub connection failed:",
    error instanceof Error ? error.message : error
  );
  process.exitCode = 1;
});
