import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { data } from "@/data/data";
import { Terminal } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = {
  Neutral: "#9CA3AF",
  Joy: "#FACC15",
  Confusion: "#60A5FA",
  Frustration: "#EF4444",
};

const withPostCounts = (entries, totalPosts) => {
  if (!entries.length || !totalPosts) {
    return entries.map((entry) => ({ ...entry, postCount: 0 }));
  }

  const totalShare = entries.reduce((sum, entry) => sum + entry.value, 0);

  if (!totalShare) {
    return entries.map((entry) => ({ ...entry, postCount: 0 }));
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
    .map(({ remainder, ...entry }) => entry);
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) {
    return null;
  }

  const point = payload[0]?.payload;

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-lg dark:border-slate-600 dark:bg-slate-800">
      <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
        {point?.name}
      </p>
      <p className="text-sm font-medium text-slate-700 dark:text-slate-100">
        {point?.postCount || 0} posts
      </p>
    </div>
  );
};

const ManualLegend = ({ items }) => {
  return (
    <div className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm">
      {items.map((item) => (
        <div key={item.name} className="flex items-center gap-1.5">
          <span
            className="h-[10.5px] w-[14px]"
            style={{ backgroundColor: COLORS[item.name] || "#3B82F6" }}
          />
          <span
            className="font-medium"
            style={{ color: COLORS[item.name] || "#3B82F6" }}
          >
            {item.name}
          </span>
        </div>
      ))}
    </div>
  );
};

const EmotionBarChart = () => {
  const [emotions, setEmotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const emotionEntries = Object.entries(emotions).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value: parseFloat(value),
  }));
  const totalPosts = Number(
    data.sentiment_analysis?.post_categories?.total_number_of_posts || 0,
  );
  const chartData = withPostCounts(emotionEntries, totalPosts).map((entry) => ({
    ...entry,
    value: entry.postCount,
  }));

  useEffect(() => {
    // Use static emotion data from data.js
    setEmotions(data.sentiment_analysis?.emotion_distribution || {});
    setLoading(false);
  }, []);

  let content = null;

  if (loading) {
    content = <Skeleton className="w-full aspect-video" />;
  } else if (!loading && error) {
    content = (
      <Alert variant="destructive">
        <Terminal />
        <AlertTitle>Error!</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  } else {
    content = (
      <div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 10, right: 20, bottom: 30 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="postCount" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[entry.name] || "#3B82F6"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <ManualLegend items={chartData} />
      </div>
    );
  }

  return content;
};
export default EmotionBarChart;
