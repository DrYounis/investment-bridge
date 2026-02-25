import { fetchFounderPortfolio } from '@/lib/github-portfolio';
import { requestProjectDetails } from '@/app/actions/investor-requests';

export default async function FounderShowcase() {
    const portfolio = await fetchFounderPortfolio();

    if (!portfolio.length) {
        return null; // Hide the section if GitHub is unreachable
    }

    return (
        <section className="py-8">
            <div className="mb-8">
                <h2 className="text-3xl font-serif text-[#0a192f] mb-2">Exclusive Technical Assets</h2>
                <p className="text-slate-600">
                    Direct investment opportunities from the founder's active engineering pipeline.
                    Request a technical impact report or business feasibility study for any asset below.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {portfolio.map((repo) => (
                    <div
                        key={repo.id}
                        className="flex flex-col bg-[#fdfbf7] border border-[#e5e0d8] p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-semibold text-[#0a192f] capitalize tracking-tight">
                                {repo.name.replace(/-/g, ' ')}
                            </h3>
                            {repo.language && (
                                <span className="bg-[#0a192f] text-[#fdfbf7] text-xs px-2.5 py-1 rounded-md tracking-wider uppercase">
                                    {repo.language}
                                </span>
                            )}
                        </div>

                        <p className="text-sm text-slate-600 mb-6 flex-grow leading-relaxed">
                            {repo.description}
                        </p>

                        <form action={requestProjectDetails} className="mt-auto pt-4 border-t border-[#e5e0d8]">
                            <input type="hidden" name="repoName" value={repo.name} />
                            <input type="hidden" name="repoUrl" value={repo.html_url} />

                            <button
                                type="submit"
                                className="w-full bg-[#d4af37] hover:bg-[#b5952f] text-[#0a192f] font-semibold py-2.5 px-4 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
                            >
                                <span>Request Investment Details</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </button>
                        </form>
                    </div>
                ))}
            </div>
        </section>
    );
}
