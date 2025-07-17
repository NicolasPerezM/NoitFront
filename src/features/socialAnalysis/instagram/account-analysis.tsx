import { AnalysisTabs } from "./analysis-tabs";
import GeneralStats from "./GeneralStats/GeneralStats.tsx";
// import FeedAnalyzer from "./feedAnalyzer/FeedAnalyzer.tsx";
import FeedAnalysisViewer from "./feedAnalyzer/FeedAnalysisViewer";
// import PostAnalyzer from "./postAnalyzer/PostAnalyzer";
import CommentsAnalyzer from "./commentsAnalyzer/CommentsAnalyzer";
import CompetitorInstagramAnalysis from "../components/CompetitorInstagramAnalysis";

interface InstagramAccountAnalysisProps {
  competitorId: string;
}

export default function InstagramAccountAnalysis({ competitorId }: InstagramAccountAnalysisProps) {
  return (
    <AnalysisTabs
      defaultValue="general"
      children={{
        general: <CompetitorInstagramAnalysis competitorId={competitorId} />,
        feed: <FeedAnalysisViewer competitorId={competitorId} />,
        posts: <GeneralStats competitorId={competitorId} />,
        comments: <CommentsAnalyzer competitorId={competitorId} />,
      }}
    />
  );
}
