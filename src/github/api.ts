
import "dotenv/config";

const GITHUB_API_BASE = "https://api.github.com";

const token = process.env.GITHUB_TOKEN;

if (!token || token === "your_github_token_here") {
  throw new Error(
    "GITHUB_TOKEN is missing. Add your GitHub token to the project-root .env file."
  );
}

export async function githubRequest<T>(path: string): Promise<T> {
  const response = await fetch(`${GITHUB_API_BASE}${path}`, {
    method: "GET",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(
        "REPOSITORY_NOT_FOUND: Repository not found or not accessible. " +
          "Please check the owner and repository name. " +
          "Example: owner = 'vercel', repo = 'next.js'. " +
          "If the repository is private, check your GitHub token permissions."
      );
    }

    if (response.status === 401) {
      throw new Error(
        "GITHUB_AUTH_ERROR: GitHub authentication failed. " +
          "Please check your GITHUB_TOKEN configuration."
      );
    }

    if (response.status === 403) {
      throw new Error(
        "GITHUB_ACCESS_DENIED: GitHub denied the request or the API rate limit was reached. " +
          "Check your token permissions and API rate limit."
      );
    }

    const message = await response.text();

    throw new Error(
      `GitHub API error (${response.status}): ${message}`
    );
  }

  return (await response.json()) as T;
}
