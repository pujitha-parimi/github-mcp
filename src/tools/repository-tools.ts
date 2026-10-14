
import { z } from "zod";
import {
  getRepository,
  getRecentCommits,
} from "../github/repositories.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

/**
 * Register the tool that retrieves GitHub repository statistics.
 */
export function registerRepositoryTools(server: McpServer): void {
  server.registerTool(
    "get_repo_stats",
    {
      title: "Get Repository Statistics",
      description:
        "Get basic statistics and metadata for a GitHub repository.",
      inputSchema: {
        owner: z.string().min(1).describe("GitHub repository owner"),
        repo: z.string().min(1).describe("GitHub repository name"),
      },
    },
    async ({ owner, repo }) => {
      try {
        const repository = await getRepository(owner, repo);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(
                {
                  name: repository.full_name,
                  description: repository.description,
                  stars: repository.stargazers_count,
                  forks: repository.forks_count,
                  openIssues: repository.open_issues_count,
                  language: repository.language,
                  lastUpdated: repository.updated_at,
                  url: repository.html_url,
                },
                null,
                2
              ),
            },
          ],
        };
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Unknown error";

        return {
          isError: true,
          content: [{ type: "text" as const, text: message }],
        };
      }
    }
  );
}

/**
 * Register the tool that retrieves recent GitHub commits.
 */
export function registerCommitTools(server: McpServer): void {
  server.registerTool(
    "list_recent_commits",
    {
      title: "List Recent Commits",
      description:
        "List recent commits from a GitHub repository, including their messages, authors, dates, and URLs.",
      inputSchema: {
        owner: z.string().min(1).describe("GitHub repository owner"),
        repo: z.string().min(1).describe("GitHub repository name"),
        perPage: z
          .number()
          .int()
          .min(1)
          .max(100)
          .optional()
          .describe("Number of commits to return, from 1 to 100"),
      },
    },
    async ({ owner, repo, perPage }) => {
      try {
        const commits = await getRecentCommits(owner, repo, perPage);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(
                commits.map((item) => ({
                  sha: item.sha,
                  message: item.commit.message,
                  author: item.commit.author?.name ?? "Unknown",
                  date: item.commit.author?.date ?? "Unknown",
                  url: item.html_url,
                })),
                null,
                2
              ),
            },
          ],
        };
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Unknown error";

        return {
          isError: true,
          content: [{ type: "text" as const, text: message }],
        };
      }
    }
  );
}
