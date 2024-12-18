"use client";
import DarkModeBtn from "./dark-mode-btn";

export default function Navbar() {
  return (
    <nav className="text-2xl px-8 py-6 shadow-md flex items-center justify-between">
      <h1 className="text-foreground font-bold capitalize tracking-tight">
        Whatsapp <span className="text-primary">chat analyzer</span>
      </h1>
      <DarkModeBtn />
    </nav>
  );
}
