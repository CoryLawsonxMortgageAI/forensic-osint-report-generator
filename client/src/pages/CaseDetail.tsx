import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { Loader2, FileText } from "lucide-react";
import { useRoute, useLocation } from "wouter";
import { toast } from "sonner";

export default function CaseDetail() {
  const [, params] = useRoute("/cases/:id");
  const [, setLocation] = useLocation();
  const caseId = params?.id ? parseInt(params.id) : 0;

  const { data: caseData, isLoading } = trpc.cases.getById.useQuery({ id: caseId }, { enabled: caseId > 0 });
  const { data: entities } = trpc.entities.list.useQuery({ caseId }, { enabled: caseId > 0 });
  const { data: theories } = trpc.theories.list.useQuery({ caseId }, { enabled: caseId > 0 });
  const { data: reports } = trpc.reports.list.useQuery({ caseId }, { enabled: caseId > 0 });

  const generateReport = trpc.reports.generate.useMutation({
    onSuccess: () => {
      toast.success("Report generated successfully");
    },
    onError: (error) => {
      toast.error(`Failed to generate report: ${error.message}`);
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-silver" />
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-silver">
        <div className="text-center">
          <p className="text-xl mb-4">Case not found</p>
          <Button onClick={() => setLocation("/")} className="bg-silver text-black hover:bg-silver/90">
            Back to Cases
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-silver">
      <div className="container py-8">
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">{caseData.title}</h1>
              <p className="text-silver/70 text-lg">{caseData.subject}</p>
            </div>
            <Button
              onClick={() => generateReport.mutate({ caseId })}
              disabled={generateReport.isPending}
              className="bg-silver text-black hover:bg-silver/90"
            >
              <FileText className="mr-2 h-4 w-4" />
              {generateReport.isPending ? "Generating..." : "Generate Report"}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-silver/70">Status</CardTitle>
              </CardHeader>
              <CardContent>
                <span
                  className={`px-3 py-1 rounded text-sm ${
                    caseData.status === "completed"
                      ? "bg-green-900/30 text-green-400"
                      : caseData.status === "in_progress"
                      ? "bg-blue-900/30 text-blue-400"
                      : "bg-zinc-800 text-silver/70"
                  }`}
                >
                  {caseData.status}
                </span>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-silver/70">Date of Incident</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-silver">
                  {caseData.dateOfIncident
                    ? new Date(caseData.dateOfIncident).toLocaleDateString()
                    : "Not specified"}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-silver/70">Location</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-silver">{caseData.location || "Not specified"}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-zinc-900 border border-zinc-800">
            <TabsTrigger value="overview" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-silver">
              Overview
            </TabsTrigger>
            <TabsTrigger value="entities" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-silver">
              Entities ({entities?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="theories" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-silver">
              Theories ({theories?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-silver">
              Reports ({reports?.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-silver">Case Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-silver/80 whitespace-pre-wrap">{caseData.description || "No description provided."}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="entities">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-silver">Entities</CardTitle>
                <CardDescription className="text-silver/70">
                  People, locations, companies, and other entities related to this case.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {entities && entities.length > 0 ? (
                  <div className="space-y-4">
                    {entities.map((entity) => (
                      <div key={entity.id} className="border border-zinc-800 rounded p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-silver font-semibold text-lg">{entity.name}</h3>
                            <p className="text-silver/70 text-sm mt-1">Type: {entity.entityType}</p>
                            {entity.description && <p className="text-silver/80 mt-2">{entity.description}</p>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-silver/70">No entities added yet.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="theories">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-silver">Theories</CardTitle>
                <CardDescription className="text-silver/70">
                  Investigative theories and scenarios with probability assessments.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {theories && theories.length > 0 ? (
                  <div className="space-y-4">
                    {theories.map((theory) => (
                      <div key={theory.id} className="border border-zinc-800 rounded p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-silver font-semibold text-lg">{theory.title}</h3>
                          <div className="flex items-center gap-2">
                            <span className="text-silver/70 text-sm">Probability:</span>
                            <span className="text-silver font-bold">{theory.probability}%</span>
                          </div>
                        </div>
                        <p className="text-silver/80 mb-2">{theory.description}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span
                            className={`px-2 py-1 rounded ${
                              theory.status === "verified"
                                ? "bg-green-900/30 text-green-400"
                                : theory.status === "eliminated"
                                ? "bg-red-900/30 text-red-400"
                                : "bg-zinc-800 text-silver/70"
                            }`}
                          >
                            {theory.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-silver/70">No theories added yet.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-silver">Generated Reports</CardTitle>
                <CardDescription className="text-silver/70">
                  View and download generated forensic OSINT reports.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {reports && reports.length > 0 ? (
                  <div className="space-y-4">
                    {reports.map((report) => (
                      <div key={report.id} className="border border-zinc-800 rounded p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-silver/70 text-sm">
                              Generated: {new Date(report.createdAt).toLocaleString()}
                            </p>
                            <p className="text-silver/70 text-sm">Type: {report.reportType}</p>
                          </div>
                          <Button
                            onClick={() => setLocation(`/reports/${report.id}`)}
                            variant="outline"
                            className="border-zinc-700 text-silver hover:bg-zinc-800"
                          >
                            View Report
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-silver/70">No reports generated yet. Click "Generate Report" to create one.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

