"use client";

import { Navbar } from "@/components/layout/navbar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { levelColors } from "@/constants/colors";
import { levelLabels } from "@/constants/labels";
import { queryKeys } from "@/constants/query-keys";
import { formatMinutes, formatPrice } from "@/lib/formatters";
import { useAddCourseReview, useEnrollInCourse } from "@/lib/mutations";
import { useGetCourseContent, useGetCourseReviews } from "@/lib/queries";
import { queryClient } from "@/lib/query-client";
import { CourseReviewForm, courseReviewSchema } from "@/schemas/courses";
import { useRouter } from "@bprogress/next/app";
import { zodResolver } from "@hookform/resolvers/zod";
import { Award, BookOpen, CheckCircle, Clock, Play, Star, Users } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type Props = {
  course: Course;
}

export const CoursePage = ({ course }: Props) => {
  const searchParams = useSearchParams()

  const session = useSession()
  const router = useRouter()

  const { data: courseContent, isLoading: courseContentIsLoading } = useGetCourseContent(course.id)
  const { data: courseReviews, isLoading: courseReviewsIsLoading, refetch: getCourseReviews } = useGetCourseReviews(course.id)
  const { isPending: courseReviewIsPending, mutateAsync: addCourseReview } = useAddCourseReview()
  const { isPending: courseEnrollIsPending, mutateAsync: enrollInCourse } = useEnrollInCourse()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<CourseReviewForm>({
    resolver: zodResolver(courseReviewSchema)
  })

  const handleEnroll = async () => {
    if (!session.data?.user) {
      toast.error("Faça login para se inscrever!", {
        description: "Você precisa estar logado para se inscrever no curso."
      })
      router.push("/auth/signin");
      return;
    }

    const response = await enrollInCourse(course.id)
    if (!response.success || !response.data) {
      toast.error("Erro na inscrição", {
        description: response.detail
      });
      return;
    }

    toast.info("Você será redirecionado para o pagamento.", {
      description: "Por favor, aguarde enquanto processamos sua inscrição."
    })

    window.location.href = response.data.checkout_url
  }

  const handleSubmitReview = async (data: CourseReviewForm) => {
    const response = await addCourseReview({ courseId: course.id, data })

    if (!response.success) {
      toast.error("Erro ao enviar avaliação", {
        description: response.detail
      });
      return;
    }

    getCourseReviews()
    router.refresh()
    queryClient.invalidateQueries({ queryKey: [queryKeys.GET_COURSES] })

    toast.success("Avalição enviado com sucesso!")
    reset()
  }

  useEffect(() => {
    const message = searchParams.get("message")
    if (!message) return;

    if (message === "cancel_order") {
      toast.error("Inscrição cancelada", {
        description: "Você cancelou a inscrição no curso."
      })
    }

    if (message === "payment_failed") {
      toast.error("Pagamentou falhou", {
        description: "Houve um erro no processamento do pagamento. Tente novamente mais tarde."
      })
    }
  }, [searchParams])

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="gradient-bg py-12">
        <div className="container max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge style={{ background: levelColors[course.level] }}>
                    {levelLabels[course.level]}
                  </Badge>
                  <div className="flex items-center text-sm">
                    <Star className="size-4 fill-yellow-400 text-yellow-400 mr-1" />
                    {course.average_rating} ({course.total_reviews} avaliações)
                  </div>
                </div>
                <h1 className="text-4xl font-bold">
                  {course.title}
                </h1>
                <div className="flex flex-wrap gap-2 px-1">
                  {course.tags.map(tag => (
                    <div key={tag.id} className="mr-2 mb-2 bg-primary/10 text-foreground px-2.5 py-0.5 rounded-md border border-primary text-[10px]">
                      {tag.name}
                    </div>
                  ))}
                </div>
                <p className="text-lg text-muted-foreground">
                  {course.description}
                </p>
              </div>

              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                {courseContent?.data && (
                  <>
                    <div className="flex items-center">
                      <Clock className="size-4 mr-1" />
                      {formatMinutes(courseContent.data.total_time)}
                    </div>
                    <div className="flex items-center">
                      <BookOpen className="size-4 mr-1" />
                      {courseContent.data.total_lessons}
                    </div>
                  </>
                )}

                <div className="flex items-center">
                  <Users className="size-4 mr-1" />
                  {course.total_enrollments} estudantes
                </div>
                <div className="flex items-center">
                  <Award className="size-4 mr-1" />
                  Certificado
                </div>
              </div>
            </div>

            <Card className="glass-effect">
              <CardContent className="px-6 mb-6">
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg mb-6 flex items-center justify-center">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="size-full object-cover rounded-lg"
                  />
                </div>

                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">
                      {formatPrice(course.price)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Acesso vitalício
                    </div>
                  </div>

                  {course.enrolled_at ? (
                    <div className="space-y-4">
                      <Link href={`/courses/${course.id}/learn`} className="w-full">
                        <Button className="w-full cursor-pointer" size="lg">
                          <Play className="size-4 mr-2" />
                          Continuar curso
                        </Button>
                      </Link>

                      <div className="text-xs text-muted-foreground mt-2 text-center">
                        Você já se inscreveu em {new Date(course.enrolled_at).toLocaleDateString("pt-BR")}
                      </div>
                    </div>
                  ) : (
                    <Button className="w-full cursor-pointer" size="lg" onClick={handleEnroll} disabled={courseEnrollIsPending}>
                      {courseEnrollIsPending ? "Processando..." : "Inscrever-se agora"}
                    </Button>
                  )}

                  <div className="space-y-3 text-sm pt-3 px-2">
                    <div className="flex items-center justify-between">
                      <span>Acesso vitalício</span>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Certificado de conclusão</span>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Suporte do instrutor</span>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Acesso mobile</span>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Tabs defaultValue="content" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="content">Conteúdo</TabsTrigger>
                  <TabsTrigger value="reviews">Avaliações</TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Conteúdo do Curso</CardTitle>
                      <CardDescription>
                        {courseContent?.data?.total_modules ?? 0} módulos • {courseContent?.data?.total_lessons ?? 0} aulas • {formatMinutes(courseContent?.data?.total_time ?? 0)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {courseContentIsLoading && (
                        <div className="mt-3 space-y-4">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <div key={index} className="h-8 bg-muted rounded w-full mb-2 animate-pulse" />
                          ))}
                        </div>
                      )}

                      <Accordion type="single" collapsible className="w-full">
                        {courseContent?.data?.modules.map((module, index) => (
                          <AccordionItem key={module.id} value={String(module.id)}>
                            <AccordionTrigger className="text-left">
                              <div className="flex items-center justify-between w-full mr-4">
                                <span className="font-medium flex items-center">
                                  <span className="text-xs text-primary">{index + 1} • </span>
                                  &nbsp;
                                  {module.title}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  {module.lessons.length} aulas
                                </span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-2 pl-4">
                                {module.lessons.map(lesson => (
                                  <div key={lesson.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                                    <div className="flex items-center space-x-3">
                                      <Play className="size-4 text-muted-foreground" />
                                      <span className="text-sm">{lesson.title}</span>
                                    </div>
                                    <span className="text-sm text-muted-foreground">
                                      {formatMinutes(lesson.time_estimate)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="reviews" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Avaliações dos estudantes</CardTitle>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Star className="size-5 fill-yellow-400 text-yellow-400" />
                          <span className="ml-1 text-lg font-semibold">{course.average_rating}</span>
                        </div>
                        <span className="text-muted-foreground">({course.total_reviews} avaliações)</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {course.enrolled_at && session.status === "authenticated" && (
                        <form onSubmit={handleSubmit(handleSubmitReview)} className="space-y-4">
                          <div className="flex flex-col lg:flex-row gap-4">
                            <div className="space-y-1 w-full lg:w-1/3">
                              <Input type="number" min="1" max="5" step="1" placeholder="Sua nota" disabled={courseReviewIsPending || courseReviewsIsLoading} {...register("rating")} />
                              {errors.rating && <p className="text-red-500 text-sm">{errors.rating.message}</p>}
                            </div>

                            <div className="space-y-1 flex-1 w-full">
                              <Input type="text" placeholder="Seu comentário" disabled={courseReviewIsPending || courseReviewsIsLoading} {...register("comment")} />
                              {errors.comment && <p className="text-red-500 text-sm">{errors.comment.message}</p>}
                            </div>
                          </div>
                          <Button type="submit" className="w-full" disabled={courseReviewIsPending || courseReviewsIsLoading}>
                            Enviar avaliação
                          </Button>
                        </form>
                      )}

                      {courseReviewsIsLoading && (
                        <div className="mt-3 space-y-4">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <div key={index} className="h-8 bg-muted rounded w-full mb-2 animate-pulse" />
                          ))}
                        </div>
                      )}

                      {courseReviews?.data?.map((review, index) => (
                        <div key={index} className="border-b pb-4 last:border-b-0">
                          <div className="flex items-center space-x-4">
                            <Avatar>
                              <AvatarFallback>
                                {review.user.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center justify-between">
                                <h5 className="font-medium">{review.user}</h5>
                                <span className="text-sm text-muted-foreground">{new Date(review.created_at).toLocaleDateString("pt-BR")}</span>
                              </div>
                              <div className="flex items-center">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star key={i} className={`size-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
                                ))}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {review.comment}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Instrutor</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="size-16">
                      <AvatarFallback className="text-lg">
                        {course.author.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold">{course.author.name}</h4>
                      <p className="text-sm text-muted-foreground">Instrutor da EduPlatform</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between px-12">
                    <div className="text-center">
                      <div className="text-lg font-semibold">{course.author.average_rating}</div>
                      <div className="text-xs text-muted-foreground">Avaliação</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold">{course.author.total_courses}</div>
                      <div className="text-xs text-muted-foreground">Cursos</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}