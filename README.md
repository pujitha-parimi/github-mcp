# GitHub Repo Analyzer MCP Server

A Model Context Protocol (MCP) server that lets AI assistants and MCP-compatible clients inspect GitHub repositories using dedicated tools. It provides repository statistics, recent commits, issue search, and contributor activity through a Streamable HTTP endpoint.

##  Live Deployment

**Public MCP Endpoint:** https://github-mcp-smoky.vercel.app/api/mcp

**Deployment Platform:** Vercel

##  Features

- **Repository Statistics** — Retrieve information and statistics about a GitHub repository.
- **Recent Commits** — List recent commits for a repository.
- **Issue Search** — Search GitHub issues.
- **Contributor Activity** — View contributor activity for a repository.
- **Remote Access** — Connect to the deployed server using an MCP-compatible client.
- **Secure Configuration** — Configure the GitHub access token through environment variables.

##  Tech Stack

- TypeScript
- Node.js
- Next.js
- Model Context Protocol (MCP)
- GitHub API
- Vercel

##  MCP Endpoint

The deployed server exposes its MCP endpoint at:

```text
https://github-mcp-smoky.vercel.app/api/mcp
```

The endpoint uses Streamable HTTP. Open it with an MCP-compatible client, such as Postman, to discover and invoke the available tools.

Opening the URL directly in a browser may not display a normal webpage because it is an MCP protocol endpoint.

##  Available Tools

| Tool | Description |
|---|---|
| `get_repo_stats` | Retrieve GitHub repository statistics |
| `list_recent_commits` | List recent commits |
| `search_issues` | Search repository issues |
| `get_contributor_activity` | Retrieve contributor activity |

##  Test with Postman

1. Open Postman and create an MCP request.
2. Choose HTTP as the connection type.
3. Enter the public MCP endpoint:

   ```text
   https://github-mcp-smoky.vercel.app/api/mcp
   ```

4. Click **Load Capabilities**.
5. Open the Tools tab and select a tool.
6. Enter the required arguments and run the tool.

## ⚙️ Environment Configuration

Configure the following environment variable in your local environment or Vercel project settings:

```env
GITHUB_TOKEN=your_github_token_here
```

Replace the placeholder with a valid GitHub token. Grant only the repository permissions required by the tools.

**Security:** Never commit your actual `.env` file or a real GitHub token to the repository. Keep secrets in local environment files or Vercel Environment Variables.

##  Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/pujitha-parimi/github-repo-analyzer-mcp.git
cd github-repo-analyzer-mcp
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure your environment

Create a `.env` file in the project root:

```env
GITHUB_TOKEN=your_github_token_here
```

Use your own valid token locally. Do not commit this file.

### 4. Start the HTTP server

```bash
npm run web:dev
```

The local MCP endpoint should be available at:

```text
http://localhost:3000/api/mcp
```

If port 3000 is already occupied, Next.js may select another port. Use the port shown in your terminal.

##  Deployment

This project is deployed on Vercel.

To deploy your own instance:

1. Fork or import the GitHub repository into Vercel.
2. Configure `GITHUB_TOKEN` in **Project Settings → Environment Variables**.
3. Deploy the project.
4. Test the `/api/mcp` endpoint using Postman or another MCP-compatible client.

##  Security Notes

- Keep GitHub tokens private.
- Use the minimum permissions required.
- Rotate any token that may have been exposed.
- Because the deployed MCP endpoint is public, consider access controls and rate limiting if you need to prevent unauthorized use or excessive API consumption.

##  Author

**Pujitha Parimi**

GitHub: https://github.com/pujitha-parimi

---

Built to explore GitHub repository insights through the Model Context Protocol.
