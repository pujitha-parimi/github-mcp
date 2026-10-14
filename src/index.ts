
import process from "node:process";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import {
  registerRepositoryTools,
  registerCommitTools,
} from "./tools/repository-tools.js";

import { registerIssueTools } from "./tools/issue-tools.js";
import { registerContributorTools } from "./tools/contributor-tools.js";

const server = new McpServer({
  name: "github-repo-analyzer-mcp",
  version: "1.0.0",
});

async function main(): Promise<void> {
  // Register repository statistics and recent commits.
  registerRepositoryTools(server);
  registerCommitTools(server);

  // Register issue search and contributor activity.
  registerIssueTools(server);
  registerContributorTools(server);

  // Connect the MCP server through standard input/output.
  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error("GitHub Repo Analyzer MCP server is running.");
}

main().catch((error: unknown) => {
  console.error("Failed to start MCP server:", error);
  process.exitCode = 1;
});
