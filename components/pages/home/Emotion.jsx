import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import EmotionBarChart from "./EmotionBarChart";
import EmotionDonutChart from "./EmotionDonutChart";

const Emotion = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-stretch">
      {/* Left Card */}
      <div className="flex flex-col">
        <Card className="flex flex-col flex-grow border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm h-full">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">
              Emotion Detection
            </CardTitle>
            <CardDescription className="text-sm">
              Detailed emotion breakdown across all posts and comments
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <EmotionBarChart />
          </CardContent>
        </Card>
      </div>

      {/* Right Card */}
      <div className="flex flex-col">
        <Card className="flex flex-col flex-grow border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm h-full">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">
              Post & Comments Categories
            </CardTitle>
            <CardDescription className="text-sm">
              Detailed emotion breakdown across all posts and comments
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <EmotionDonutChart />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default Emotion;
