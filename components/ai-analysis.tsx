// Types
interface ContentCategorization {
  categories: string[];
  confidenceScores: number[];
}

interface ThemeDetection {
  themes: string[];
  dominantTheme: string;
}

interface PatternRecognition {
  patterns: string[];
  patternDetails: Array<{ occurrences: number }>;
  frequencyAnalysis: {
    topPatterns: Array<{ frequency: number }>;
  };
}

interface ContentRelationship {
  contentId: string;
  relationshipType: string;
}

interface GroupedThemes {
  themes: string[];
  themeCounts: {
    theme: string;
    count: number;
  };
}

interface Insights {
  organizedInsights: string[];
  groupedThemes: GroupedThemes;
}

export interface ContentData {
  smartContentCategorization: ContentCategorization;
  themeDetection: ThemeDetection;
  patternRecognition: PatternRecognition;
  contentRelationshipMapping: {
    relationships: ContentRelationship[];
  };
  insights: Insights;
}

interface AIDashboardProps {
  data: ContentData;
}

// Component
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Lightbulb } from "lucide-react";
import React from "react";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = [
  "#4F46E5",
  "#6366F1",
  "#818CF8",
  "#A5B4FC",
  "#C7D2FE",
  "#E0E7FF",
];

const AIDashboard: React.FC<AIDashboardProps> = ({ data }) => {
  const categoryChartData = data.smartContentCategorization.categories.map(
    (category, index) => ({
      name: category,
      score: Math.round(
        data.smartContentCategorization.confidenceScores[index] * 100
      ),
    })
  );

  const patternData = data.patternRecognition.patterns.map(
    (pattern, index) => ({
      name: pattern,
      value: data.patternRecognition.patternDetails[index].occurrences,
    })
  );

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto ">
      {/* Header with Dominant Theme */}
      <Card className="">
        <CardHeader>
          <CardTitle className="text-2xl text-center ">
            Content Analysis
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Categories Chart */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Category Confidence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryChartData}>
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    fontSize={10}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="score" fill="#4F46E5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Themes */}
        <Card>
          <CardHeader>
            <CardTitle>Active Themes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {data.themeDetection.themes.map((theme, index) => (
                <Badge key={index} variant="outline" className="px-3 py-1">
                  {theme}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pattern Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Pattern Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={patternData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {patternData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Insights */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Key Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-40">
              <div className="space-y-2">
                {data.insights.organizedInsights.map((insight, index) => (
                  <div key={index} className="p-3 rounded-lg">
                    <Lightbulb className="h-4 w-4 inline mr-2 text-indigo-600" />
                    {insight}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Relationships */}
        {/* <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Content Relationships</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-40">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.contentRelationshipMapping.relationships.map(
                  (relationship, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2  rounded-lg"
                    >
                      {getIconForRelationType(relationship.relationshipType)}
                      <span className="text-sm font-medium">
                        {relationship.relationshipType}
                      </span>
                      <span className="text-sm text-gray-500">
                        #{relationship.contentId}
                      </span>
                    </div>
                  )
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
};

export default AIDashboard;
