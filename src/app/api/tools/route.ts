
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { tool, owner, repo, query, perPage } = body;

    if (
      typeof owner !== "string" ||
      typeof repo !== "string" ||
      !/^[\w.-]+$/.test(owner) ||
      !/^[\w.-]+$/.test(repo)
    ) {
      return Response.json(
        { error: "Enter a valid GitHub owner and repository name." },
        { status: 400 }
      );
    }

    const token = process.env.GITHUB_TOKEN;

    const headers: HeadersInit = {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const base = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`;

    let url: string;

    switch (tool) {
      case "get_repo_stats":
        url = base;
        break;

      case "list_recent_commits": {
        const count = Math.min(
          20,
          Math.max(1, Number(perPage) || 5)
        );
        url = `${base}/commits?per_page=${count}`;
        break;
      }

      case "search_issues": {
        if (typeof query !== "string" || !query.trim()) {
          return Response.json(
            { error: "Enter a search term for issues." },
            { status: 400 }
          );
        }

        const params = new URLSearchParams({
          q: `repo:${owner}/${repo} ${query.trim()} is:issue`,
          per_page: "10",
        });

        url = `https://api.github.com/search/issues?${params}`;
        break;
      }

      case "get_contributor_activity":
        url = `${base}/stats/contributors`;
        break;

      default:
        return Response.json(
          { error: "Unknown tool selected." },
          { status: 400 }
        );
    }

    const response = await fetch(url, {
      headers,
      cache: "no-store",
    });

    if (response.status === 202 && tool === "get_contributor_activity") {
      return Response.json({
        message:
          "GitHub is calculating contributor statistics. Please try again shortly.",
      });
    }

    const data = await response.json();

    if (!response.ok) {
      return Response.json(
        {
          error:
            data.message ||
            `GitHub API request failed (${response.status}).`,
        },
        { status: response.status }
      );
    }

    if (tool === "get_repo_stats") {
      return Response.json({
        name: data.full_name,
        description: data.description,
        stars: data.stargazers_count,
        forks: data.forks_count,
        openIssues: data.open_issues_count,
        language: data.language,
        lastUpdated: data.updated_at,
        url: data.html_url,
      });
    }

    if (tool === "list_recent_commits") {
      return Response.json(
        data.map((item: {
          sha: string;
          html_url: string;
          commit: {
            message: string;
            author?: { name?: string; date?: string };
          };
        }) => ({
          sha: item.sha,
          message: item.commit.message,
          author: item.commit.author?.name,
          date: item.commit.author?.date,
          url: item.html_url,
        }))
      );
    }

    if (tool === "search_issues") {
      return Response.json({
        totalCount: data.total_count,
        issues: data.items.map((item: {
          number: number;
          title: string;
          state: string;
          html_url: string;
        }) => ({
          number: item.number,
          title: item.title,
          state: item.state,
          url: item.html_url,
        })),
      });
    }

    if (tool === "get_contributor_activity") {
      return Response.json(
        (data as Array<{
          author?: { login?: string };
          total: number;
          weeks: Array<{ w: number; a: number; d: number; c: number }>;
        }>).slice(0, 10).map((item) => ({
          contributor: item.author?.login ?? "Unknown",
          totalCommits: item.total,
          recentWeeks: item.weeks.slice(-4).map((week) => ({
            weekStarting: new Date(week.w * 1000).toISOString().slice(0, 10),
            additions: week.a,
            deletions: week.d,
            commits: week.c,
          })),
        }))
      );
    }

    return Response.json({ error: "Unable to process the selected tool." }, {
      status: 500,
    });
  } catch {
    return Response.json(
      { error: "Request failed. Check the server terminal and try again." },
      { status: 500 }
    );
  }
}
