'use client';

import { Bot } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';

export function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:h-16 sm:px-6 md:hidden">
      <SidebarTrigger />
      <div className="flex items-center gap-2">
        <Bot className="h-6 w-6 text-primary" />
        <span className="font-headline text-lg font-bold text-primary">
          BargainBot
        </span>
      </div>
    </header>
  );
}
