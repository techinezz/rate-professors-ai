'use client';
import Image from "next/image";
import { ShineBorderDemo } from "./banner/page";
import ChatInterface from "./ChatInterface";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <ShineBorderDemo />
      <ChatInterface />
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
      </div>
    </main>
  );
}
