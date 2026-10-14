
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getContributorActivity } from "../github/repositories.js";

/**
 * Register the MCP tool that retrieves repository contributors.
 */
export function registerContributorTools(server: McpServer): void {
  server.registerTool(
    "get_contributor_activity",
    {
      title: "Get Contributor Activity",
      description:
        "Get contributors to a GitHub repository, including usernames, contribution counts, and profile URLs.",
      inputSchema: {
        owner: z.string().min(1).describe("GitHub repository owner"),
        repo: z.string().min(1).describe("GitHub repository name"),
        perPage: z
          .number()
          .int()
          .min(1)
          .max(100)
          .optional()
          .describe("Maximum number of contributors to return, from 1 to 100"),
      },
    },
    async ({ owner, repo, perPage }) => {
      try {
        const contributors = await getContributorActivity(
          owner,
          repo,
          perPage
        );

        const result = contributors.map((contributor) => ({
          username: contributor.login,
          contributions: contributor.contributions,
          profileUrl: contributor.html_url,
        }));

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Unknown error";

        return {
          isError: true,
          content: [
            {
              type: "text" as const,
              text: message,
            },
          ],
        };
      }
    }
  );
}
