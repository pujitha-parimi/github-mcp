
import { createMcpHandler } from "mcp-handler";

import {
  registerRepositoryTools,
  registerCommitTools,
} from "../../../tools/repository-tools.js";

import { registerIssueTools } from "../../../tools/issue-tools.js";
import { registerContributorTools } from "../../../tools/contributor-tools.js";

const handler = createMcpHandler(
  (server) => {
    registerRepositoryTools(server);
    registerCommitTools(server);
    registerIssueTools(server);
    registerContributorTools(server);
  },
  {
    serverInfo: {
      name: "github-repo-analyzer-mcp",
      version: "1.0.0",
    },
  },
  {
    basePath: "/api",
    disableSse: true,
  }
);

export { handler as GET, handler as POST };
