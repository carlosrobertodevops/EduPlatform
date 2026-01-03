import { useCallback, useState } from "react";
import { api } from "@/lib/api";

type MutState<T> = {
  mutateAsync: (input: any) => Promise<T>;
  isLoading: boolean;
  error: Error | null;
};

function useSimpleMutation<T>(fn: (input: any) => Promise<T>): MutState<T> {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutateAsync = useCallback(
    async (input: any) => {
      setLoading(true);
      setError(null);
      try {
        return await fn(input);
      } catch (e: any) {
        setError(e);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [fn],
  );

  return { mutateAsync, isLoading, error };
}

// ===== AUTH =====

export function useSignIn(): MutState<any> {
  return useSimpleMutation(
    async (input: { email?: string; username?: string; password: string }) => {
      // Sempre com "/" no final (e backend aceita com/sem)
      return await api.post(`/api/v1/accounts/signin/`, input);
    },
  );
}

export function useSignUp(): MutState<any> {
  return useSimpleMutation(
    async (input: {
      name?: string;
      email: string;
      password: string;
      password_confirmation?: string;
    }) => {
      return await api.post(`/api/v1/accounts/signup/`, input);
    },
  );
}

// ===== COURSES =====

export function useEnrollInCourse(): MutState<any> {
  return useSimpleMutation(async (input: { courseId: string }) => {
    return await api.post(`/api/v1/courses/${input.courseId}/enroll`, {});
  });
}

export function useAddCourseReview(): MutState<any> {
  return useSimpleMutation(
    async (input: { courseId: string; rating: number; comment?: string }) => {
      return await api.post(`/api/v1/courses/${input.courseId}/reviews`, {
        rating: input.rating,
        comment: input.comment,
      });
    },
  );
}

export function useMarkLessonAsWatched(): MutState<any> {
  return useSimpleMutation(
    async (input: { courseId: string; lessonId: string }) => {
      return await api.post(
        `/api/v1/courses/${input.courseId}/lessons/${input.lessonId}/watched`,
        {},
      );
    },
  );
}