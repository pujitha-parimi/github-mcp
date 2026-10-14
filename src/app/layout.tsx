
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GitHub Repo Analyzer MCP",
  description: "MCP server for GitHub repository analysis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#111827" }}>
        {children}
      </body>
    </html>
  );
}
