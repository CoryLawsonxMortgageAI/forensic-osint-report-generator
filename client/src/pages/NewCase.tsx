import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function NewCase() {
  const [, setLocation] = useLocation();
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [dateOfIncident, setDateOfIncident] = useState("");
  const [location, setLocationValue] = useState("");
  const [description, setDescription] = useState("");

  const createCase = trpc.cases.create.useMutation({
    onSuccess: (data) => {
      toast.success("Case created successfully");
      setLocation(`/cases/${data.id}`);
    },
    onError: (error) => {
      toast.error(`Failed to create case: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCase.mutate({
      title,
      subject,
      dateOfIncident: dateOfIncident || undefined,
      location: location || undefined,
      description: description || undefined,
    });
  };

  return (
    <div className="min-h-screen bg-black text-silver">
      <div className="container py-8 max-w-3xl">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-silver text-2xl">Create New Investigation Case</CardTitle>
            <CardDescription className="text-silver/70">
              Enter the details of the new forensic OSINT investigation case.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-silver">
                  Case Title *
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="bg-zinc-800 border-zinc-700 text-silver"
                  placeholder="e.g., The Disappearance of Brian Shaffer"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject" className="text-silver">
                  Subject *
                </Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  className="bg-zinc-800 border-zinc-700 text-silver"
                  placeholder="e.g., Brian Randall Shaffer"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfIncident" className="text-silver">
                  Date of Incident
                </Label>
                <Input
                  id="dateOfIncident"
                  type="date"
                  value={dateOfIncident}
                  onChange={(e) => setDateOfIncident(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-silver"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-silver">
                  Location
                </Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocationValue(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-silver"
                  placeholder="e.g., Ugly Tuna Saloona, Columbus, Ohio"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-silver">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  className="bg-zinc-800 border-zinc-700 text-silver"
                  placeholder="Provide a detailed description of the case..."
                />
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={createCase.isPending}
                  className="bg-silver text-black hover:bg-silver/90"
                >
                  {createCase.isPending ? "Creating..." : "Create Case"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation("/")}
                  className="border-zinc-700 text-silver hover:bg-zinc-800"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

