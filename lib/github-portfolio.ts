

export interface PortfolioRepo {
    id: number;
    name: string;
    description: string;
    html_url: string;
    stargazers_count: number;
    language: string;
    updated_at: string;
    fork: boolean;
}

export async function fetchFounderPortfolio(): Promise<PortfolioRepo[]> {
    try {
        // Fetching directly from your account
        const res = await fetch(`https://api.github.com/users/DrYounis/repos?sort=updated&per_page=15`, {
            next: { revalidate: 3600 }, // Refreshes every hour
        });

        if (!res.ok) throw new Error('Failed to fetch portfolio');

        const repos: PortfolioRepo[] = await res.json();

        // Filter out forks and repositories without descriptions so the feed looks professional
        return repos.filter((repo: PortfolioRepo) => !repo.fork && repo.description !== null);
    } catch (error) {
        console.error("GitHub Fetch Error:", error);
        return [];
    }
}
