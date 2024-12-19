import { LogAnalysis } from "@/lib/analysis";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { BookMarked, ExternalLink, PenLine, Quote } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import Link from "next/link";

export default function CategorizeContent({ data }: { data: LogAnalysis }) {
  const formatUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname.replace("www.", "");
      return (
        domain.split(".")[0].charAt(0).toUpperCase() +
        domain.split(".")[0].slice(1)
      );
    } catch {
      return url;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return timestamp.match(/\[(.*?)\]/)?.[1] || timestamp;
  };

  const parseNote = (note: string) => {
    const [timestamp, content] = note.split("] ");
    return {
      timestamp: formatTimestamp(timestamp + "]"),
      content: content.replace("you: ", ""),
    };
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl text-center ">
            Content Categorization
          </CardTitle>
        </CardHeader>
      </Card>

      <Tabs defaultValue="links" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="links">Links</TabsTrigger>
          <TabsTrigger value="quotes">Quotes</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="reading">Reading List</TabsTrigger>
        </TabsList>

        <TabsContent value="links" className="space-y-4">
          <ScrollArea className="h-[600px] pr-4">
            {data?.categories.links.map((link, index) => (
              <Card key={index} className="mb-4">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span className="font-medium">{formatUrl(link)}</span>
                  </div>
                  <Link href={link}>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="quotes" className="space-y-4">
          <ScrollArea className="h-[600px] pr-4">
            {data.categories.quotes.map((quote, index) => (
              <Card key={index} className="mb-4">
                <CardContent className="p-4">
                  <div className="flex space-x-4">
                    <Quote className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                    <p className="text-card-foreground italic">{quote}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <ScrollArea className="h-[600px] pr-4">
            {data.categories.personalNotes.map((note, index) => {
              const { timestamp, content } = parseNote(note);
              return (
                <Card key={index} className="mb-4">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <PenLine className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-card-foreground/50">
                          {timestamp}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-card-foreground whitespace-pre-wrap">
                      {content}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="reading" className="space-y-4">
          <ScrollArea className="h-[600px] pr-4">
            {data.categories.readingLists.map((book, index) => (
              <Card key={index} className="mb-4">
                <CardContent className="flex items-center space-x-4 p-4">
                  <BookMarked className="w-4 h-4 text-gray-400" />
                  <span className="text-card-foreground">{book}</span>
                </CardContent>
              </Card>
            ))}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
