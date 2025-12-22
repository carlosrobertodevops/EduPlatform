"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { levelLabels } from "@/constants/labels";
import { Award, CheckCircle, Download, Loader2, Target, User } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRef, useState } from "react";
import { toast } from "sonner";

type Props = {
  certificate: APIGetCourseCertificateResponse;
}

export const CertificatePage = ({ certificate }: Props) => {
  const certificateRef = useRef<HTMLDivElement>(null)

  const [isDownloading, setIsDownloading] = useState(false)

  const session = useSession()

  const handleDownload = async () => {
    if (!certificateRef.current) return;

    setIsDownloading(true)

    try {
      const html2canvas = (await import("html2canvas")).default
      const jsPDF = (await import("jspdf")).jsPDF;

      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#FFFFFF",
        width: certificateRef.current.scrollWidth,
        height: certificateRef.current.scrollHeight
      })

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4"
      })

      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = (pdfHeight - imgHeight * ratio) / 2;

      pdf.addImage(imgData, "PNG", imgX, imgY, imgWidth * ratio, imgHeight * ratio);

      pdf.save('certificado.pdf')

      toast.success("Download concluído!")
    } catch (error) {
      toast.error("Erro no download")
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <Award className="size-8 text-primary" />
            <h1 className="text-2xl font-bold">Certificado de Conclusão!</h1>
          </div>
          <p className="text-muted-foreground">
            Este certificado verifica a conclusão bem-sucedida do curso
          </p>
        </div>

        <div ref={certificateRef}>
          <Card className="overflow-hidden shadow-2xl border-2 p-0 border-[#2563eb] bg-white">
            <CardContent className="p-0">
              <div className="bg-gradient-to-r from-primary to-[#155dfc] text-white p-8 text-center">
                <div className="space-y-4">
                  <Award className="size-16 mx-auto text-white" />
                  <h2 className="uppercase text-3xl font-bold text-white">Certificado de Conclusão</h2>
                  <p className="text-white">
                    EduPlatform - Plataforma de Cursos online
                  </p>
                </div>
              </div>

              <div className="p-12 bg-white text-center space-y-8">
                <div className="space-y-4">
                  <p className="text-lg text-[#4a5565]">
                    Certificamos que
                  </p>
                  <h3 className="text-4xl font-bold text-primary">
                    {session.data?.user.name}
                  </h3>
                  <p className="text-lg text-[#4a5565]">
                    concluiu com sucesso o curso
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div className="space-y-2">
                    <Target className="size-6 mx-auto text-[#6a7282]" />
                    <p className="text-sm text-[#6a7282]">
                      Progresso
                    </p>
                    <p className="font-semibold text-[#1e2939]">
                      {certificate.certificate.progress}%
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Award className="size-6 mx-auto text-[#6a7282]" />
                    <p className="text-sm text-[#6a7282]">
                      Nível
                    </p>
                    <p className="font-semibold text-[#1e2939]">
                      {levelLabels[certificate.course.level]}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <User className="size-6 mx-auto text-[#6a7282]" />
                    <p className="text-sm text-[#6a7282]">
                      Instrutor
                    </p>
                    <p className="font-semibold text-[#1e2939]">
                      {certificate.course.author.name}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-sm text-[#6a7282]">Habilidades Desenvolvidas:</p>
                  <div className="flex flex-wrap justify-center items-center gap-2">
                    {certificate.course.tags.map(tag => (
                      <span
                        key={tag.id}
                        className="px-2 text-primary font-bold text-sm"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-[#f9fafb] p-6 text-center space-y-4">
                <div className="flex items-center justify-center space-x-2 text-sm text-[#4a5565]">
                  <CheckCircle className="size-4 text-[#13ce66]" />
                  <span>Certificado confiável!</span>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-[#6a7282]">
                    ID do Certificado: CERT-{certificate.course.id}
                  </p>
                  <p className="text-sm text-[#6a7282]">
                    Emitido em: {new Date(certificate.certificate.issued_at).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center space-x-4">
          <Button
            onClick={handleDownload}
            size="lg"
            disabled={isDownloading}
          >
            {isDownloading ? (
              <>
                <Loader2 className="size-4 mr-2 animate-ping" />
                Gerando PDF...
              </>
            ) : (
              <>
                <Download className="size-4 mr-2" />
                Baixar PDF
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}