"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LoadingScreen from "@/components/LoadingScreen";

function WrappedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const params = searchParams.toString();
    const query = params ? `?${params}` : '';
    router.replace(`/wrapped/1${query}`);
  }, [router, searchParams]);

  return <LoadingScreen />;
}

export default function WrappedPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <WrappedContent />
    </Suspense>
  );
}
