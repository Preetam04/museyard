"use client";

import { useToast } from "@/hooks/use-toast";
import { analysisLocal, analysisWithAI, LogAnalysis } from "@/lib/analysis";
import { MyContext } from "@/lib/context";
import { useContext, useState } from "react";
import AIDashboard, { ContentData } from "./ai-analysis";
import CategorizeContent from "./categorize-content";
import { Button } from "./ui/button";
import { LoaderCircle } from "lucide-react";

export default function Content() {
  const { text } = useContext(MyContext);
  const [aiData, setAiData] = useState<ContentData | undefined>({
    smartContentCategorization: {
      categories: [],
      confidenceScores: [],
    },
    themeDetection: {
      themes: [],
      dominantTheme: "",
    },
    patternRecognition: {
      patterns: [],
      patternDetails: [],
      frequencyAnalysis: {
        topPatterns: [],
      },
    },
    contentRelationshipMapping: {
      relationships: [],
    },
    insights: {
      organizedInsights: [],
      groupedThemes: {
        themes: [],
        themeCounts: [],
      },
    },
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [aiDataLoaded, setAiDataLoaded] = useState<boolean>(false);

  const [localData, setLocalData] = useState<LogAnalysis>({
    categories: {
      links: [],
      personalNotes: [],
      quotes: [],
      readingLists: [],
      timestamps: [],
    },
    timestampCounts: {},
  });

  const { toast } = useToast();

  const onAnalyze = async () => {
    if (text === "") {
      toast({
        title: "please upload a text file",
        variant: "destructive",
      });
      return;
    }
    const temp = await analysisLocal(JSON.parse(text));
    setLocalData(temp);
  };

  const onAnalyzeWithAI = async () => {
    if (text === "") {
      toast({
        title: "please upload a text file",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    onAnalyze();

    const aiResponse = await analysisWithAI(JSON.parse(text));
    setAiData(aiResponse);
    setAiDataLoaded(true);
    setLoading(false);
  };

  return (
    <div className="">
      <div className="flex items-center gap-4">
        <Button className="mt-4" onClick={onAnalyzeWithAI}>
          Analyze Content with AI
        </Button>
      </div>
      {loading && (
        <div className="w-full text-center flex justify-center  mt-2">
          <LoaderCircle size={52} className="animate-spin text-primary" />
        </div>
      )}

      {aiDataLoaded && (
        <div className=" flex w-full">
          <div className="w-1/2">
            <CategorizeContent data={localData} />
          </div>

          <div className="w-1/2">
            {aiDataLoaded && <AIDashboard data={aiData} />}
          </div>
        </div>
      )}
    </div>
  );
}
