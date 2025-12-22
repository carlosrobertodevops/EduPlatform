"use client";

import { CourseItem } from "@/components/course-item";
import { Navbar } from "@/components/layout/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { levelLabels } from "@/constants/labels";
import { useGetCourses } from "@/lib/queries";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { useState } from "react";

type CourseLevelWithAll = CourseLevel | "all"

export const ExploreCoursesPage = () => {
    const [inputValue, setInputValue] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [searchTags, setSearchTags] = useState<string[]>([]);
    const [searchLevel, setSearchLevel] = useState<CourseLevelWithAll>("all");
    const [page, setPage] = useState(1)

    const { data, isLoading } = useGetCourses({
        level: searchLevel === "all" ? undefined : searchLevel,
        title: searchInput,
        tags: searchTags.join(","),
        page
    })

    const defaultTags = ["React", "JavaScript", "Python", "Node.js", "CSS", "HTML", "TypeScript", "Java", "C#", "Ruby", "PHP", "Swift", "Kotlin", "Go", "Rust"];

    const handleOnSearch = () => {
        setSearchInput(inputValue)
    }

    const handleOnTagClick = (tag: string) => {
        setSearchTags(prev => {
            if (prev.includes(tag)) {
                return prev.filter(t => t !== tag)
            } else {
                return [...prev, tag]
            }
        })
        setPage(1)
    }

    const handleOnLevelChange = (level: CourseLevelWithAll) => {
        setSearchLevel(level)
        setPage(1)
    }

    const handleOnInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        setPage(1)
    }

    return (
        <div className="min-h-screen">
            <Navbar />

            <div className="space-y-12 mt-6">
                <div className="container max-w-7xl space-y-4 lg:px-12">
                    <div className="flex flex-col lg:flex-row items-center gap-5">
                        <Select value={searchLevel} onValueChange={handleOnLevelChange} disabled={isLoading}>
                            <SelectTrigger className="w-full lg:w-96">
                                <SelectValue placeholder="Filtrar por nível" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos os níveis</SelectItem>
                                {Object.entries(levelLabels).map(([level, label]) => (
                                    <SelectItem key={level} value={level}>
                                        {label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <div className="flex items-center gap-2 w-full">
                            <Input
                                type="text"
                                placeholder="Pesquisar cursos"
                                value={inputValue}
                                onChange={handleOnInputChange}
                                className="flex-1"
                                disabled={isLoading}
                            />
                            <Button variant="outline" className="h-10" onClick={handleOnSearch} disabled={isLoading}>
                                <Search className="size-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                        {defaultTags.map((tag, i) => (
                            <Badge
                                key={i}
                                className={cn("select-none cursor-pointer bg-secondary text-secondary-foreground", searchTags.includes(tag) && "bg-primary text-primary-foreground")}
                                onClick={() => handleOnTagClick(tag)}
                            >
                                {tag}
                            </Badge>
                        ))}
                    </div>
                </div>

                <div className="container flex flex-wrap justify-center gap-5">
                    {isLoading && Array.from({ length: 9 }).map((_, i) => <div key={i} className="w-96 h-64 bg-muted animate-pulse rounded-lg flex items-center justify-center" />)}

                    {data?.data?.results.map(course => (
                        <CourseItem key={course.id} course={course} />
                    ))}
                </div>
            </div>

            {(data?.data?.count || 0) > 0 && (
                <Pagination className="mt-8 container">
                    <PaginationContent>
                        {Array.from({ length: Math.ceil((data?.data?.count || 0) / 12) }).map((_, i) => (
                            <PaginationItem key={i}>
                                <PaginationLink
                                    isActive={i + 1 === page}
                                    onClick={() => setPage(i + 1)}
                                    className="cursor-pointer"
                                >
                                    {i + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    )
}