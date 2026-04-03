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
import dayjs from 'dayjs';
import { ChevronDown, ChevronUp, Terminal } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

const getMonthFilterOptions = () => [
	{ key: 'last_month', label: 'Last Month' },
	{ key: 'previous_month', label: 'Previous Month' },
	{ key: 'month_before', label: 'Two Months Ago' },
];

const getActionItemsByFilter = (selectedFilter) => {
	const sentimentAnalysis = data.sentiment_analysis || {};

	return (
		data.action_items_by_month?.[selectedFilter] ||
		data.monthly_action_items?.[selectedFilter] ||
		sentimentAnalysis.action_items_by_month?.[selectedFilter] ||
		sentimentAnalysis.monthly_action_items?.[selectedFilter] ||
		data.action_items ||
		[]
	);
};

const SORTABLE_COLUMNS = {
	date: 'action_date',
	text: 'text',
	type: 'type',
	author_name: 'author_name',
	share_count: 'share_count',
	reaction_count: 'reaction_count',
	comments_count: 'comments_count',
	sentiment: 'sentiment',
	category: 'category',
	emotion: 'emotion',
	virality_score: 'virality_score',
};

const compareValues = (leftValue, rightValue) => {
	const left = leftValue ?? '';
	const right = rightValue ?? '';

	if (
		typeof leftValue === 'string' &&
		typeof rightValue === 'string' &&
		!Number.isNaN(Date.parse(leftValue)) &&
		!Number.isNaN(Date.parse(rightValue))
	) {
		return new Date(leftValue).getTime() - new Date(rightValue).getTime();
	}

	if (typeof left === 'number' && typeof right === 'number') {
		return left - right;
	}

	return String(left).localeCompare(String(right), undefined, {
		numeric: true,
		sensitivity: 'base',
	});
};

const ActionItems = () => {
	const [actionItems, setActionItems] = useState([]);
	const [selectedMonthFilter, setSelectedMonthFilter] =
		useState('last_month');
	const [sortConfig, setSortConfig] = useState({
		key: 'virality_score',
		direction: 'desc',
	});
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);
	const monthFilterOptions = getMonthFilterOptions();

	useEffect(() => {
		try {
			setActionItems(getActionItemsByFilter('last_month'));
		} catch (err) {
			setError('Unable to load action items.');
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		try {
			setActionItems(getActionItemsByFilter(selectedMonthFilter));
			setError(null);
		} catch (err) {
			setError('Unable to load action items.');
		}
	}, [selectedMonthFilter]);

	const activeMonthLabel =
		monthFilterOptions.find((option) => option.key === selectedMonthFilter)
			?.label || 'selected period';

	const datedActionItems = useMemo(() => {
		const baseDates = {
			last_month: '2025-06-20T12:00:00.000Z',
			previous_month: '2025-05-20T12:00:00.000Z',
			month_before: '2025-04-20T12:00:00.000Z',
		};
		const baseDate =
			baseDates[selectedMonthFilter] || baseDates.last_month;

		return actionItems.map((item, index) => ({
			...item,
			action_date: dayjs(baseDate).subtract(index, 'day').toISOString(),
		}));
	}, [actionItems, selectedMonthFilter]);

	const sortedActionItems = useMemo(() => {
		const items = [...datedActionItems];

		if (!sortConfig.key) {
			return items;
		}

		return items.sort((left, right) => {
			const comparison = compareValues(
				left?.[sortConfig.key],
				right?.[sortConfig.key],
			);

			return sortConfig.direction === 'asc' ? comparison : -comparison;
		});
	}, [datedActionItems, sortConfig]);

	const handleSort = (key) => {
		setSortConfig((current) => {
			if (current.key === key) {
				return {
					key,
					direction: current.direction === 'asc' ? 'desc' : 'asc',
				};
			}

			return {
				key,
				direction: 'asc',
			};
		});
	};

	const renderSortableHeader = (label, key, align = 'left') => {
		const isActive = sortConfig.key === key;
		const buttonAlignment =
			align === 'center'
				? 'mx-auto justify-center text-center'
				: 'justify-start text-left';

		return (
			<button
				type="button"
				onClick={() => handleSort(key)}
				className={`inline-flex items-center gap-1 ${buttonAlignment} transition hover:text-slate-900 dark:hover:text-slate-100`}
			>
				<span>{label}</span>
				<span className="flex flex-col">
					<ChevronUp
						className={`h-3 w-3 ${
							isActive && sortConfig.direction === 'asc'
								? 'text-blue-600 dark:text-blue-400'
								: 'text-slate-300 dark:text-slate-500'
						}`}
					/>
					<ChevronDown
						className={`-mt-1 h-3 w-3 ${
							isActive && sortConfig.direction === 'desc'
								? 'text-blue-600 dark:text-blue-400'
								: 'text-slate-300 dark:text-slate-500'
						}`}
					/>
				</span>
			</button>
		);
	};

	let content = null;

	if (loading) {
		content = (
			<tr>
				<td
					colSpan={12}
					className="whitespace-nowrap p-2 text-center sm:p-3"
				>
					<Skeleton className="aspect-video w-full bg-slate-200 dark:bg-slate-700" />
				</td>
			</tr>
		);
	} else if (error) {
		content = (
			<tr>
				<td
					colSpan={12}
					className="whitespace-nowrap p-2 text-center sm:p-3"
				>
					<Alert variant="destructive">
						<Terminal />
						<AlertTitle>Error!</AlertTitle>
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				</td>
			</tr>
		);
	} else if (sortedActionItems?.length === 0) {
		content = (
			<tr>
				<td
					colSpan={12}
					className="whitespace-nowrap p-2 text-center sm:p-3"
				>
					No posts found!
				</td>
			</tr>
		);
	} else {
		content = sortedActionItems.map((row, index) => (
			<tr
				key={index}
				className="border-b hover:bg-slate-50/50 dark:hover:bg-slate-700/50"
			>
				<td className="sticky left-0 whitespace-nowrap border-r bg-white p-2 dark:bg-slate-800 sm:p-3">
					<div
						className="w-[16px] min-w-[16px] truncate font-bold"
						title={index + 1}
					>
						{index + 1}
					</div>
				</td>
				<td className="whitespace-nowrap p-2 sm:p-3">
					<a
						href={row?.post_url ?? '#'}
						target="_blank"
						rel="noreferrer"
						className="block w-[88px] min-w-[88px] cursor-pointer truncate font-bold text-blue-500"
					>
						{row.text}
					</a>
				</td>
				<td className="whitespace-nowrap p-2 sm:p-3">
					{dayjs(row.action_date).format('DD MMM, YYYY')}
				</td>
				<td className="whitespace-nowrap p-2 capitalize sm:p-3">
					{row.type}
				</td>
				<td className="whitespace-nowrap p-2 sm:p-3">
					{row.author_name}
				</td>
				<td className="whitespace-nowrap p-2 text-center sm:p-3">
					{row.share_count}
				</td>
				<td className="whitespace-nowrap p-2 text-center sm:p-3">
					{row.reaction_count}
				</td>
				<td className="whitespace-nowrap p-2 text-center sm:p-3">
					{row.comments_count}
				</td>
				<td className="whitespace-nowrap p-2 sm:p-3">
					{row.sentiment}
				</td>
				<td className="whitespace-nowrap p-2 sm:p-3">{row.category}</td>
				<td className="whitespace-nowrap p-2 sm:p-3">{row.emotion}</td>
				<td className="whitespace-nowrap p-2 text-center sm:p-3">
					{row.virality_score}
				</td>
			</tr>
		));
	}

	return (
		<Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm dark:bg-slate-800/80">
			<CardHeader className="gap-3">
				<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
					<div>
						<CardTitle className="text-lg sm:text-xl">
							Action Items
						</CardTitle>
						<CardDescription className="mt-1 text-sm">
							Recommended actions based on sentiment analysis for
							the {activeMonthLabel.toLowerCase()}.
						</CardDescription>
					</div>
					<div className="w-full sm:w-auto sm:min-w-[220px]">
						<div className="relative">
							<select
								id="action-items-month-filter"
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
			</CardHeader>
			<CardContent>
				<h1 className="mb-3 text-base font-bold text-gray-500 dark:text-slate-100 sm:text-lg">
					Processed Posts Data
				</h1>
				<div className="relative">
					<div className="max-h-[50vh] overflow-x-auto overflow-y-auto rounded-lg border sm:max-h-96">
						<table className="min-w-full table-fixed text-xs sm:text-sm">
							<colgroup>
								<col style={{ width: '32px' }} />
								<col style={{ width: '96px' }} />
								<col style={{ width: '96px' }} />
								<col style={{ width: '72px' }} />
								<col style={{ width: '112px' }} />
								<col style={{ width: '64px' }} />
								<col style={{ width: '72px' }} />
								<col style={{ width: '72px' }} />
								<col style={{ width: '84px' }} />
								<col style={{ width: '88px' }} />
								<col style={{ width: '88px' }} />
								<col style={{ width: '88px' }} />
							</colgroup>
							<thead className="sticky top-0 z-30 bg-slate-50 dark:bg-slate-700">
								<tr className="border-b">
									<th className="sticky left-0 top-0 z-[50] whitespace-nowrap border-r bg-slate-50 p-2 text-left font-medium dark:bg-slate-700 sm:p-3">
										<div className="w-[32px] min-w-[32px]">
											#
										</div>
									</th>
									<th className="sticky top-0 z-40 min-w-[96px] whitespace-nowrap bg-slate-50 p-2 text-left font-medium dark:bg-slate-700 sm:p-3">
										{renderSortableHeader(
											'Text',
											SORTABLE_COLUMNS.text,
										)}
									</th>
									<th className="sticky top-0 z-40 min-w-[96px] whitespace-nowrap bg-slate-50 p-2 text-left font-medium dark:bg-slate-700 sm:p-3">
										{renderSortableHeader(
											'Date',
											SORTABLE_COLUMNS.date,
										)}
									</th>
									<th className="min-w-[72px] whitespace-nowrap p-2 text-left font-medium sm:p-3">
										{renderSortableHeader(
											'Type',
											SORTABLE_COLUMNS.type,
										)}
									</th>
									<th className="min-w-[112px] whitespace-nowrap p-2 text-left font-medium sm:p-3">
										{renderSortableHeader(
											'Name',
											SORTABLE_COLUMNS.author_name,
										)}
									</th>
									<th className="min-w-[64px] whitespace-nowrap p-2 text-center font-medium sm:p-3">
										{renderSortableHeader(
											'Share',
											SORTABLE_COLUMNS.share_count,
											'center',
										)}
									</th>
									<th className="min-w-[72px] whitespace-nowrap p-2 text-center font-medium sm:p-3">
										{renderSortableHeader(
											'Reaction',
											SORTABLE_COLUMNS.reaction_count,
											'center',
										)}
									</th>
									<th className="min-w-[72px] whitespace-nowrap p-2 text-center font-medium sm:p-3">
										{renderSortableHeader(
											'Comment',
											SORTABLE_COLUMNS.comments_count,
											'center',
										)}
									</th>
									<th className="min-w-[84px] whitespace-nowrap p-2 text-left font-medium sm:p-3">
										{renderSortableHeader(
											'Sentiment',
											SORTABLE_COLUMNS.sentiment,
										)}
									</th>
									<th className="min-w-[88px] whitespace-nowrap p-2 text-left font-medium sm:p-3">
										{renderSortableHeader(
											'Category',
											SORTABLE_COLUMNS.category,
										)}
									</th>
									<th className="min-w-[88px] whitespace-nowrap p-2 text-left font-medium sm:p-3">
										{renderSortableHeader(
											'Emotion',
											SORTABLE_COLUMNS.emotion,
										)}
									</th>
									<th className="min-w-[88px] whitespace-nowrap p-2 text-center font-medium sm:p-3">
										{renderSortableHeader(
											'Virality Score',
											SORTABLE_COLUMNS.virality_score,
											'center',
										)}
									</th>
								</tr>
							</thead>
							<tbody>{content}</tbody>
						</table>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default ActionItems;
