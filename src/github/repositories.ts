
import { githubRequest } from "./api.js";

// GitHub repository information.
interface GitHubRepository {
  name: string;
  full_name: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string | null;
  updated_at: string;
  html_url: string;
}

/**
 * Fetch basic information about a GitHub repository.
 */
export async function getRepository(
  owner: string,
  repo: string
): Promise<GitHubRepository> {
  return githubRequest<GitHubRepository>(
    `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`
  );
}

// GitHub commit information.
interface GitHubCommit {
  sha: string;
  html_url: string;
  commit: {
    message: string;
    author: {
      name: string | null;
      date: string | null;
    } | null;
  };
}

/**
 * Fetch recent commits from a GitHub repository.
 */
export async function getRecentCommits(
  owner: string,
  repo: string,
  perPage = 10
): Promise<GitHubCommit[]> {
  const limit = Math.min(Math.max(perPage, 1), 100);

  return githubRequest<GitHubCommit[]>(
    `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/commits?per_page=${limit}`
  );
}

// GitHub issue search response.
interface GitHubIssueSearchResponse {
  items: Array<{
    number: number;
    title: string;
    state: string;
    html_url: string;
    user: {
      login: string;
    } | null;
    labels: Array<{
      name: string;
    }>;
    assignee: {
      login: string;
    } | null;
    pull_request?: {
      url: string;
    };
  }>;
}

/**
 * Search issues and pull requests in a GitHub repository.
 * This function searches issues by default, excluding pull requests.
 */
export async function searchRepositoryIssues(
  owner: string,
  repo: string,
  query: string,
  perPage = 10
): Promise<GitHubIssueSearchResponse> {
  const limit = Math.min(Math.max(perPage, 1), 100);

  const searchQuery = `${query} repo:${owner}/${repo} is:issue`;

  return githubRequest<GitHubIssueSearchResponse>(
    `/search/issues?q=${encodeURIComponent(searchQuery)}&per_page=${limit}`
  );
}

// GitHub contributor information.
interface GitHubContributor {
  login: string;
  contributions: number;
  html_url: string;
}

/**
 * Fetch contributor activity for a GitHub repository.
 */
export async function getContributorActivity(
  owner: string,
  repo: string,
  perPage = 10
): Promise<GitHubContributor[]> {
  const limit = Math.min(Math.max(perPage, 1), 100);

  return githubRequest<GitHubContributor[]>(
    `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contributors?per_page=${limit}`
  );
}
