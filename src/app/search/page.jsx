import { Suspense } from 'react';
import SearchContent from '@/app/search/SearchContent';

export default function SearchPage() {
	return (
		<main className="min-h-screen bg-[#003d2b] p-6 pb-40">
			<Suspense fallback={<div className="text-white">Loading search...</div>}>
				<SearchContent />
			</Suspense>
		</main>
	);
}