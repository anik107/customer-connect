"use client";

import TanstackTableBody from "@/components/common/TanstackTableBody";
import TanstackTableHeader from "@/components/common/TanstackTableHeader";
import { data } from "@/data/data";
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import dayjs from "dayjs";
import { debounce } from "lodash";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useReducer } from "react";

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

  const { page, limit, loading, totalComments, comments, isError, error } =
    state;

  const fetchComments = useCallback(() => {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "RESET_ERROR" });

    try {
      // Create dummy comments from posts data
      const allPosts = [...(data.action_items || []), ...(data.sentiment_analysis?.top_posts || [])];
      const dummyComments = allPosts.map((post, index) => ({
        id: index + 1,
        comment_text: `Comment on: ${(post.text || "Untitled post").substring(0, 50)}...`,
        comment_url: post.post_url,
        source: getSourceFromUrl(post.post_url),
        comment_likes: Math.floor(Math.random() * 20),
        comment_replies: Math.floor(Math.random() * 5),
        comment_time: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
        virality_score: Math.floor(Math.random() * 100),
      }));
      
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedComments = dummyComments.slice(startIndex, endIndex);
      
      dispatch({ type: "SET_COMMENTS", payload: paginatedComments });
      dispatch({ type: "SET_TOTAL_COMMENTS", payload: dummyComments.length });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: error.message || "Failed to fetch comments.",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [page, limit]);

  /**
   * debouncing fetch codes by useEffect
   */
  useEffect(() => {
    const debouncedFetch = debounce(() => {
      fetchComments();
    }, 500);

    debouncedFetch();

    return () => {
      debouncedFetch.cancel();
    };
  }, [fetchComments]);

  const columns = (pageIndex, pageSize) => [
    {
      id: "sl",
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
    // {
    //   accessorKey: "author_name",
    //   header: "Person Name",
    //   cell: ({ row }) => row.getValue("author_name"),
    // },
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
      accessorKey: "comment_time",
      header: "Date",
      cell: ({ row }) =>
        row.getValue("comment_time")
          ? dayjs(row.getValue("comment_time")).format("DD MMM, YYYY")
          : "-",
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
      pagination: {
        pageIndex: page - 1,
        pageSize: limit,
      },
    },
    manualPagination: true,
    manualSorting: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const lastPage = Math.max(1, Math.ceil(totalComments / limit));
  const visibleStart = totalComments === 0 ? 0 : limit * (page - 1) + 1;
  const visibleEnd =
    totalComments === 0
      ? 0
      : Math.min(limit * (page - 1) + comments.length, totalComments);
  /***
   * page change handler for react table
   * @param event
   * @param newPage
   */
  const handlePageChange = (newPage) => {
    if (newPage > lastPage || newPage === 0) return;
    dispatch({ type: "SET_PAGE", payload: Number(newPage) });
  };

  return (
    <div className="mt-3">
      <div className="space-y-2">
        <div className="relative">
          <div className="max-h-[50vh] overflow-x-auto overflow-y-auto rounded-lg border sm:max-h-96">
            <table className="min-w-full table-fixed text-sm">
              <colgroup>
                <col style={{ width: "44px" }} />
                <col style={{ width: "220px" }} />
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
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-gray-600">
          Showing {visibleStart} to {visibleEnd} of {totalComments} results
        </div>
        <div className="flex flex-row justify-center items-center">
          <button
            type="button"
            className="w-[36px] h-[36px] border border-[#B0B1B7] rounded-l-sm flex justify-center items-center text-[#0D3D4B] cursor-pointer disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
          >
            <ChevronLeft className="size-6" />
          </button>
          <button
            type="button"
            className="w-[36px] h-[36px] border border-[#B0B1B7] rounded-r-sm border-l-0 flex justify-center text-[#0D3D4B] items-center cursor-pointer disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
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
