import { CourseLearnPage } from "@/components/pages/courses/course-learn"
import { getCourse } from "@/services/courses"
import { redirect } from "next/navigation"

export default async function ({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const course = await getCourse(+id)

  if (!course.data || !course.data.enrolled_at) {
    redirect(`/courses/${id}`)
  }

  return <CourseLearnPage course={course.data} />
}