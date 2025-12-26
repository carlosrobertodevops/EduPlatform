"use client";

import { useMutation } from "@tanstack/react-query";
import { signUp } from "@/services/auth";
import { api } from "@/lib/api";

/* =========================
   SIGN UP
========================= */
export function useSignUp() {
  return useMutation({
    mutationFn: signUp,
  });
}

/* =========================
   ENROLL IN COURSE
========================= */
export function useEnrollInCourse() {
  return useMutation({
    mutationFn: async (courseId: string) => {
      const { data } = await api.post(`/courses/${courseId}/enroll/`);
      return data;
    },
  });
}

/* =========================
   ADD COURSE REVIEW
========================= */
export function useAddCourseReview() {
  return useMutation({
    mutationFn: async (payload: { courseId: string; rating: number; comment: string }) => {
      const { courseId, ...body } = payload;

      const { data } = await api.post(`/courses/${courseId}/reviews/`, body);

      return data;
    },
  });
}
