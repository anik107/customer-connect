"use client";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { aiOverview as fallbackAiOverview } from "@/data/ai-overview";
import { Skeleton } from "@/components/ui/skeleton";
import { getAiOverview } from "@/services/aiOverview.service";

const formatTitle = (str) => {
    return str.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
};
const getCategoryStyles = (category) => {
    const styles = {
        complaints: { bg: "bg-red-50", text: "text-red-700", border: "border-red-100", badge: "bg-red-100 text-red-600" },
        inquiry: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-100", badge: "bg-amber-100 text-amber-600" },
        praise: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-100", badge: "bg-emerald-100 text-emerald-600" },
        suggestions: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-100", badge: "bg-purple-100 text-purple-600" },
    };
    return styles[category] || styles.complaints;
};

const LoadingState = () => (
    <div className="space-y-12">
        {[1, 2].map((i) => (
            <div key={i}>
                <div className="flex items-center gap-4 mb-8">
                    <Skeleton className="h-6 w-24 rounded-full" />
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-px flex-1" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((j) => (
                        <Skeleton key={j} className="h-40 w-full rounded-2xl" />
                    ))}
                </div>
            </div>
        ))}
    </div>
);

export default function AiOverview() {
    const [modalData, setModalData] = useState(null);
    const [aiOverviews, setAiOverviews] = useState(fallbackAiOverview);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        let ignore = false;
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await getAiOverview();
                if (!ignore) {
                    // Use optional chaining and fallback to ensure data is never null
                    setAiOverviews(response?.data ?? fallbackAiOverview);
                }
            } catch (error) {
                if (!ignore) {
                    setError(error.message);
                    setAiOverviews(fallbackAiOverview); // Fallback on error
                }
            } finally {
                if (!ignore) setLoading(false);
            }
        };
        fetchData();
        return () => { ignore = true; };
    }, []);

    useEffect(() => {
        const handleEsc = (e) => { if (e.key === "Escape") setModalData(null); };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, []);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    return (
        <div className="rounded-[20px] border border-slate-200/80 bg-white/90 text-slate-900 shadow-lg backdrop-blur-sm font-sans dark:border-[#2c3b57] dark:bg-[#202d45] dark:text-slate-100">
            <div className="max-w-7xl mx-auto px-6 py-8 sm:px-8 sm:py-10">
                <div className="mb-10">
                    <div data-slot="card-title" className="font-semibold text-lg sm:text-xl">
                        AI Overview
                    </div>
                    <div data-slot="card-description" className="text-muted-foreground mt-1 text-sm leading-[1.6]">
                        Detailed emotion breakdown across all posts and comments. Each insight below is generated from multiple Facebook posts. Click any item to open a detailed popup with explanation and links to all related posts.
                    </div>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-xl border border-red-200 dark:border-red-500/30 dark:bg-red-500/15 dark:text-red-300">
                        Warning: Failed to fetch latest data. Showing cached overview.
                    </div>
                )}

                {/* Dynamic Sections */}
                {loading ? (
                    <LoadingState />
                ) : (
                    <div className="space-y-16">
                        {Object.entries(aiOverviews).map(([catKey, catValue]) => {
                            const style = getCategoryStyles(catKey);
                            // Ensure insights exists (handle suggestions vs analysis naming)
                            const insights = catValue?.analysis || catValue?.ai_recommendations;

                            if (!insights) return null;
                            return (
                                <section key={catKey}>
                                    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                                        <div className="flex items-center gap-3">
                                            <span className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest ${style.badge}`}>
                                                {catKey}
                                            </span>
                                            <h2 className="font-semibold text-lg sm:text-xl">{ catKey[0].toUpperCase() + catKey.slice(1)}</h2>
                                        </div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Click any insight to view evidence and related Facebook posts</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {Object.entries(insights).map(([key, value]) => (
                                            <div
                                                key={key}
                                                onClick={() => setModalData({ title: formatTitle(key), content: value, type: catKey })}
                                                className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(15,23,42,0.12)] hover:border-blue-200 cursor-pointer dark:border-[#31415d] dark:bg-[#24324a] dark:hover:border-blue-500/40"
                                            >
                                                <h3 className="font-semibold text-lg sm:text-md text-slate-900 dark:text-slate-100">
                                                    {formatTitle(key)}
                                                </h3>
                                                <p className="text-sm text-slate-500 leading-relaxed dark:text-slate-300">
                                                    {Array.isArray(value) ? value.join(", ") : value}
                                                </p>
                                                <div className="mt-4 text-xs font-semibold text-blue-600 flex items-center justify-end gap-1">
                                                    Click to view related posts
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {mounted && modalData && createPortal(
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/55 transition-opacity duration-150"
                    onClick={() => setModalData(null)}
                >
                    <div
                        className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden transform-gpu transition-transform duration-150 ease-out dark:bg-slate-800"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="p-6 border-b border-slate-200 flex items-start justify-between dark:border-slate-700">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{modalData.title}</h3>
                                <p className="text-sm text-slate-500 mt-1 dark:text-slate-300">
                                    {Array.isArray(modalData.content)
                                        ? modalData.content.join(", ")
                                        : modalData.content}
                                </p>
                            </div>
                            <button
                                onClick={() => setModalData(null)}
                                className="ml-4 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors dark:bg-blue-500/15 dark:text-blue-300 dark:hover:bg-blue-500/25"
                                aria-label="Close modal"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6 max-h-[70vh] overflow-y-auto">
                            <div className="pb-6 border-b border-slate-200 dark:border-slate-700">
                                <h4 className="text-sm font-bold text-slate-800 mb-2 dark:text-slate-100">Detailed Explanation</h4>
                                <p className="text-sm text-slate-600 leading-relaxed dark:text-slate-300">
                                    {Array.isArray(modalData.content)
                                        ? modalData.content.join(" ")
                                        : modalData.content}
                                </p>
                            </div>

                            <div className="pt-6">
                                <h4 className="text-sm font-bold text-slate-800 mb-4 dark:text-slate-100">Related Facebook Posts</h4>
                                <div className="space-y-3">
                                    {(Array.isArray(modalData.content)
                                        ? modalData.content.slice(0, 3)
                                        : [modalData.content]
                                    ).map((item, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 p-4 dark:border-slate-700 dark:bg-slate-900/40"
                                        >
                                            <div>
                                                <div className="text-xs text-slate-500 mb-1 dark:text-slate-400">Facebook Post</div>
                                                <div className="text-sm text-slate-800 dark:text-slate-100">{item}</div>
                                            </div>
                                            <button
                                                className="post-link-icon"
                                                aria-label="Open post"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5h5m0 0v5m0-5L10 14" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 19h10a2 2 0 0 0 2-2V9" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                , document.body)}
            <style jsx global>{`
                .post-link-icon {
                    width: 40px;
                    height: 40px;
                    min-width: 40px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    text-decoration: none;
                    color: var(--primary);
                    background: #eff6ff;
                    border: 1px solid #bfdbfe;
                    border-radius: 12px;
                    transition: all 0.2s ease;
                }

                .post-link-icon:hover {
                    background: #2563eb;
                    color: white;
                    transform: translateY(-1px);
                }

                .dark .post-link-icon {
                    color: #93c5fd;
                    background: rgba(59, 130, 246, 0.15);
                    border-color: rgba(59, 130, 246, 0.3);
                }

                .post-link-icon svg {
                    width: 18px;
                    height: 18px;
                }
            `}</style>
        </div>
    );
}
