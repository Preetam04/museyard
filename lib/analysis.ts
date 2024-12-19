// "use server";
import { ContentData } from "@/components/ai-analysis";
import OpenAI from "openai";

type Categories = {
  links: string[];
  quotes: string[];
  personalNotes: string[];
  readingLists: string[];
  timestamps: string[];
};

// Define TypeScript types for the complex structured data

type SmartContentCategorization = {
  categories: string[];
  confidenceScores: number[];
};

type ThemeDetection = {
  themes: string[];
  dominantTheme: string;
};

type PatternDetails = {
  occurrences: number;
};

type PatternRecognition = {
  patterns: string[];
  patternDetails: PatternDetails[];
  frequencyAnalysis: {
    topPatterns: {
      pattern: string;
      frequency: number;
    }[];
  };
};

type ContentRelationship = {
  contentId: string;
  relationshipType: string;
};

type ContentRelationshipMapping = {
  relationships: ContentRelationship[];
};

type Insights = {
  organizedInsights: string[];
  groupedThemes: {
    themes: string[];
    themeCounts: {
      theme: string;
      count: number;
    }[];
  };
};

export type DataAnalysis = {
  smartContentCategorization: SmartContentCategorization;
  themeDetection: ThemeDetection;
  patternRecognition: PatternRecognition;
  contentRelationshipMapping: ContentRelationshipMapping;
  insights: Insights;
};

type TimestampCounts = {
  [date: string]: number;
};

export type LogAnalysis = {
  categories: Categories;
  timestampCounts: TimestampCounts;
};

export async function analysisLocal(logs: string) {
  if (!logs) return;
  const categories = {
    links: [],
    quotes: [],
    personalNotes: [],
    readingLists: [],
    timestamps: [],
  } as Categories;

  const logEntries = logs.split("\n\n");

  logEntries.forEach((entry) => {
    const timestampMatch = entry.match(
      /\[\d{1,2}\/\d{1,2}\/\d{2,4}, \d{1,2}:\d{2}:\d{2} [AP]M\]/
    );
    const timestamp = timestampMatch ? timestampMatch[0] : null;

    if (timestamp) categories.timestamps.push(timestamp);

    if (entry.includes("http")) {
      const urls = entry.match(/https?:\/\/[^\s]+/g);
      if (urls) categories.links.push(...urls);
    } else if (entry.includes('"')) {
      const quoteMatch = entry.match(/"(.*?)"/);
      if (quoteMatch) categories.quotes.push(quoteMatch[1]);
    } else if (
      entry.includes("Reading list:") ||
      entry.includes("Need to finish these")
    ) {
      const readingItems = entry
        .split("\n")
        .filter((line) => line.startsWith("-"));
      categories.readingLists.push(
        ...readingItems.map((item) => item.replace("-", "").trim())
      );
    } else {
      categories.personalNotes.push(entry.trim());
    }
  });

  // Basic timestamp analysis
  const timestampCounts = categories.timestamps.reduce((acc, ts) => {
    const match = ts.match(/\d{1,2}\/\d{1,2}\/\d{2,4}/);
    if (match) {
      const date = match[0];
      acc[date] = (acc[date] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  return { categories, timestampCounts };
}

export async function analysisWithAI(text: string) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  if (!text) return;
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "developer",
          content:
            "Extract and categorize different content types: Smart content categorization, Theme detection, Pattern recognition, Content relationship mapping. Also Show relationships between parsed content, Group similar topics/themes,Display basic frequency analysis, Present insights in a clean, organized way",
        },
        {
          role: "user",
          content: text,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "content_analysis_schema",
          schema: {
            type: "object",
            properties: {
              smartContentCategorization: {
                type: "object",
                properties: {
                  categories: {
                    description: "List of identified content categories",
                    type: "array",
                    items: {
                      type: "string",
                    },
                  },
                  confidenceScores: {
                    description:
                      "Confidence scores associated with each category",
                    type: "array",
                    items: {
                      type: "number",
                    },
                  },
                },
                required: ["categories", "confidenceScores"],
                additionalProperties: false,
              },
              themeDetection: {
                type: "object",
                properties: {
                  themes: {
                    description: "List of identified themes in the content",
                    type: "array",
                    items: {
                      type: "string",
                    },
                  },
                  dominantTheme: {
                    description: "The most dominant theme identified",
                    type: "string",
                  },
                },
                required: ["themes", "dominantTheme"],
                additionalProperties: false,
              },
              patternRecognition: {
                type: "object",
                properties: {
                  patterns: {
                    description: "List of recognized patterns in the content",
                    type: "array",
                    items: {
                      type: "string",
                    },
                  },
                  patternDetails: {
                    description: "Detailed information about each pattern",
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        pattern: {
                          description: "The pattern recognized",
                          type: "string",
                        },
                        occurrences: {
                          description: "Number of occurrences of the pattern",
                          type: "integer",
                        },
                      },
                      required: ["pattern", "occurrences"],
                      additionalProperties: false,
                    },
                  },
                  frequencyAnalysis: {
                    description: "Basic frequency analysis of the patterns",
                    type: "object",
                    properties: {
                      topPatterns: {
                        description: "Top patterns identified by frequency",
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            pattern: {
                              description: "The pattern",
                              type: "string",
                            },
                            frequency: {
                              description: "The frequency of the pattern",
                              type: "integer",
                            },
                          },
                          required: ["pattern", "frequency"],
                          additionalProperties: false,
                        },
                      },
                    },
                    required: ["topPatterns"],
                    additionalProperties: false,
                  },
                },
                required: ["patterns", "patternDetails", "frequencyAnalysis"],
                additionalProperties: false,
              },
              contentRelationshipMapping: {
                type: "object",
                properties: {
                  relationships: {
                    description:
                      "Relationships between different content pieces",
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        contentId: {
                          description: "Identifier for the content",
                          type: "string",
                        },
                        relationshipType: {
                          description: "Type of relationship with the content",
                          type: "string",
                        },
                      },
                      required: ["contentId", "relationshipType"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["relationships"],
                additionalProperties: false,
              },
              insights: {
                type: "object",
                properties: {
                  organizedInsights: {
                    description:
                      "Clean and organized insights from the content analysis",
                    type: "array",
                    items: {
                      type: "string",
                    },
                  },
                  groupedThemes: {
                    description: "Grouped similar topics/themes",
                    type: "object",
                    properties: {
                      themes: {
                        description: "Grouped themes",
                        type: "array",
                        items: {
                          type: "string",
                        },
                      },
                      themeCounts: {
                        description: "Counts of themes in the grouped insights",
                        type: "object",
                        properties: {
                          theme: {
                            description: "Theme name",
                            type: "string",
                          },
                          count: {
                            description: "Number of occurrences",
                            type: "integer",
                          },
                        },
                        required: ["theme", "count"],
                        additionalProperties: false,
                      },
                    },
                    required: ["themes", "themeCounts"],
                    additionalProperties: false,
                  },
                },
                required: ["organizedInsights", "groupedThemes"],
                additionalProperties: false,
              },
            },
            required: [
              "smartContentCategorization",
              "themeDetection",
              "patternRecognition",
              "contentRelationshipMapping",
              "insights",
            ],
            additionalProperties: false,
          },
        },
      },
    });

    const data =
      response?.choices[0].message.content &&
      JSON.parse(response?.choices[0].message.content);

    return data as ContentData;
  } catch (error) {
    console.log(error);
  }
}
