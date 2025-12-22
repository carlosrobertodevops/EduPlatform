"use client";

import { queryKeys } from "@/constants/query-keys";
import { getCourseContent, getCourseReviews, getCourses } from "@/services/courses";
import { useQuery } from "@tanstack/react-query";

export const useGetCourses = (data?: object) => {
    return useQuery({
        queryKey: [queryKeys.GET_COURSES, data],
        queryFn: () => getCourses(data)
    })
}


export const useGetCourseContent = (courseId: number) => {
    return useQuery({
        queryKey: [queryKeys.GET_COURSE_CONTENT, courseId],
        queryFn: () => getCourseContent(courseId),
        enabled: !!courseId
    })
}

export const useGetCourseReviews= (courseId: number) => {
    return useQuery({
        queryKey: [queryKeys.GET_COURSE_REVIEWS, courseId],
        queryFn: () => getCourseReviews(courseId),
        enabled: !!courseId
    })
}
