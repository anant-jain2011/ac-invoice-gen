import "@/styles/globals.css";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function BackBar() {
  const router = useRouter();
  const [isRoot, setIsRoot] = useState(true);

  useEffect(() => {
    setIsRoot(router.pathname === "/");
  }, [router.pathname]);

  if (isRoot) return null;

  return (
    <div className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white px-4 py-2 shadow-sm">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 cursor-pointer"
      >
        <span className="text-lg">←</span>
        Back
      </button>
    </div>
  );
}

export default function App({ Component, pageProps }) {
  return (
    <>
      <BackBar />
      <Component {...pageProps} />
    </>
  );
}
