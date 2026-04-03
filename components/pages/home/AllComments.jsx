"use client";

import TanstackTableBody from "@/components/common/TanstackTableBody";
import TanstackTableHeader from "@/components/common/TanstackTableHeader";
import { data } from "@/data/data";
import {
  functionalUpdate,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import dayjs from "dayjs";
import { debounce } from "lodash";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useReducer, useState } from "react";

const initialState = {
  page: 1,
  limit: 25,
  loading: true,
  totalComments: 0,
  comments: [],
  isError: false,
  error: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_PAGE":
      return { ...state, page: action.payload };
    case "SET_LIMIT":
      return { ...state, limit: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action?.payload };
    case "SET_TOTAL_COMMENTS":
      return { ...state, totalComments: action.payload };
    case "SET_COMMENTS":
      return { ...state, comments: action.payload };
    case "SET_ERROR":
      return { ...state, isError: true, error: action.payload };
    case "RESET_ERROR":
      return { ...state, isError: false, error: null };
    case "SET_SEARCH":
      return { ...state, search: action.payload };
    default:
      return state;
  }
};

const getSourceFromUrl = (url = "") => {
  const normalizedUrl = url.toLowerCase();

  if (normalizedUrl.includes("instagram.com")) return "instagram";
  if (normalizedUrl.includes("facebook.com")) return "facebook";

  return "unknown";
};

const monthFilterOptions = [
  { key: "last_month", label: "Last Month" },
  { key: "previous_month", label: "Previous Month" },
  { key: "month_before", label: "Two Months Ago" },
];

const getItemsByMonth = (items = [], selectedMonthFilter) => {
  if (!items.length) {
    return [];
  }

  const firstCut = Math.ceil(items.length / 3);
  const secondCut = Math.ceil((items.length * 2) / 3);
  const fallbackSlices = {
    last_month: items.slice(0, firstCut),
    previous_month: items.slice(firstCut, secondCut),
    month_before: items.slice(secondCut),
  };

  return fallbackSlices[selectedMonthFilter] || items;
};

const getPostsSnapshot = (selectedMonthFilter) => {
  const sentimentAnalysis = data.sentiment_analysis || {};
  const actionItems =
    data.action_items_by_month?.[selectedMonthFilter] ||
    data.monthly_action_items?.[selectedMonthFilter] ||
    getItemsByMonth(data.action_items || [], selectedMonthFilter);
  const topPosts =
    sentimentAnalysis.top_posts_by_month?.[selectedMonthFilter] ||
    sentimentAnalysis.monthly_top_posts?.[selectedMonthFilter] ||
    getItemsByMonth(sentimentAnalysis.top_posts || [], selectedMonthFilter);

  const uniquePosts = [...actionItems, ...topPosts].filter((post, index, posts) => {
    const identity =
      post?.post_id || post?.post_url || `${post?.author_name}-${post?.text}`;

    return (
      posts.findIndex((currentPost) => {
        const currentIdentity =
          currentPost?.post_id ||
          currentPost?.post_url ||
          `${currentPost?.author_name}-${currentPost?.text}`;

        return currentIdentity === identity;
      }) === index
    );
  });

  return uniquePosts;
};

const getCommentBaseDate = (selectedMonthFilter) => {
  const baseDates = {
    last_month: "2025-06-20T12:00:00.000Z",
    previous_month: "2025-05-20T12:00:00.000Z",
    month_before: "2025-04-20T12:00:00.000Z",
  };

  return baseDates[selectedMonthFilter] || baseDates.last_month;
};

const compareValues = (leftValue, rightValue) => {
  const left = leftValue ?? "";
  const right = rightValue ?? "";

  if (
    typeof leftValue === "string" &&
    typeof rightValue === "string" &&
    !Number.isNaN(Date.parse(leftValue)) &&
    !Number.isNaN(Date.parse(rightValue))
  ) {
    return new Date(leftValue).getTime() - new Date(rightValue).getTime();
  }

  if (typeof left === "number" && typeof right === "number") {
    return left - right;
  }

  return String(left).localeCompare(String(right), undefined, {
    numeric: true,
    sensitivity: "base",
  });
};

const SourceBadge = ({ source }) => {
  const badgeConfig = {
    facebook: {
      label: "Facebook",
      className: "bg-[#1877F2] text-white",
      icon: (
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
          <path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.6 1.7-1.6H17V3.8c-.3 0-.9-.1-1.8-.1-1.8 0-3.1 1.1-3.1 3.3V10H9v3h3.1v8h1.4Z" />
        </svg>
      ),
    },
    instagram: {
      label: "Instagram",
      className:
        "bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#515BD4] text-white",
      icon: (
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-none stroke-current" aria-hidden="true">
          <rect x="4.25" y="4.25" width="15.5" height="15.5" rx="4" strokeWidth="1.8" />
          <circle cx="12" cy="12" r="3.6" strokeWidth="1.8" />
          <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
        </svg>
      ),
    },
    unknown: {
      label: "Unknown",
      className: "bg-slate-200 text-slate-700 dark:bg-slate-600 dark:text-white",
      icon: <span className="text-[11px] font-bold">?</span>,
    },
  };

  const config = badgeConfig[source] || badgeConfig.unknown;

  return (
    <div className="flex w-[72px] min-w-[72px] justify-center">
      <span
        title={config.label}
        aria-label={config.label}
        className={`inline-flex h-7 w-7 items-center justify-center rounded-full shadow-sm ${config.className}`}
      >
        {config.icon}
      </span>
    </div>
  );
};

const AllComments = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [selectedMonthFilter, setSelectedMonthFilter] = useState("last_month");
  const [sorting, setSorting] = useState([{ id: "comment_time", desc: true }]);

  const { page, limit, loading, totalComments, comments, isError, error } =
    state;

  const fetchComments = useCallback(() => {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "RESET_ERROR" });

    try {
      const allPosts = getPostsSnapshot(selectedMonthFilter);
      const baseDate = getCommentBaseDate(selectedMonthFilter);
      const dummyComments = allPosts.map((post, index) => ({
        id: index + 1,
        comment_text: `Comment on: ${(post.text || "Untitled post").substring(0, 50)}...`,
        comment_url: post.post_url,
        source: getSourceFromUrl(post.post_url),
        comment_likes: ((post.reaction_count || 0) + index) % 20,
        comment_replies: ((post.comments_count || 0) + index) % 5,
        comment_time: dayjs(baseDate).subtract(index, "day").toISOString(),
        virality_score: Math.round(post.virality_score || 0),
      }));
      const activeSort = sorting[0];
      const sortedComments = activeSort
        ? [...dummyComments].sort((left, right) => {
            const comparison = compareValues(
              left?.[activeSort.id],
              right?.[activeSort.id],
            );

            return activeSort.desc ? -comparison : comparison;
          })
        : dummyComments;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedComments = sortedComments.slice(startIndex, endIndex);

      dispatch({ type: "SET_COMMENTS", payload: paginatedComments });
      dispatch({ type: "SET_TOTAL_COMMENTS", payload: sortedComments.length });
    } catch (fetchError) {
      dispatch({
        type: "SET_ERROR",
        payload: fetchError.message || "Failed to fetch comments.",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [page, limit, selectedMonthFilter, sorting]);

  useEffect(() => {
    const debouncedFetch = debounce(() => {
      fetchComments();
    }, 500);

    debouncedFetch();

    return () => {
      debouncedFetch.cancel();
    };
  }, [fetchComments]);

  useEffect(() => {
    dispatch({ type: "SET_PAGE", payload: 1 });
  }, [selectedMonthFilter, sorting]);

  const activeMonthLabel =
    monthFilterOptions.find((option) => option.key === selectedMonthFilter)
      ?.label || "selected period";

  const columns = (pageIndex, pageSize) => [
    {
      id: "sl",
      enableSorting: false,
      header: () => <div className="w-[44px] min-w-[44px]">#</div>,
      cell: ({ row }) => (
        <div className="w-[44px] min-w-[44px] truncate font-bold">
          {(pageIndex - 1) * pageSize + row.index + 1}
        </div>
      ),
    },
    {
      accessorKey: "comment_text",
      header: () => <div className="w-[220px] min-w-[220px]">Comment</div>,
      cell: ({ row }) => (
        <a
          href={row?.original?.comment_url ?? "#"}
          target="_blank"
          rel="noreferrer"
          className="block w-[220px] min-w-[220px] cursor-pointer truncate text-blue-500 font-bold"
        >
          {row?.original?.comment_text ?? "-"}
        </a>
      ),
    },
    {
      accessorKey: "comment_time",
      header: "Date",
      cell: ({ row }) =>
        row.getValue("comment_time")
          ? dayjs(row.getValue("comment_time")).format("DD MMM, YYYY")
          : "-",
    },
    {
      accessorKey: "source",
      header: () => <div className="w-[72px] min-w-[72px] text-center">Source</div>,
      cell: ({ row }) => <SourceBadge source={row.getValue("source")} />,
    },
    {
      accessorKey: "comment_likes",
      header: () => <div className="text-center">Comment Likes</div>,
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("comment_likes")}</div>
      ),
    },
    {
      accessorKey: "comment_replies",
      header: () => <div className="text-center">Comment Replies</div>,
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("comment_replies")}</div>
      ),
    },
    {
      accessorKey: "virality_score",
      header: () => <div className="text-center">Virality Score</div>,
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("virality_score")}</div>
      ),
    },
  ];

  const table = useReactTable({
    data: comments,
    columns: columns(page, limit),
    state: {
      sorting,
      pagination: {
        pageIndex: page - 1,
        pageSize: limit,
      },
    },
    manualPagination: true,
    manualSorting: true,
    onSortingChange: (updater) =>
      setSorting((current) => functionalUpdate(updater, current)),
    getCoreRowModel: getCoreRowModel(),
  });

  const lastPage = Math.max(1, Math.ceil(totalComments / limit));
  const visibleStart = totalComments === 0 ? 0 : limit * (page - 1) + 1;
  const visibleEnd =
    totalComments === 0
      ? 0
      : Math.min(limit * (page - 1) + comments.length, totalComments);

  const handlePageChange = (newPage) => {
    if (newPage > lastPage || newPage === 0) return;
    dispatch({ type: "SET_PAGE", payload: Number(newPage) });
  };

  return (
    <div className="mt-3">
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-300">
          Showing processed comments and reviews for the{" "}
          {activeMonthLabel.toLowerCase()}.
        </p>
        <div className="w-full sm:w-auto sm:min-w-[220px]">
          <div className="relative">
            <select
              id="all-comments-month-filter"
              value={selectedMonthFilter}
              onChange={(event) => setSelectedMonthFilter(event.target.value)}
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
      <div className="space-y-2">
        <div className="relative">
          <div className="max-h-[50vh] overflow-x-auto overflow-y-auto rounded-lg border sm:max-h-96">
            <table className="min-w-full table-fixed text-sm">
              <colgroup>
                <col style={{ width: "44px" }} />
                <col style={{ width: "220px" }} />
                <col style={{ width: "110px" }} />
                <col style={{ width: "72px" }} />
                <col />
                <col />
                <col />
                <col />
              </colgroup>
              <thead className="sticky top-0 z-30 bg-slate-50 dark:bg-slate-700">
                <TanstackTableHeader table={table} />
              </thead>
              <tbody>
                <TanstackTableBody
                  table={table}
                  data={comments}
                  loading={loading}
                  error={error}
                  isError={isError}
                  columns={columns(page, limit)}
                />
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {visibleStart} to {visibleEnd} of {totalComments} results
        </div>
        <div className="flex flex-row items-center justify-center">
          <button
            type="button"
            className="flex h-[36px] w-[36px] cursor-pointer items-center justify-center rounded-l-sm border border-[#B0B1B7] text-[#0D3D4B] disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
          >
            <ChevronLeft className="size-6" />
          </button>
          <button
            type="button"
            className="flex h-[36px] w-[36px] cursor-pointer items-center justify-center rounded-r-sm border border-[#B0B1B7] border-l-0 text-[#0D3D4B] disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400"
            onClick={() => handlePageChange(page + 1)}
            disabled={page === lastPage}
          >
            <ChevronRight className="size-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllComments;
