import { levelLabels } from "@/constants/labels"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { levelColors } from "@/constants/colors"
import { Star } from "lucide-react"
import { formatPrice } from "@/lib/formatters"
import Link from "next/link"
import { Button } from "@/components/ui/button"

type Props = {
    course: Course
}

export const CourseItem = ({ course }: Props) => (
    <Card className="w-96 p-0">
        <div className="relative">
            <img src={course.thumbnail} alt={course.title} className="w-full h-56 object-cover rounded-t-lg" loading="lazy" />
            <div className="absolute top-2 right-2 z-10">
                <Badge style={{ background: levelColors[course.level] }}>{levelLabels[course.level]}</Badge>
            </div>
        </div>

        <CardContent className="px-6 mb-6">
            <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center">
                    <Star className="size-4 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 text-sm font-medium">{course.average_rating}</span>
                </div>
                <span className="text-sm text-muted-foreground">({course.total_enrollments} estudantes)</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
            <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{course.description}</p>
            <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-primary">{formatPrice(course.price)}</span>
                <Link href={`/courses/${course.id}`} className="text-sm text-primary hover:underline">
                    <Button className="cursor-pointer" size="sm">Ver Curso</Button>
                </Link>
            </div>
        </CardContent>
    </Card>
)