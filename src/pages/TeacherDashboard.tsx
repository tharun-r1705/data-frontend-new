import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { chatAPI, exportAPI } from '@/lib/api';
import { Download, Sparkles, Loader2 } from 'lucide-react';

const TeacherDashboard = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [prompt, setPrompt] = useState('');
  const [isQuerying, setIsQuerying] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [rows, setRows] = useState<any[]>([]);
  const [downloadFilename, setDownloadFilename] = useState<string | null>(null);

  useEffect(() => {
    // Load recent session for convenience
    (async () => {
      try {
        const res = await chatAPI.recent();
        setSessionId(res.data.sessionId);
      } catch {}
    })();
  }, []);

  const handleQuery = async () => {
    try {
      setIsQuerying(true);
      const res = await chatAPI.query({ sessionId, prompt });
      setSessionId(res.data.sessionId);
      setRows(res.data.results || []);
      const url: string | null = res.data.downloadUrl || null;
      const filename = url ? (url.match(/download\/(.*)$/)?.[1] || null) : null;
      setDownloadFilename(filename);
      if (!res.data.results?.length) {
        toast({ title: 'No results', description: 'Try refining your query.' });
      }
    } catch (error: any) {
      toast({ title: 'Query failed', description: error?.response?.data?.message || 'Unable to run query', variant: 'destructive' });
    } finally {
      setIsQuerying(false);
    }
  };

  const handleExportAll = async () => {
    try {
      const res = await exportAPI.exportCsv({});
      const url: string = res.data.downloadUrl;
      const filename = url.match(/download\/(.*)$/)?.[1] || 'students-export.csv';
      const blobRes = await exportAPI.download(filename);
      const blob = new Blob([blobRes.data], { type: 'text/csv' });
      const link = document.createElement('a');
      const suggested = blobRes.headers['content-disposition']?.match(/filename="?([^";]+)"?/i)?.[1] || filename;
      link.href = URL.createObjectURL(blob);
      link.download = suggested;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error: any) {
      toast({ title: 'Export failed', description: error?.response?.data?.message || 'Unable to export', variant: 'destructive' });
    }
  };

  const handleDownloadResults = async () => {
    if (!downloadFilename) return;
    try {
      const blobRes = await exportAPI.download(downloadFilename);
      const blob = new Blob([blobRes.data], { type: 'text/csv' });
      const link = document.createElement('a');
      const suggested = blobRes.headers['content-disposition']?.match(/filename="?([^";]+)"?/i)?.[1] || 'results.csv';
      link.href = URL.createObjectURL(blob);
      link.download = suggested;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error: any) {
      toast({ title: 'Download failed', description: error?.response?.data?.message || 'Unable to download results', variant: 'destructive' });
    }
  };

  const columns = useMemo(() => {
    const colSet = new Set<string>();
    rows.forEach((r) => Object.keys(r).forEach((k) => colSet.add(k)));
    return Array.from(colSet).filter((c) => c !== 'id');
  }, [rows]);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card className="backdrop-blur-xl bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-foreground flex items-center justify-between">
              <span>Teacher Dashboard</span>
              <div className="flex gap-2">
                <Button onClick={handleExportAll} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" /> Export All CSV
                </Button>
                <Button onClick={logout} variant="outline" size="sm">Logout</Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="prompt">AI Query</Label>
              <div className="flex gap-2">
                <Input id="prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="e.g., show students with tenthMark >= 450 and name, email" className="bg-white/5 border-white/20" />
                <Button onClick={handleQuery} disabled={isQuerying} className="bg-gradient-primary hover:bg-gradient-primary/90">
                  {isQuerying ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" />Querying</>) : (<><Sparkles className="w-4 h-4 mr-2" />Ask AI</>)}
                </Button>
              </div>
            </div>

            <div className="overflow-auto rounded-md border border-white/10">
              <table className="w-full text-sm">
                <thead className="bg-white/5">
                  <tr>
                    {columns.map((c) => (
                      <th key={c} className="text-left p-3 font-medium text-foreground">{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 ? (
                    <tr>
                      <td className="p-4 text-muted-foreground" colSpan={columns.length || 1}>No data</td>
                    </tr>
                  ) : (
                    rows.map((r, i) => (
                      <tr key={i} className="border-t border-white/5">
                        {columns.map((c) => (
                          <td key={c} className="p-3 text-foreground">{String(r[c] ?? '')}</td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between pt-2">
              <div className="text-sm text-muted-foreground">{rows.length > 0 ? `${rows.length} result${rows.length === 1 ? '' : 's'}` : 'No results yet'}</div>
              <Button onClick={handleDownloadResults} disabled={!downloadFilename || rows.length === 0} className="bg-gradient-primary hover:bg-gradient-primary/90">
                <Download className="w-4 h-4 mr-2" /> Download results CSV
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeacherDashboard;
