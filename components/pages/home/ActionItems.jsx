"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { data } from "@/data/data";
import { Terminal } from "lucide-react";
import { useEffect, useState } from "react";

const ActionItems = () => {
  const [actionItems, setActionItems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Use static action items from data.js
    setActionItems(data.action_items || []);
    setLoading(false);
  }, []);

  let content = null;

  if (loading) {
    content = (
      <tr>
        <td colSpan={11} className="text-center p-2 sm:p-3 whitespace-nowrap">
          <Skeleton className="w-full aspect-video bg-slate-200 dark:bg-slate-700" />
        </td>
      </tr>
    );
  } else if (!loading && error) {
    content = (
      <tr>
        <td colSpan={11} className="text-center p-2 sm:p-3 whitespace-nowrap">
          <Alert variant="destructive">
            <Terminal />
            <AlertTitle>Error!</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </td>
      </tr>
    );
  } else if (!loading && !error && actionItems?.length === 0) {
    content = (
      <tr>
        <td colSpan={11} className="text-center p-2 sm:p-3 whitespace-nowrap">
          No posts found!
        </td>
      </tr>
    );
  } else {
    content = actionItems.map((row, index) => (
      <tr
        key={index}
        className="border-b hover:bg-slate-50/50 dark:hover:bg-slate-700/50"
      >
        <td className="sticky left-0 bg-white dark:bg-slate-800 p-2 sm:p-3 border-r whitespace-nowrap">
          <div className="w-[20px] min-w-[20px] truncate font-bold" title={index + 1}>
            {index + 1}
          </div>
        </td>
        <td className="p-2 sm:p-3 whitespace-nowrap">
          <a
            href={row?.post_url ?? "#"}
            target="_blank"
            rel="noreferrer"
            className="block w-[120px] min-w-[120px] cursor-pointer truncate text-blue-500 font-bold"
          >
            {row.text}
          </a>
        </td>
        <td className="p-2 sm:p-3 whitespace-nowrap capitalize">{row.type}</td>
        <td className="p-2 sm:p-3 whitespace-nowrap">{row.author_name}</td>
        <td className="p-2 sm:p-3 whitespace-nowrap text-center">
          {row.share_count}
        </td>
        <td className="p-2 sm:p-3 whitespace-nowrap text-center">
          {row.reaction_count}
        </td>
        <td className="p-2 sm:p-3 whitespace-nowrap text-center">
          {row.comments_count}
        </td>
        <td className="p-2 sm:p-3 whitespace-nowrap">{row.sentiment}</td>
        <td className="p-2 sm:p-3 whitespace-nowrap">{row.category}</td>
        <td className="p-2 sm:p-3 whitespace-nowrap">{row.emotion}</td>
        <td className="p-2 sm:p-3 whitespace-nowrap text-center">
          {row.virality_score}
        </td>
      </tr>
    ));
  }

  return (
    <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">Action Items</CardTitle>
        <CardDescription className="text-sm">
          Recommended actions based on sentiment analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <h1 className="mb-3 text-base sm:text-lg font-bold text-gray-500 dark:text-slate-100">
          Processed Posts Data
        </h1>
        <div className="relative">
          <div className="max-h-[50vh] overflow-x-auto overflow-y-auto rounded-lg border sm:max-h-96">
            <table className="min-w-full table-fixed text-xs sm:text-sm">
              <colgroup>
                <col style={{ width: "44px" }} />
                <col style={{ width: "100px" }} />
                <col />
                <col />
                <col />
                <col />
                <col />
                <col />
                <col />
                <col />
                <col />
              </colgroup>
              <thead className="sticky top-0 z-30 bg-slate-50 dark:bg-slate-700">
                <tr className="border-b">
                  <th className="sticky left-0 top-0 bg-slate-50 dark:bg-slate-700 p-2 sm:p-3 text-left font-medium border-r whitespace-nowrap z-[50]">
                    <div className="w-[44px] min-w-[44px]">#</div>
                  </th>
                  <th className="sticky top-0 bg-slate-50 dark:bg-slate-700 p-2 sm:p-3 text-left font-medium min-w-[100px] whitespace-nowrap z-40">
                    Text
                  </th>
                  <th className="p-2 sm:p-3 font-medium min-w-[100px] whitespace-nowrap text-left">
                    Type
                  </th>
                  <th className="p-2 sm:p-3 font-medium min-w-[100px] whitespace-nowrap text-left">
                    Person Name
                  </th>
                  <th className="p-2 sm:p-3 font-medium min-w-[100px] whitespace-nowrap text-center">
                    Share Count
                  </th>
                  <th className="p-2 sm:p-3 text-center font-medium min-w-[60px] whitespace-nowrap">
                    Reaction Count
                  </th>
                  <th className="p-2 sm:p-3 text-center font-medium min-w-[100px] whitespace-nowrap">
                    Comment Count
                  </th>
                  <th className="p-2 sm:p-3 text-left font-medium min-w-[60px] whitespace-nowrap">
                    Sentiment
                  </th>
                  <th className="p-2 sm:p-3 text-left font-medium min-w-[80px] whitespace-nowrap">
                    Category
                  </th>
                  <th className="p-2 sm:p-3 text-left font-medium min-w-[80px] whitespace-nowrap">
                    Emotion
                  </th>
                  <th className="p-2 sm:p-3 text-center font-medium min-w-[80px] whitespace-nowrap">
                    Virality Score
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
