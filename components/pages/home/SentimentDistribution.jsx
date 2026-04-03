'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
	Files,
	PieChart as PieChartIcon,
	ChevronDown,
	Terminal,
	TrendingUp,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import {
	Cell,
	Label,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
} from 'recharts';

const SENTIMENT_META = {
	positive: {
		label: 'Positive',
		color: '#10B981',
	},
	neutral: {
		label: 'Neutral',
		color: '#94A3B8',
	},
	negative: {
		label: 'Negative',
		color: '#EF4444',
	},
};

const SENTIMENT_ORDER = ['positive', 'neutral', 'negative'];

const formatPercent = (value = 0) => `${Math.round(value)}%`;

const formatPostCount = (value = 0) =>
	`${value.toLocaleString('en')} ${value === 1 ? 'post' : 'posts'}`;

const withPostCounts = (entries, totalPosts) => {
	if (!entries.length) {
		return [];
	}

	if (!totalPosts) {
		return entries.map((entry) => ({
			...entry,
			postCount: 0,
		}));
	}

	const totalShare = entries.reduce((sum, entry) => sum + entry.value, 0);

	if (!totalShare) {
		return entries.map((entry) => ({
			...entry,
			postCount: 0,
		}));
	}

	const normalizedEntries = entries.map((entry) => {
		const exactCount = (entry.value / totalShare) * totalPosts;

		return {
			...entry,
			postCount: Math.floor(exactCount),
			remainder: exactCount % 1,
		};
	});

	let remainingPosts =
		totalPosts -
		normalizedEntries.reduce((sum, entry) => sum + entry.postCount, 0);

	return normalizedEntries
		.sort((a, b) => b.remainder - a.remainder)
		.map((entry) => {
			if (remainingPosts > 0) {
				remainingPosts -= 1;
				return {
					...entry,
					postCount: entry.postCount + 1,
				};
			}

			return entry;
		})
		.sort(
			(a, b) =>
				SENTIMENT_ORDER.indexOf(a.key) - SENTIMENT_ORDER.indexOf(b.key),
		)
		.map(({ remainder, ...entry }) => entry);
};

const getMonthFilterOptions = () => [
	{ key: 'all', label: 'All' },
	{ key: 'last_month', label: 'Last Month' },
	{ key: 'previous_month', label: 'Previous Month' },
	{ key: 'month_before', label: 'Two Months Ago' },
];

const getPeriodPhrase = (selectedFilter, options) => {
	const activeLabel =
		options.find((option) => option.key === selectedFilter)?.label ||
		'selected period';

	const phraseMap = {
		all: 'all available periods',
		last_month: 'last month',
		previous_month: 'the previous month',
		month_before: 'two months ago',
	};

	return phraseMap[selectedFilter] || activeLabel.toLowerCase();
};

const getSnapshotByFilter = (selectedFilter) => {
	const sentimentAnalysis = data.sentiment_analysis || {};
	if (selectedFilter === 'all') {
		return {
			sentiment: sentimentAnalysis.sentiment_distribution || {},
			postCategories: sentimentAnalysis.post_categories || {},
		};
	}
	const monthlySentiment =
		sentimentAnalysis.monthly_sentiment_distribution?.[selectedFilter] ||
		sentimentAnalysis.sentiment_distribution_by_month?.[selectedFilter] ||
		sentimentAnalysis.sentiment_distribution;
	const monthlyCategories =
		sentimentAnalysis.monthly_post_categories?.[selectedFilter] ||
		sentimentAnalysis.post_categories_by_month?.[selectedFilter] ||
		sentimentAnalysis.post_categories;

	return {
		sentiment: monthlySentiment || {},
		postCategories: monthlyCategories || {},
	};
};

const renderOuterLabel = ({
	cx,
	cy,
	midAngle,
	outerRadius,
	name,
	value,
	postCount,
	fill,
	isMobile = false,
}) => {
	const RADIAN = Math.PI / 180;
	const sin = Math.sin(-RADIAN * midAngle);
	const cos = Math.cos(-RADIAN * midAngle);
	const startOffset = isMobile ? 2 : 4;
	const bendOffset = isMobile ? 10 : 18;
	const lineOffset = isMobile ? 10 : 18;
	const labelGap = isMobile ? 4 : 6;
	const titleY = isMobile ? 6 : 8;
	const valueY = isMobile ? 12 : 10;
	const postCountY = isMobile ? 24 : 26;
	const titleClass = isMobile
		? 'fill-slate-900 text-[10px] font-semibold dark:fill-slate-100'
		: 'fill-slate-900 text-[12px] font-semibold dark:fill-slate-100';
	const valueClass = isMobile
		? 'text-[10px] font-semibold'
		: 'text-[12px] font-semibold';
	const postCountClass = isMobile
		? 'fill-slate-500 text-[9px] font-medium dark:fill-slate-300'
		: 'fill-slate-500 text-[11px] font-medium dark:fill-slate-300';
	const startX = cx + (outerRadius + startOffset) * cos;
	const startY = cy + (outerRadius + startOffset) * sin;
	const midX = cx + (outerRadius + bendOffset) * cos;
	const midY = cy + (outerRadius + bendOffset) * sin;
	const endX = midX + (cos >= 0 ? lineOffset : -lineOffset);
	const endY = midY;
	const textAnchor = cos >= 0 ? 'start' : 'end';
	const labelX = endX + (cos >= 0 ? labelGap : -labelGap);

	return (
		<g>
			<path
				d={`M${startX},${startY} L${midX},${midY} L${endX},${endY}`}
				fill="none"
				stroke={fill}
				strokeWidth={1.5}
				strokeLinecap="round"
				opacity={0.9}
			/>
			<text
				x={labelX}
				y={endY - titleY}
				textAnchor={textAnchor}
				className={titleClass}
			>
				{name}
			</text>
			<text
				x={labelX}
				y={endY + valueY}
				textAnchor={textAnchor}
				style={{ fill }}
				className={valueClass}
			>
				{`${Math.round(value)}%`}
			</text>
			<text
				x={labelX}
				y={endY + postCountY}
				textAnchor={textAnchor}
				className={postCountClass}
			>
				{formatPostCount(postCount)}
			</text>
		</g>
	);
};

const CustomTooltip = ({ active, payload }) => {
	if (!active || !payload?.length) {
		return null;
	}

	const point = payload[0]?.payload;
	const meta = SENTIMENT_META[point?.name] || SENTIMENT_META.neutral;

	return (
		<div className="rounded-2xl border border-slate-200 bg-white/95 px-4 py-3 shadow-xl backdrop-blur dark:border-slate-600/70 dark:bg-slate-800/95">
			<div className="flex items-center gap-2">
				<span
					className="h-2.5 w-2.5 rounded-full"
					style={{ backgroundColor: meta.color }}
				/>
				<p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
					{meta.label}
				</p>
			</div>
			<p className="mt-1 text-xs text-slate-500 dark:text-slate-300">
				Share of total conversation
			</p>
			<p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-50">
				{formatPercent(point?.value)}
			</p>
			<p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-300">
				{formatPostCount(point?.postCount || 0)}
			</p>
		</div>
	);
};

const SentimentDistribution = () => {
	const [sentiment, setSentiment] = useState({});
	const [selectedMonthFilter, setSelectedMonthFilter] = useState('all');
	const [postCategories, setPostCategories] = useState({});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [isMobile, setIsMobile] = useState(false);
	const monthFilterOptions = getMonthFilterOptions();

	useEffect(() => {
		try {
			const defaultSnapshot = getSnapshotByFilter('all');
			setSentiment(defaultSnapshot.sentiment);
			setPostCategories(defaultSnapshot.postCategories);
		} catch (err) {
			setError('Unable to load sentiment distribution.');
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		const selectedSnapshot = getSnapshotByFilter(selectedMonthFilter);
		setSentiment(selectedSnapshot.sentiment);
		setPostCategories(selectedSnapshot.postCategories);
	}, [selectedMonthFilter]);

	useEffect(() => {
		const updateViewport = () => {
			setIsMobile(window.innerWidth < 640);
		};

		updateViewport();
		window.addEventListener('resize', updateViewport);

		return () => window.removeEventListener('resize', updateViewport);
	}, []);

	const sentimentEntries = SENTIMENT_ORDER.filter(
		(key) => key in sentiment,
	).map((key) => ({
		key,
		label: SENTIMENT_META[key]?.label || key,
		value: parseFloat(sentiment[key]) || 0,
		color: SENTIMENT_META[key]?.color || SENTIMENT_META.neutral.color,
	}));

	const totalPosts = Number(postCategories.total_number_of_posts || 0);
	const chartData = withPostCounts(sentimentEntries, totalPosts);
	const visiblePostTotal = chartData.reduce(
		(sum, item) => sum + item.postCount,
		0,
	);
	const dominantSentiment = sentimentEntries.reduce(
		(best, current) => (current.value > best.value ? current : best),
		sentimentEntries[0] || { label: 'N/A', value: 0 },
	) || { label: 'N/A', value: 0 };
	const activePeriodPhrase = getPeriodPhrase(
		selectedMonthFilter,
		monthFilterOptions,
	);

	let content = null;

	if (loading) {
		content = (
			<div className="space-y-4">
				<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-2">
					{Array.from({ length: 2 }).map((_, index) => (
						<Skeleton key={index} className="h-24 rounded-2xl" />
					))}
				</div>
				<Skeleton className="h-[320px] rounded-3xl" />
			</div>
		);
	} else if (error) {
		content = (
			<Alert variant="destructive">
				<Terminal className="h-4 w-4" />
				<AlertTitle>Error loading sentiment</AlertTitle>
				<AlertDescription>{error}</AlertDescription>
			</Alert>
		);
	} else {
		content = (
			<div className="space-y-6">
				<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-2">
					<div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800/80">
						<p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300">
							Leading sentiment
						</p>
						<div className="mt-3 flex items-center gap-3">
							<div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300">
								<TrendingUp className="h-5 w-5" />
							</div>
							<div>
								<p className="text-lg font-semibold text-slate-900 dark:text-slate-50">
									{dominantSentiment.label}
								</p>
								<p className="text-sm text-slate-500 dark:text-slate-300">
									{formatPercent(dominantSentiment.value)} of
									total posts
								</p>
							</div>
						</div>
					</div>

					<div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800/80">
						<p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300">
							Total posts
						</p>
						<div className="mt-3 flex items-center gap-3">
							<div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300">
								<Files className="h-5 w-5" />
							</div>
							<div>
								<p className="text-lg font-semibold text-slate-900 dark:text-slate-50">
									{totalPosts.toLocaleString('en')}
								</p>
								<p className="text-sm text-slate-500 dark:text-slate-300">
									Posts included in this snapshot
								</p>
							</div>
						</div>
					</div>
				</div>

				<div className="relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800/70 sm:p-6">
					<div className="relative h-[360px] sm:h-[480px]">
						<ResponsiveContainer width="100%" height="100%">
							<PieChart>
								<Pie
									data={chartData}
									dataKey="value"
									nameKey="label"
									innerRadius={isMobile ? 62 : 88}
									outerRadius={isMobile ? 82 : 124}
									paddingAngle={4}
									strokeWidth={0}
									labelLine={false}
									label={(props) =>
										renderOuterLabel({ ...props, isMobile })
									}
								>
									{chartData.map((entry) => (
										<Cell
											key={entry.key}
											fill={entry.color}
										/>
									))}
									<Label
										content={({ viewBox }) => {
											if (!viewBox?.cx || !viewBox?.cy) {
												return null;
											}

											return (
												<g>
													<text
														x={viewBox.cx}
														y={
															viewBox.cy -
															(isMobile ? 8 : 10)
														}
														textAnchor="middle"
														dominantBaseline="central"
														className="fill-slate-400 text-[11px] font-medium dark:fill-slate-300"
													>
														Posts
													</text>
													<text
														x={viewBox.cx}
														y={
															viewBox.cy +
															(isMobile ? 18 : 20)
														}
														textAnchor="middle"
														dominantBaseline="central"
														className="fill-slate-900 text-[24px] font-semibold dark:fill-slate-50 sm:text-[30px]"
													>
														{visiblePostTotal.toLocaleString('en')}
													</text>
												</g>
											);
										}}
									/>
								</Pie>
								<Tooltip content={<CustomTooltip />} />
							</PieChart>
						</ResponsiveContainer>
					</div>
					<div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-3 sm:mt-2 sm:gap-x-6">
						{chartData.map((entry) => (
							<div
								key={entry.key}
								className="flex items-center gap-2"
							>
								<span
									className="h-3.5 w-3.5 rounded-full"
									style={{ backgroundColor: entry.color }}
								/>
								<span className="text-sm font-medium text-slate-700 dark:text-slate-100">
									{entry.label}
								</span>
							</div>
						))}
					</div>
				</div>
			</div>
		);
	}

	return (
		<Card className="overflow-hidden border border-slate-200/80 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800/85 py-0 transition-all">
			<CardHeader className="bg-white px-5 py-4 dark:bg-slate-800/95 sm:px-6 sm:py-4">
				<div className="flex flex-col gap-3">
					<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
					<div className="max-w-3xl">
						<CardTitle className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
							<PieChartIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
							<span>Sentiment Distribution</span>
						</CardTitle>
					</div>
					<div className="w-full sm:w-auto sm:min-w-[220px]">
						<div className="relative">
							<select
								id="sentiment-month-filter"
								value={selectedMonthFilter}
								onChange={(event) =>
									setSelectedMonthFilter(event.target.value)
								}
								className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-sm font-medium text-slate-700 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:shadow-none dark:focus:border-blue-400 dark:focus:ring-blue-500/20"
							>
								{monthFilterOptions.map((option) => (
									<option key={option.key} value={option.key}>
										{option.label}
									</option>
								))}
							</select>
							<ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-300" />
						</div>
					</div>
				</div>
					<CardDescription className="max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-200">
						Current snapshot of positive, neutral, and negative
						conversation share across analyzed posts for{' '}
						{activePeriodPhrase}.
					</CardDescription>
				</div>
			</CardHeader>

			<CardContent className="space-y-3 bg-white px-3 pb-3 pt-0 dark:bg-slate-800/85 sm:px-4 sm:pb-4 sm:pt-0">
				{content}
			</CardContent>
		</Card>
	);
};

export default SentimentDistribution;
