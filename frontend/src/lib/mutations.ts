// import { useCallback, useState } from "react";
// import { api } from "@/lib/api";

// type MutState<T> = {
//   mutateAsync: (input: any) => Promise<T>;
//   isLoading: boolean;
//   error: Error | null;
// };

// function useSimpleMutation<T>(fn: (input: any) => Promise<T>): MutState<T> {
//   const [isLoading, setLoading] = useState(false);
//   const [error, setError] = useState<Error | null>(null);

//   const mutateAsync = useCallback(
//     async (input: any) => {
//       setLoading(true);
//       setError(null);
//       try {
//         return await fn(input);
//       } catch (e: any) {
//         setError(e);
//         throw e;
//       } finally {
//         setLoading(false);
//       }
//     },
//     [fn],
//   );

//   return { mutateAsync, isLoading, error };
// }

// // ===== AUTH =====

// export function useSignIn(): MutState<any> {
//   return useSimpleMutation(
//     async (input: { email?: string; username?: string; password: string }) => {
//       // Sempre com "/" no final (e backend aceita com/sem)
//       return await api.post(`/api/v1/accounts/signin/`, input);
//     },
//   );
// }

// export function useSignUp(): MutState<any> {
//   return useSimpleMutation(
//     async (input: {
//       name?: string;
//       email: string;
//       password: string;
//       password_confirmation?: string;
//     }) => {
//       return await api.post(`/api/v1/accounts/signup/`, input);
//     },
//   );
// }

// // ===== COURSES =====

// export function useEnrollInCourse(): MutState<any> {
//   return useSimpleMutation(async (input: { courseId: string }) => {
//     return await api.post(`/api/v1/courses/${input.courseId}/enroll`, {});
//   });
// }

// export function useAddCourseReview(): MutState<any> {
//   return useSimpleMutation(
//     async (input: { courseId: string; rating: number; comment?: string }) => {
//       return await api.post(`/api/v1/courses/${input.courseId}/reviews`, {
//         rating: input.rating,
//         comment: input.comment,
//       });
//     },
//   );
// }

// export function useMarkLessonAsWatched(): MutState<any> {
//   return useSimpleMutation(
//     async (input: { courseId: string; lessonId: string }) => {
//       return await api.post(
//         `/api/v1/courses/${input.courseId}/lessons/${input.lessonId}/watched`,
//         {},
//       );
//     },
//   );
// }

import { useCallback, useState } from "react";
import { api } from "@/lib/api";

type MutState<T> = {
  mutateAsync: (input: any) => Promise<T>;
  // compat com seu código atual (pages usam isPending)
  isPending: boolean;
  // opcional (caso use em outros lugares)
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
        // Não estoure erro no React sem tratar.
        // Quem chama decide como exibir.
        return e?.response?.data ?? e;
      } finally {
        setLoading(false);
      }
    },
    [fn],
  );

  return { mutateAsync, isPending: isLoading, isLoading, error };
}

// ===== AUTH =====

export function useSignIn(): MutState<any> {
  return useSimpleMutation(async (input: { email: string; password: string }) => {
    // ATENÇÃO: endpoint NÃO tem /api/v1 (api.ts já adiciona)
    return await api({
      endpoint: "/accounts/signin/",
      method: "POST",
      data: input,
      withAuth: false,
    });
  });
}

export function useSignUp(): MutState<any> {
  return useSimpleMutation(
    async (input: { name?: string; email: string; password: string; confirmPassword?: string }) => {
      // Seu backend aceita password_confirm (e também password_confirmation no serializer que ajustamos)
      const payload = {
        name: input.name ?? "",
        email: input.email,
        password: input.password,
        password_confirm: input.confirmPassword,
        // redundância útil (se o backend estiver validando por este)
        password_confirmation: input.confirmPassword,
      };

      return await api({
        endpoint: "/accounts/signup/",
        method: "POST",
        data: payload,
        withAuth: false,
      });
    },
  );
}

// ===== COURSES (mantidos, mas ajustados para o novo api) =====

export function useEnrollInCourse(): MutState<any> {
  return useSimpleMutation(async (input: { courseId: string }) => {
    return await api({
      endpoint: `/courses/${input.courseId}/enroll`,
      method: "POST",
      data: {},
      withAuth: true,
    });
  });
}

export function useAddCourseReview(): MutState<any> {
  return useSimpleMutation(async (input: { courseId: string; rating: number; comment?: string }) => {
    return await api({
      endpoint: `/courses/${input.courseId}/reviews`,
      method: "POST",
      data: { rating: input.rating, comment: input.comment },
      withAuth: true,
    });
  });
}

export function useMarkLessonAsWatched(): MutState<any> {
  return useSimpleMutation(async (input: { courseId: string; lessonId: string }) => {
    return await api({
      endpoint: `/courses/${input.courseId}/lessons/${input.lessonId}/watched`,
      method: "POST",
      data: {},
      withAuth: true,
    });
  });
}
