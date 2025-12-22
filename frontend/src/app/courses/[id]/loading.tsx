import { Navbar } from "@/components/layout/navbar";

export default function () {
    return (
        <div className="min-h-screen">
            <Navbar />

            <div className="container py-8">
                <div className="animate-pulse space-y-8">
                    <div className="h-8 bg-muted rounded w-3/4" />
                    <div className="h-64 bg-muted rounded" />
                    <div className="grid gap-8 lg:grid-cols-3">
                        <div className="lg:col-span-2 space-y-4"> 
                            <div className="h-4 bg-muted rounded w-full" />
                            <div className="h-4 bg-muted rounded w-2/3" />
                        </div>
                        <div className="h-96 bg-muted rounded" />
                    </div>
                </div>
            </div>
        </div>
    )
}