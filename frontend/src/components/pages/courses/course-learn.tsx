"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { useMarkLessonAsWatched } from "@/lib/mutations";
import { useGetCourseContent } from "@/lib/queries";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { OnProgressProps } from "react-player/base"
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { formatMinutes } from "@/lib/formatters";
import { ArrowLeft, Award, CheckCircle, ChevronRight, Clock, Play, Users } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ReactPlayer from "react-player";

type Props = {
  course: Course;
}

export const CourseLearnPage = ({ course }: Props) => {
  const [lesson, setLesson] = useState<CourseLesson | null>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const isMobile = useIsMobile()

  const { data: courseContent, refetch: refetchCourseContent } = useGetCourseContent(course.id)
  const { mutateAsync: markLessonAsWatched, isPending: markLessonAsWatchedIsPending } = useMarkLessonAsWatched()

  const markLessonAsCompleted = async (notify: boolean = true) => {
    if (!lesson) return;
    const response = await markLessonAsWatched(lesson.id)

    if (!response.success) {
      if (notify) {
        toast.error("Erro ao marcar aula como concluída", {
          description: response.detail
        })
      }
      return;
    }

    await refetchCourseContent();

    if (notify) {
      toast.success("Aula marcada como concluída!", {
        description: "Seu progresso foi atualizado!"
      })
    }
  }

  const handleOnProgress = (progress: OnProgressProps) => {
    if (!lesson || markLessonAsWatchedIsPending || lesson.is_watched) return;
    if (progress.played >= 0.8) markLessonAsCompleted(false)
  }

  useEffect(() => {
    if (courseContent?.data && courseContent.data.modules.length > 0) {
      const firstModule = courseContent.data.modules[0]
      const firstLesson = firstModule.lessons[0]
      setLesson(firstLesson)
    }
  }, [courseContent])

  useEffect(() => {
    if (!courseContent?.data || !lesson) return;
    setLesson(courseContent.data.modules.flatMap((module) => module.lessons).find(l => l.id === lesson.id) || null)
  }, [courseContent])

  const CourseModules = ({ className }: { className?: string }) => (
    <div className={cn("w-full transition-all duration-300   bg-background overflow-hidden", className)}>
      <div className="p-4 border-b">
        <div>
          <h2 className="font-semibold text-lg truncate">{course.title}</h2>
          <p className="text-sm text-muted-foreground">Progresso: {Math.round(courseContent?.data?.progress || 0)}%</p>
        </div>
        <Progress value={courseContent?.data?.progress || 0} className="mt-2" />
      </div>

      <div className="overflow-y-auto h-[calc(100vh-120px)]">
        {courseContent?.data?.modules.map((module) => (
          <Accordion key={module.id} type="single" collapsible defaultValue={`${module.title}-${module.id}`}>
            <AccordionItem value={`${module.title}-${module.id}`} className="border-0">
              <AccordionTrigger className="px-4 py-3 hover:bg-accent">
                <div className="flex items-center justify-between w-full mr-2">
                  <div className="text-left">
                    <div className="font-medium">{module.title}</div>
                    <div className="text-sm text-muted-foreground">{formatMinutes(module.lessons.reduce((a, b) => a + b.time_estimate, 0))}</div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {module.lessons.filter((l) => l.is_watched).length}/{module.lessons.length}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-0">
                {module.lessons.map((moduleLesson, lessonIndex) => (
                  <div
                    key={moduleLesson.id}
                    className={`flex items-center p-3 cursor-pointer hover:bg-accent border-l-2 ${moduleLesson.id === lesson?.id ? "bg-primary/10 border-l-primary text-primary" : "border-l-transparent"}`}
                    onClick={() => setLesson(moduleLesson)}
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      {moduleLesson.is_watched ? <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" /> : <Play className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{moduleLesson.title}</div>
                        <div className="text-xs text-muted-foreground">{formatMinutes(moduleLesson.time_estimate)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {courseContent?.data && (
        <>
          {isMobile ? (
            <Sheet onOpenChange={(open) => !open && setSidebarCollapsed(true)} open={!sidebarCollapsed}>
              <SheetContent>
                <SheetTitle></SheetTitle>
                <CourseModules />
              </SheetContent>
            </Sheet>
          ) : (
            <CourseModules className="w-80" />
          )}
        </>
      )}

      <div className="flex-1 flex flex-col">
        <div className="border-b p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {sidebarCollapsed && isMobile && (
              <Button variant="ghost" size="sm" onClick={() => setSidebarCollapsed(false)}>
                <ChevronRight className="size-4" />
              </Button>
            )}
            <Link href={`/courses/${course.id}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="size-4 mr-2 cursor-pointer" />
                Voltar ao curso
              </Button>
            </Link>
          </div>
          <div className="flex items-center space-x-2">
            {lesson && (
              <Button
                variant={lesson.is_watched ? "default" : "outline"}
                size="sm"
                onClick={() => markLessonAsCompleted()}
                disabled={lesson.is_watched || markLessonAsWatchedIsPending}
              >
                {lesson.is_watched ? (
                  <>
                    <CheckCircle className="size-4 mr-2" />
                    Concluída
                  </>
                ) : (
                  "Marcar como concluída"
                )}
              </Button>
            )}

            {courseContent?.data?.progress && courseContent.data.progress > 99 ? (
              <Link href={`/courses/${course.id}/certificate`} target="_blank">
                <Button variant="outline" size="sm">
                  <Award className="size-4" />
                </Button>
              </Link>
            ) : ""}
          </div>
        </div>

        {lesson && (
          <div className="aspect-video">
            <ReactPlayer key={lesson.id} url={lesson.video_url} onProgress={handleOnProgress} controls width="100%" height={"100%"} />
          </div>
        )}

        <div className="flex-1 p-6">
          <div className="max-w-4xl">
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2">{lesson?.title}</h1>
              <p className="text-muted-foreground mb-4">{lesson?.description}</p>

              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span className="flex items-center">
                  <Clock className="size-4 mr-1" />
                  {formatMinutes(lesson?.time_estimate || 0)}
                </span>
                <span className="flex items-center">
                  <Users className="size-4 mr-1" />
                  {course.total_enrollments} estudantes
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}