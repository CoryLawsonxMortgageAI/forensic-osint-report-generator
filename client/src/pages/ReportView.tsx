import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Loader2, Download, ArrowLeft } from "lucide-react";
import { useRoute, useLocation } from "wouter";
import ReactMarkdown from "react-markdown";

export default function ReportView() {
  const [, params] = useRoute("/reports/:id");
  const [, setLocation] = useLocation();
  const reportId = params?.id ? parseInt(params.id) : 0;

  const { data: report, isLoading } = trpc.reports.getById.useQuery({ id: reportId }, { enabled: reportId > 0 });

  const handleDownload = () => {
    if (!report) return;
    const blob = new Blob([report.content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `report-${reportId}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-silver" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-silver">
        <div className="text-center">
          <p className="text-xl mb-4">Report not found</p>
          <Button onClick={() => setLocation("/")} className="bg-silver text-black hover:bg-silver/90">
            Back to Cases
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-silver">
      <div className="container py-8 max-w-5xl">
        <div className="flex justify-between items-center mb-6">
          <Button
            onClick={() => window.history.back()}
            variant="outline"
            className="border-zinc-700 text-silver hover:bg-zinc-800"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button onClick={handleDownload} className="bg-silver text-black hover:bg-silver/90">
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>
        </div>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-silver">Forensic OSINT Investigation Report</CardTitle>
            <p className="text-silver/70 text-sm">
              Generated: {new Date(report.createdAt).toLocaleString()}
            </p>
          </CardHeader>
          <CardContent>
            <div className="prose prose-invert prose-silver max-w-none">
              <ReactMarkdown
                components={{
                  h1: ({ children }: { children?: React.ReactNode }) => <h1 className="text-3xl font-bold text-silver mb-4">{children}</h1>,
                  h2: ({ children }: { children?: React.ReactNode }) => <h2 className="text-2xl font-bold text-silver mt-8 mb-4">{children}</h2>,
                  h3: ({ children }: { children?: React.ReactNode }) => <h3 className="text-xl font-bold text-silver mt-6 mb-3">{children}</h3>,
                  p: ({ children }: { children?: React.ReactNode }) => <p className="text-silver/90 mb-4 leading-relaxed">{children}</p>,
                  table: ({ children }: { children?: React.ReactNode }) => (
                    <div className="overflow-x-auto my-6">
                      <table className="w-full border-collapse border border-zinc-700">{children}</table>
                    </div>
                  ),
                  thead: ({ children }: { children?: React.ReactNode }) => <thead className="bg-zinc-800">{children}</thead>,
                  th: ({ children }: { children?: React.ReactNode }) => (
                    <th className="border border-zinc-700 px-4 py-2 text-left text-silver font-semibold">{children}</th>
                  ),
                  td: ({ children }: { children?: React.ReactNode }) => (
                    <td className="border border-zinc-700 px-4 py-2 text-silver/90">{children}</td>
                  ),
                  ul: ({ children }: { children?: React.ReactNode }) => <ul className="list-disc list-inside text-silver/90 mb-4 space-y-2">{children}</ul>,
                  ol: ({ children }: { children?: React.ReactNode }) => <ol className="list-decimal list-inside text-silver/90 mb-4 space-y-2">{children}</ol>,
                  strong: ({ children }: { children?: React.ReactNode }) => <strong className="text-silver font-bold">{children}</strong>,
                  em: ({ children }: { children?: React.ReactNode }) => <em className="text-silver/90 italic">{children}</em>,
                  blockquote: ({ children }: { children?: React.ReactNode }) => (
                    <blockquote className="border-l-4 border-silver/50 pl-4 italic text-silver/80 my-4">{children}</blockquote>
                  ),
                }}
              >
                {report.content}
              </ReactMarkdown>
            </div>
          </CardContent>
        </Card>

        {report.graphData && (
          <Card className="bg-zinc-900 border-zinc-800 mt-6">
            <CardHeader>
              <CardTitle className="text-silver">Maltego Graph Data</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-zinc-800 p-4 rounded text-silver/90 text-sm overflow-x-auto">
                {report.graphData}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

