"use client";

import { Upload } from "lucide-react";
import { Button } from "./ui/button";
import { useContext, useEffect, useRef, useState } from "react";
import { Input } from "./ui/input";
import { useToast } from "@/hooks/use-toast";
import { MyContext } from "@/lib/context";

export default function UploadText() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [textFile, setTextFile] = useState<File | null>(null);

  const { setText } = useContext(MyContext);

  const { toast } = useToast();

  const onButtonClick = () => {
    inputRef.current?.click();
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0].type === "text/plain") {
      setTextFile(e.target.files[0]);
    } else {
      toast({
        title: "Please upload valid text file",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (textFile?.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (event) => {
        setText(JSON.stringify(event.target?.result));
      };
      reader.readAsText(textFile);
    }
  }, [setText, textFile]);

  return (
    <div className="flex items-end gap-2">
      <Input
        value={textFile?.name || ""}
        onChange={(e) => {
          e.preventDefault();
        }}
        disabled={textFile ? false : true}
        className="w-full max-w-72 ring-1 ring-primary"
      />

      <Button size={"default"} variant={"outline"} onClick={onButtonClick}>
        <Upload /> Upload text
      </Button>

      <input
        type="file"
        accept="text/.txt"
        className="hidden"
        ref={inputRef}
        onChange={(e) => {
          handleFileChange(e);
        }}
      />
    </div>
  );
}
