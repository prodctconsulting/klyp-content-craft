import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { LogOut, Users, Settings, FileText } from 'lucide-react';

interface FounderSubmission {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  business: string;
  integrations?: string;
  created_at: string;
  contacted: boolean;
}

interface SiteContentRow {
  id: string;
  section: string;
  content: any;
  updated_at: string;
}

export default function Admin() {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<FounderSubmission[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(true);
  const [contentRows, setContentRows] = useState<SiteContentRow[]>([]);
  const [loadingContent, setLoadingContent] = useState(true);
  const [editingContent, setEditingContent] = useState<Record<string, string>>({});
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchSubmissions();
    }
  }, [isAuthenticated]);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setContentRows(data || []);
      const map: Record<string, string> = {};
      (data || []).forEach((row: any) => {
        map[row.id] = JSON.stringify(row.content ?? {}, null, 2);
      });
      setEditingContent(map);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch content",
        variant: "destructive",
      });
    } finally {
      setLoadingContent(false);
    }
  };

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('founders_list')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch submissions",
        variant: "destructive",
      });
    } finally {
      setLoadingSubmissions(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    navigate('/admin/login');
  };

  const markAsContacted = async (id: string) => {
    try {
      const { error } = await supabase
        .from('founders_list')
        .update({ contacted: true })
        .eq('id', id);

      if (error) throw error;

      setSubmissions(prev => 
        prev.map(sub => 
          sub.id === id ? { ...sub, contacted: true } : sub
        )
      );

      toast({
        title: "Success",
        description: "Marked as contacted",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update submission",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <img 
                src="/brand/logo.png" 
                alt="KLYP Logo" 
                className="h-8 w-auto"
              />
              <h1 className="text-xl font-semibold text-gray-900">Admin Panel</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome, {user?.email}</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="submissions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="submissions" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Submissions
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Content
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="submissions">
            <Card>
              <CardHeader>
                <CardTitle>Founder List Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingSubmissions ? (
                  <div className="text-center py-8">Loading submissions...</div>
                ) : submissions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No submissions yet</div>
                ) : (
                  <div className="space-y-4">
                    {submissions.map((submission) => (
                      <div 
                        key={submission.id} 
                        className={`p-4 border rounded-lg ${
                          submission.contacted ? 'bg-green-50 border-green-200' : 'bg-white'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <div className="font-medium text-lg">{submission.full_name}</div>
                            <div className="text-sm text-gray-600">{submission.email}</div>
                            {submission.phone && (
                              <div className="text-sm text-gray-600">{submission.phone}</div>
                            )}
                            <div className="text-sm">
                              <strong>Business:</strong> {submission.business}
                            </div>
                            {submission.integrations && (
                              <div className="text-sm">
                                <strong>Integrations:</strong> {submission.integrations}
                              </div>
                            )}
                            <div className="text-xs text-gray-500">
                              Submitted: {new Date(submission.created_at).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {!submission.contacted && (
                              <Button 
                                size="sm" 
                                onClick={() => markAsContacted(submission.id)}
                              >
                                Mark as Contacted
                              </Button>
                            )}
                            {submission.contacted && (
                              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                                Contacted
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content">
            <Card>
              <CardHeader>
                <CardTitle>Content Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  Content management features coming soon...
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  Settings panel coming soon...
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}