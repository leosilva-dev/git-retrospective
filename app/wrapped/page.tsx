"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import LoadingScreen from "@/components/LoadingScreen";

export default function WrappedPage() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      window.location.href = "/";
      return;
    }

    // Redirect to username-based route
    if (session?.username) {
      window.location.href = `/wrapped/${session.username}`;
    }
  }, [status, session]);

  return <LoadingScreen />;
}
