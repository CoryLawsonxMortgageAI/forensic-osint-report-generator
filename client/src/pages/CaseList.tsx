import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Loader2, Plus } from "lucide-react";
import { Link } from "wouter";

export default function CaseList() {
  const { user, loading: authLoading } = useAuth();
  const { data: cases, isLoading } = trpc.cases.list.useQuery(undefined, {
    enabled: !!user,
  });

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-silver" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-silver">
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Forensic OSINT Report Generator</h1>
            <p className="text-silver/70">Manage your investigation cases</p>
          </div>
          <Link href="/cases/new">
            <Button className="bg-silver text-black hover:bg-silver/90">
              <Plus className="mr-2 h-4 w-4" />
              New Case
            </Button>
          </Link>
        </div>

        {cases && cases.length === 0 ? (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <p className="text-silver/70 mb-4">No cases yet. Create your first investigation case to get started.</p>
                <Link href="/cases/new">
                  <Button className="bg-silver text-black hover:bg-silver/90">
                    <Plus className="mr-2 h-4 w-4" />
                    Create First Case
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cases?.map((caseItem) => (
              <Link key={caseItem.id} href={`/cases/${caseItem.id}`}>
                <Card className="bg-zinc-900 border-zinc-800 hover:border-silver/50 transition-colors cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-silver">{caseItem.title}</CardTitle>
                    <CardDescription className="text-silver/70">{caseItem.subject}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-silver/70">
                      <div>
                        <span className="font-semibold">Status:</span>{" "}
                        <span
                          className={`px-2 py-1 rounded ${
                            caseItem.status === "completed"
                              ? "bg-green-900/30 text-green-400"
                              : caseItem.status === "in_progress"
                              ? "bg-blue-900/30 text-blue-400"
                              : "bg-zinc-800 text-silver/70"
                          }`}
                        >
                          {caseItem.status}
                        </span>
                      </div>
                      {caseItem.location && (
                        <div>
                          <span className="font-semibold">Location:</span> {caseItem.location}
                        </div>
                      )}
                      <div>
                        <span className="font-semibold">Created:</span>{" "}
                        {new Date(caseItem.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

