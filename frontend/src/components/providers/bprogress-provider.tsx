// "use client";

// import { ProgressProvider } from "@bprogress/next/app";

// export const BProgressProvider = ({ children }: { children: React.ReactNode }) => {
//     return <ProgressProvider height="4px" color="#1c6bfd">{children}</ProgressProvider>
// }
"use client";

/**
 * Route-change progress indicator.
 *
 * The previous implementation relied on `@bprogress/next` exports that
 * are not compatible with the current Next.js/React versions in this repo,
 * causing runtime errors such as:
 *  - "Element type is invalid ... got: undefined"
 *  - "Function.prototype.apply was called on #<Object>"
 *
 * To keep the app stable, we currently render children without a progress
 * provider. If you want a progress bar later, prefer a library that
 * explicitly supports Next.js App Router + React 19.
 */
export const BProgressProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};
