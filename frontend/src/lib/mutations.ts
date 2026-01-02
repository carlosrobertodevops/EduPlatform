// "use client";

// import { useMutation } from "@tanstack/react-query";
// import api from "@/lib/api";
// import { signIn, signUp } from "@/services/auth";

// /* =========================
//    AUTH
// ========================= */
// export function useSignUp() {
//   return useMutation({
//     mutationFn: signUp,
//   });
// }

// export function useSignIn() {
//   return useMutation({
//     mutationFn: signIn,
//   });
// }

// /* =========================
//    COURSES / REVIEWS
// ========================= */
// export function useEnrollCourse() {
//   return useMutation({
//     mutationFn: async (courseId: string) => {
//       const res = await api.post(`/api/v1/courses/${courseId}/enroll/`);
//       return res.data;
//     },
//   });
// }

// export function useSubmitReview() {
//   return useMutation({
//     mutationFn: async ({ courseId, rating, comment }: { courseId: string; rating: number; comment: string }) => {
//       const res = await api.post(`/api/v1/courses/${courseId}/reviews/`, {
//         rating,
//         comment,
//       });
//       return res.data;
//     },
//   });
// }
"use client";

import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import { signIn, signUp } from "@/services/auth";

/* =========================
   AUTH
========================= */
export function useSignUp() {
  return useMutation({
    mutationFn: signUp,
  });
}

export function useSignIn() {
  return useMutation({
    mutationFn: signIn,
  });
}

/* =========================
   COURSES / REVIEWS
========================= */
export function useEnrollCourse() {
  return useMutation({
    mutationFn: async (courseId: string) => {
      const res = await api.post(`/api/v1/courses/${courseId}/enroll/`);
      return res.data;
    },
  });
}

export function useSubmitReview() {
  return useMutation({
    mutationFn: async ({ courseId, rating, comment }: { courseId: string; rating: number; comment: string }) => {
      const res = await api.post(`/api/v1/courses/${courseId}/reviews/`, {
        rating,
        comment,
      });
      return res.data;
    },
  });
}
