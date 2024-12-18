"use client";

import { Button } from "./ui/button";

export default function Content() {
  return (
    <div className="">
      <div className="flex items-center gap-4">
        <Button className="mt-4">Analyze Text</Button>
        <Button className="mt-4">Analyze Text with AI</Button>
      </div>
    </div>
  );
}
