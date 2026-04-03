import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import ActionItems from "./ActionItems";
import AiOverview from "./AiOverview";
import DataView from "./DataView";
import Emotion from "./Emotion";
import SentimentDistribution from "./SentimentDistribution";
import StrategicOverview from "./StrategicOverview";
import TopVirtualPosts from "./TopVirtualPosts";

const SocialTabs = () => {
  const [activeTab, setActiveTab] = useState("sentiment");
  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="space-y-4 sm:space-y-6"
    >
      <div className="overflow-x-auto">
        <TabsList className="grid w-full grid-cols-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border shadow-sm min-w-[600px] sm:min-w-0">
          <TabsTrigger
            value="sentiment"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-xs sm:text-sm px-2 sm:px-4"
          >
            <span className="hidden sm:inline">Sentiment & Virality</span>
            <span className="sm:hidden">Sentiment</span>
          </TabsTrigger>
          <TabsTrigger
            value="emotions"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-xs sm:text-sm px-2 sm:px-4"
          >
            <span className="hidden sm:inline">Emotions & Categories</span>
            <span className="sm:hidden">Emotions</span>
          </TabsTrigger>
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-xs sm:text-sm px-2 sm:px-4"
          >
            <span className="hidden sm:inline">Strategic Overview</span>
            <span className="sm:hidden">Overview</span>
          </TabsTrigger>
          <TabsTrigger
            value="actions"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-xs sm:text-sm px-2 sm:px-4"
          >
            <span className="hidden sm:inline">Action Items</span>
            <span className="sm:hidden">Actions</span>
          </TabsTrigger>
          <TabsTrigger
            value="ai_overview"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-xs sm:text-sm px-2 sm:px-4"
          >
            <span className="hidden sm:inline">AI Overview</span>
            <span className="sm:hidden">AI</span>
          </TabsTrigger>
          <TabsTrigger
            value="data"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-xs sm:text-sm px-2 sm:px-4"
          >
            <span className="hidden sm:inline">Full Data View</span>
            <span className="sm:hidden">Data</span>
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="sentiment" className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          <SentimentDistribution />

          <TopVirtualPosts />
        </div>
      </TabsContent>

      <TabsContent value="emotions" className="space-y-4 sm:space-y-6">
        <Emotion />
      </TabsContent>

      <TabsContent value="overview" className="space-y-4 sm:space-y-6">
        <StrategicOverview />
      </TabsContent>

      <TabsContent value="actions" className="space-y-4 sm:space-y-6">
        <ActionItems />
      </TabsContent>

      <TabsContent value="ai_overview" className="space-y-4 sm:space-y-6">
        <AiOverview />
      </TabsContent>

      <TabsContent value="data" className="space-y-4 sm:space-y-6">
        <DataView />
      </TabsContent>
    </Tabs>
  );
};
export default SocialTabs;
