"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";

export function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex h-screen bg-background">
        <div className="hidden md:flex md:w-64 md:flex-col">
          <div className="flex flex-col flex-grow pt-5 bg-card border-r">
            <div className="flex items-center flex-shrink-0 px-4 mb-8">
              <Skeleton className="h-8 w-8 rounded" />
              <Skeleton className="ml-2 h-6 w-32" />
            </div>
            <div className="flex-1 px-2 space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full rounded-md" />
              ))}
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col">
          <div className="bg-card border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                <Skeleton className="h-10 w-64 rounded-md" />
                <Skeleton className="h-10 w-20 rounded-md" />
              </div>
              <div className="flex items-center space-x-2">
                <Skeleton className="h-10 w-10 rounded-md" />
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>
            </div>
          </div>
          <main className="flex-1 p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 rounded-lg" />
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-64 rounded-lg" />
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!session) {
    return null; // The useEffect will handle the redirect
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}