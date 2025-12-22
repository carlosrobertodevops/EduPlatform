import { CoursePage } from "@/components/pages/courses/course";
import { getCourse } from "@/services/courses";
import { notFound } from "next/navigation";

export default async function ({ params }: { params: { id: string } }) {
    const { id } = await params;

    const course = await getCourse(+id)

    if (!course.data) {
        notFound()
    }

    return <CoursePage course={course.data} />
}