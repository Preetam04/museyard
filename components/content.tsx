"use client";

import { useContext, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { MyContext } from "@/lib/context";
import { useToast } from "@/hooks/use-toast";
import { link } from "fs";

interface Idata {
  links: string[];
}

export default function Content() {
  const { text } = useContext(MyContext);

  const [data, setData] = useState<Idata>({
    links: [],
  });

  const { toast } = useToast();

  const onAnalyze = () => {
    if (text === "") {
      toast({
        title: "please upload a text file",
        variant: "destructive",
      });
      return;
    }
    console.log(JSON.parse(text).split("\\n"));
  };

  return (
    <div className="">
      <div className="flex items-center gap-4">
        <Button className="mt-4" onClick={onAnalyze}>
          Analyze Text
        </Button>
        <Button className="mt-4">Analyze Text with AI</Button>
      </div>
    </div>
  );
}
