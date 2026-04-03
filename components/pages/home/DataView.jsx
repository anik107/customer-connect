"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AllComments from "./AllComments";
import AllPosts from "./AllPosts";

const DataView = () => {
  return (
    <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">
          Explore the Raw and Processed Data
        </CardTitle>
        <CardDescription className="text-sm">
          Complete dataset with all posts and their metrics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <h1 className="mb-3 text-base sm:text-lg font-bold text-gray-500 dark:text-slate-100">
          Processed Posts Data
        </h1>
        <AllPosts />
        <h1 className="mt-7 mb-3 text-base sm:text-lg font-bold text-gray-500 dark:text-slate-100">
          Processed Comments & Reviews Data
        </h1>
        <AllComments />
      </CardContent>
    </Card>
  );
};
export default DataView;
