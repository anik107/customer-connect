'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { data } from '@/data/data';
import {
	ArrowUpRight,
	Eye,
	Heart,
	MessageCircle,
	Share2,
	Terminal,
	TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const sentimentStyles = {
	positive:
		'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30',
	negative:
		'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/15 dark:text-red-300 dark:border-red-500/30',
	neutral:
		'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-700/70 dark:text-slate-100 dark:border-slate-600',
};

const categoryStyles = {
	inquiry:
		'text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-300 dark:bg-amber-500/15 dark:border-amber-500/30',
	complaint:
		'text-red-700 bg-red-50 border-red-200 dark:text-red-300 dark:bg-red-500/15 dark:border-red-500/30',
	praise: 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-300 dark:bg-emerald-500/15 dark:border-emerald-500/30',
	suggestions:
		'text-blue-700 bg-blue-50 border-blue-200 dark:text-blue-300 dark:bg-blue-500/15 dark:border-blue-500/30',
};

const formatLabel = (value = '') =>
	value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

const formatCompactNumber = (value = 0) =>
	new Intl.NumberFormat('en', {
		notation: 'compact',
		maximumFractionDigits: 1,
	}).format(value);

const TopVirtualPosts = () => {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error] = useState(null);

	useEffect(() => {
		const topPosts = (data.sentiment_analysis?.top_posts || [])
			.slice()
			.sort((a, b) => (b.virality_score || 0) - (a.virality_score || 0));

		setPosts(topPosts);
		setLoading(false);
	}, []);

	let content = null;

	if (loading) {
		content = (
			<div className="space-y-4">
				{Array.from({ length: 4 }).map((_, index) => (
					<div
						key={index}
						className="rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800/80"
					>
						<Skeleton className="mb-3 h-4 w-24 rounded-full" />
						<Skeleton className="mb-3 h-16 w-full rounded-xl" />
						<div className="grid grid-cols-3 gap-2">
							<Skeleton className="h-12 rounded-xl" />
							<Skeleton className="h-12 rounded-xl" />
							<Skeleton className="h-12 rounded-xl" />
						</div>
					</div>
				))}
			</div>
		);
	} else if (error) {
		content = (
			<Alert variant="destructive">
				<Terminal className="h-4 w-4" />
				<AlertTitle>Unable to load top posts</AlertTitle>
				<AlertDescription>{error}</AlertDescription>
			</Alert>
		);
	} else if (posts.length === 0) {
		content = (
			<div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 px-6 py-10 text-center dark:border-slate-700 dark:bg-slate-900/60">
				<div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-200">
					<Eye className="h-5 w-5" />
				</div>
				<p className="text-sm font-medium text-slate-700 dark:text-slate-200">
					No viral posts available yet.
				</p>
				<p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
					This section will populate once sentiment analysis returns
					top-performing posts.
				</p>
			</div>
		);
	} else {
		content = (
			<div className="space-y-4">
				{posts.map((post, index) => {
					const sentiment = (
						post.sentiment || 'neutral'
					).toLowerCase();
					const category = (post.category || 'inquiry').toLowerCase();
					const commentValue = Number(post.comments_count || 0);
					const reactionValue = Number(post.reaction_count || 0);
					const shareValue = Number(post.share_count || 0);

					return (
						<article
							key={`${post.post_id || post.author_name || 'post'}-${index}`}
							className="group relative rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all hover:border-slate-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800/80 dark:hover:border-slate-600"
						>
							{post.post_url ? (
								<Link
									href={post.post_url}
									target="_blank"
									rel="noreferrer"
									className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition-colors hover:border-blue-200 hover:text-blue-600 dark:border-slate-600 dark:bg-slate-700/80 dark:text-slate-100 dark:hover:border-blue-500/40 dark:hover:text-blue-300"
									aria-label="Open post"
								>
									<ArrowUpRight className="h-4 w-4" />
								</Link>
							) : null}

							<div className="flex min-w-0 gap-2.5">
								<div className="flex min-w-0 flex-1 gap-2.5">
									<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 text-[10px] font-semibold text-white shadow-sm">
										#{index + 1}
									</div>

									<div className="min-w-0 flex-1 space-y-3">
										<div className="flex flex-wrap items-center gap-2">
											<p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
												{post.author_name ||
													'Anonymous'}
											</p>
											<Badge
												variant="outline"
												className={`border ${sentimentStyles[sentiment] || sentimentStyles.neutral}`}
											>
												{formatLabel(sentiment)}
											</Badge>
											<Badge
												variant="outline"
												className={`border ${categoryStyles[category] || categoryStyles.inquiry}`}
											>
												{formatLabel(
													post.category || 'Inquiry',
												)}
											</Badge>
										</div>

										<p className="line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-200">
											{post.text}
										</p>

										<div className="flex flex-wrap gap-2">
											<div className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50/90 px-2.5 py-1.5 text-xs dark:border-slate-600 dark:bg-slate-700/60">
												<Heart className="h-3.5 w-3.5 text-rose-500" />
												<span className="text-slate-500 dark:text-slate-300">
													Likes
												</span>
												<span className="font-semibold text-slate-900 dark:text-slate-50">
													{formatCompactNumber(
														reactionValue,
													)}
												</span>
											</div>

											<div className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50/90 px-2.5 py-1.5 text-xs dark:border-slate-600 dark:bg-slate-700/60">
												<MessageCircle className="h-3.5 w-3.5 text-blue-500" />
												<span className="text-slate-500 dark:text-slate-300">
													Comments
												</span>
												<span className="font-semibold text-slate-900 dark:text-slate-50">
													{formatCompactNumber(
														commentValue,
													)}
												</span>
											</div>

											<div className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50/90 px-2.5 py-1.5 text-xs dark:border-slate-600 dark:bg-slate-700/60">
												<Share2 className="h-3.5 w-3.5 text-amber-500" />
												<span className="text-slate-500 dark:text-slate-300">
													Shares
												</span>
												<span className="font-semibold text-slate-900 dark:text-slate-50">
													{formatCompactNumber(
														shareValue,
													)}
												</span>
											</div>
										</div>
									</div>
								</div>
							</div>
						</article>
					);
				})}
			</div>
		);
	}

	return (
		<Card className="overflow-hidden border border-slate-200/80 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800/85 py-0 transition-all">
			<CardHeader className="bg-white px-5 py-4 dark:bg-slate-800/95 sm:px-6 sm:py-4">
				<div className="space-y-2">
					<div className="max-w-3xl">
						<CardTitle className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
							<TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
							<span>Top Viral Posts</span>
						</CardTitle>
						<CardDescription className="mt-1 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-200">
							Posts ranked by viral score and engagement
						</CardDescription>
					</div>
				</div>
			</CardHeader>

			<CardContent className="space-y-3 bg-white px-3 pb-3 pt-0 dark:bg-slate-800/85 sm:px-4 sm:pb-4 sm:pt-0">
				{content}
			</CardContent>
		</Card>
	);
};

export default TopVirtualPosts;
