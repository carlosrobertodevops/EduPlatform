import { api } from "@/lib/api"
import { CourseReviewForm } from "@/schemas/courses"

export const getCourses = async (data?: object) => {
    return api<APIGetCoursesResponse>({
        endpoint: "/courses/",
        data
    })
}

export const getCourse = async (courseId: number) => {
    return api<APIGetCourseResponse>({
        endpoint: `/courses/${courseId}/` 
    })
}

export const getCourseContent = async (courseId: number) => {
    return api<APIGetCourseContentResponse>({
        endpoint: `/courses/${courseId}/content/` 
    })
}

export const getCourseReviews = async (courseId: number) => {
    return api<APIGetCourseReviewsResponse>({
        endpoint: `/courses/${courseId}/reviews/` 
    })
}

export const addCourseReview = async ({courseId, data}: {courseId: number, data: CourseReviewForm}) => {
    return api({
        endpoint: `/courses/${courseId}/submit_review/`,
        method: "POST",
        data,
    })
}

export const enrollInCourse = async (courseId: number) => {
    return api<APIPostCourseEnrollResponse>({
        endpoint: `/courses/${courseId}/enroll/`,
        method: "POST"
    })
}

export const markLessonAsWatched = async (lessonId: number) => {
    return api({
        endpoint: `/courses/lessons/${lessonId}/watched/`,
        method: "POST"
    })
}

export const getCourseCertificate = async (courseId: number) => {
    return api<APIGetCourseCertificateResponse>({
        endpoint: `/courses/${courseId}/certificate/`
    })
}