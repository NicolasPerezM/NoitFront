import { AnalysisTabs } from "./analysis-tabs";
import GeneralStats from "./GeneralStats/GeneralStats";
import FeedAnalyzer from "./feedAnalyzer/FeedAnalyzer.tsx";
import PostAnalyzer from "./postAnalyzer/PostAnalyzer";
import CommentsAnalyzer from "./commentsAnalyzer/CommentsAnalyzer";

export default function InstagramAccountAnalysis() {
  return (
    <AnalysisTabs
      defaultValue="general"
      children={{
        general: <GeneralStats />,
        feed: <FeedAnalyzer />,
        posts: <PostAnalyzer />,
        comments: <CommentsAnalyzer />,
      }}
    />
  );
}
