"use client";

import { signUp } from "@/services/auth";
import { addCourseReview, enrollInCourse, markLessonAsWatched } from "@/services/courses";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";

export const useSignUp = () => {
    return useMutation({
        mutationFn: signUp,
        onSuccess: async (data, variables) => {
            if (!data.success) return;

            const result = await signIn("credentials", {
                email: variables.email,
                password: variables.password,
                redirect: false
            })

            if (result.error) {
                throw new Error("Erro ao fazer login após cadastro");
            }
        }
    })
}

export const useAddCourseReview = () => {
    return useMutation({
        mutationFn: addCourseReview,
    })
}

export const useEnrollInCourse = () => {
    return useMutation({
        mutationFn: enrollInCourse,
    })
}

export const useMarkLessonAsWatched = () => {
    return useMutation({
        mutationFn: markLessonAsWatched
    })
}