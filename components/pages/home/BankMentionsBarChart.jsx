"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { getBankMentions } from "@/services/strategicOverview.service";
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

const BANK_LABELS = {
  prime_bank: "Prime Bank",
  eastern_bank: "Eastern Bank",
  brac_bank: "BRAC Bank",
  city_bank: "City Bank",
  dutch_bangla: "Dutch-Bangla Bank",
};

const COLORS = ["#3B82F6", "#6366F1", "#10B981", "#F59E0B", "#EF4444"];

const formatBankName = (key = "") =>
  BANK_LABELS[key] ||
  key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

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
        {point?.value || 0} mentions
      </p>
    </div>
  );
};

const ManualLegend = ({ items }) => (
  <div className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm">
    {items.map((item) => (
      <div key={item.name} className="flex items-center gap-1.5">
        <span
          className="h-[10.5px] w-[14px]"
          style={{ backgroundColor: item.color }}
        />
        <span className="font-medium" style={{ color: item.color }}>
          {item.name}
        </span>
      </div>
    ))}
  </div>
);

export default function BankMentionsBarChart() {
  const [bankMentions, setBankMentions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const chartData = Object.entries(bankMentions)
    .filter(([key]) => key !== "total_bank_mentions")
    .map(([key, value], index) => ({
      key,
      name: formatBankName(key),
      value: parseFloat(value),
      color: COLORS[index % COLORS.length],
    }));

  useEffect(() => {
    let ignore = false;
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getBankMentions();
        
        if (!ignore && response?.data) {
          setBankMentions(response?.data);
        }
      } catch (error) {
        if (!ignore) {
          setError(error.message);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    if (!ignore) {
      fetchData();
    }

    return () => {
      ignore = true;
    };
  }, []);

  let content = null;

  if (loading) {
    content = <Skeleton className="h-[500px] w-full" />;
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
      <div className="flex h-[500px] flex-col">
        <div className="min-h-0 flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 20, left: 0, bottom: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <ManualLegend items={chartData} />
      </div>
    );
  }

  return content;
}
