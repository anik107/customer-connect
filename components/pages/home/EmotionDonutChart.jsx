import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getCategoriesAnalysis } from "@/services/emotion.service";
import { data } from "@/data/data";
import { Terminal } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const COLORS = {
  Inquiry: "#3B82F6",
  Suggestions: "#10B981",
  Complaint: "#F87171",
  Praise: "#FACC15",
  Other: "#6366F1",
};

const EmotionDonutChart = () => {
  const [categoryAnalysis, setCategoryAnalysis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { resolvedTheme } = useTheme();
  const [hidden, setHidden] = useState([]);

  const chartData = Object.entries(categoryAnalysis)
    .filter(([key]) => key !== "total_number_of_posts")
    .filter(([key]) => !hidden.includes(key))
    .map(([key, value]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value: parseFloat(value),
    }));

  useEffect(() => {
    // Use static category analysis from data.js
    setCategoryAnalysis(data.sentiment_analysis?.post_categories || {});
    setLoading(false);
  }, []);

  const handleToggle = (key) => {
    setHidden((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const getButtonStyle = (key) => {
    const name = key.charAt(0).toUpperCase() + key.slice(1);
    const isHidden = hidden.includes(key);
    const bg = isHidden ? "transparent" : COLORS[name];
    const fg = isHidden
      ? resolvedTheme === "dark"
        ? "#CBD5E1"
        : "#1E293B"
      : "white";
    return {
      backgroundColor: bg,
      color: fg,
      border: `1px solid ${COLORS[name]}`,
    };
  };

  const totalPosts = categoryAnalysis.total_number_of_posts;

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
      <>
        <div className="flex flex-wrap gap-2 mb-4 justify-center items-center">
          {Object.keys(categoryAnalysis)
            .filter((key) => key !== "total_number_of_posts")
            .map((key) => (
              <Button
                key={key}
                size="sm"
                variant="outline"
                onClick={() => handleToggle(key)}
                style={getButtonStyle(key)}
                className="transition-all"
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </Button>
            ))}
        </div>

        <div className="relative w-full h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={100}
                label
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>

          {/* Center label */}
          <div className="absolute top-[calc(50%-1rem)] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center -z-1">
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {totalPosts}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Total Posts
            </p>
          </div>
        </div>
      </>
    );
  }

  return content;
};
export default EmotionDonutChart;
