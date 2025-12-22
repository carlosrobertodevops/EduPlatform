import { CertificatePage } from "@/components/pages/courses/certificate";
import { Button } from "@/components/ui/button";
import { getCourseCertificate } from "@/services/courses";
import Link from "next/link";

export default async function ({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const certificate = await getCourseCertificate(+id)

  if (!certificate.success) {
    return (
      <div className="min-h-screen gap-3 flex flex-col items-center justify-center">
        <p className="text-center text-red-500">
          {certificate.detail}
        </p>
        <Link href={`/courses/${id}`}>
          <Button>Ver Curso</Button>
        </Link>
      </div>
    )
  }

  return <CertificatePage certificate={certificate.data!} />
}