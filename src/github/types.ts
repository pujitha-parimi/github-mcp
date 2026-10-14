
/**
 * Basic information about a GitHub repository.
 */
export interface RepositoryStats {
  owner: string;
  name: string;
  description: string | null;
  stars: number;
  forks: number;
  openIssues: number;
  openPullRequests: number;
  language: string | null;
  lastUpdated: string;
  url: string;
}

/**
 * Information about a recent repository commit.
 */
export interface RecentCommit {
  sha: string;
  message: string;
  author: string;
  date: string;
  url: string;
}

/**
 * Information about a GitHub issue or pull request.
 */
export interface IssueSearchResult {
  number: number;
  title: string;
  state: string;
  labels: string[];
  assignee: string | null;
  author: string;
  url: string;
  isPullRequest: boolean;
}

/**
 * Contributor information and contribution count.
 */
export interface ContributorActivity {
  username: string;
  contributions: number;
  profileUrl: string;
}
