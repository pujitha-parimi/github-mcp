
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { searchRepositoryIssues } from "../github/repositories.js";

/**
 * Register the MCP tool for searching repository issues and pull requests.
 */
export function registerIssueTools(server: McpServer): void {
  server.registerTool(
    "search_issues",
    {
      title: "Search Repository Issues",
      description:
        "Search GitHub issues and pull requests in a repository using a keyword or phrase.",
      inputSchema: {
        owner: z.string().min(1).describe("GitHub repository owner"),
        repo: z.string().min(1).describe("GitHub repository name"),
        query: z.string().min(1).describe("Keyword or phrase to search"),
        perPage: z
          .number()
          .int()
          .min(1)
          .max(100)
          .optional()
          .describe("Maximum number of results to return, from 1 to 100"),
      },
    },
    async ({ owner, repo, query, perPage }) => {
      try {
        const result = await searchRepositoryIssues(
          owner,
          repo,
          query,
          perPage
        );

        const issues = result.items.map((item) => ({
          number: item.number,
          title: item.title,
          state: item.state,
          author: item.user?.login ?? "Unknown",
          labels: item.labels.map((label) => label.name),
          assignee: item.assignee?.login ?? null,
          url: item.html_url,
          isPullRequest: Boolean(item.pull_request),
        }));

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(
                {
                  totalResults: issues.length,
                  issues,
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
