import GeoWrapper from "@/components/common/GeoWrapper";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import BankMentionsBarChart from "./BankMentionsBarChart";

const StrategicOverview = () => {
  return (
    <Card className="flex flex-col flex-grow border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm h-full">
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">Strategic overview</CardTitle>
        <CardDescription className="text-sm">
          Detailed emotion breakdown across all posts and comments
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-stretch">
          <div>
            <BankMentionsBarChart />
          </div>
          <div>
            <GeoWrapper />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
export default StrategicOverview;
