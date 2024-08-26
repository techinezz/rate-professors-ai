'use client';
import Image from "next/image";
import { ShineBorderDemo } from "./banner/page";
import ChatInterface from "./ChatInterface";
import Ripple from "@/components/magicui/ripple";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-24 overflow-hidden">
      {/* Ripple Effect as Full-Page Background */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, transform: 'scale(2)' }}>
        <Ripple />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        <ShineBorderDemo />
        <ChatInterface />
      </div>
    </main>
  );
}
