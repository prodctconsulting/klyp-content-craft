import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useSiteContent } from '@/providers/SiteContentProvider';
import { LogOut, Users, Settings, FileText, Upload, Palette } from 'lucide-react';

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
  const { refresh } = useSiteContent();
  const [submissions, setSubmissions] = useState<FounderSubmission[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(true);
  const [contentRows, setContentRows] = useState<SiteContentRow[]>([]);
  const [loadingContent, setLoadingContent] = useState(true);
  const [editingContent, setEditingContent] = useState<Record<string, string>>({});
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [primaryColor, setPrimaryColor] = useState('');
  const [secondaryColor, setSecondaryColor] = useState('');

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchSubmissions();
      fetchContent();
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

  const saveContent = async (id: string, section: string, content: string) => {
    try {
      let parsedContent;
      try {
        parsedContent = JSON.parse(content);
      } catch (e) {
        throw new Error('Invalid JSON format');
      }

      const { error } = await supabase
        .from('site_content')
        .update({ content: parsedContent })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Content updated successfully",
      });

      await fetchContent();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save content",
        variant: "destructive",
      });
    }
  };

  const createSection = async () => {
    const section = prompt('Enter section name (e.g., hero, demo, footer):');
    if (!section) return;

    try {
      const { error } = await supabase
        .from('site_content')
        .insert({
          section,
          content: {}
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Section created successfully",
      });

      await fetchContent();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create section",
        variant: "destructive",
      });
    }
  };

  const saveContentChanges = async (id: string, section: string) => {
    try {
      const contentText = editingContent[id];
      const contentObj = JSON.parse(contentText);
      
      const { error } = await supabase
        .from('site_content')
        .update({ content: contentObj })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Updated ${section} content`,
      });
      
      // Refresh both admin content and main site content
      await fetchContent();
      await refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save content. Check JSON format.",
        variant: "destructive",
      });
    }
  };

  const handleVideoUpload = async () => {
    if (!videoFile) {
      toast({
        title: "Error",
        description: "Please select a video file",
        variant: "destructive",
      });
      return;
    }

    setUploadingVideo(true);
    try {
      const fileExt = videoFile.name.split('.').pop();
      const fileName = `demo-video-${Date.now()}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from('videos')
        .upload(filePath, videoFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(filePath);

      // Update demo section with video URL
      const demoSection = contentRows.find(row => row.section === 'demo');
      if (demoSection) {
        const updatedContent = {
          ...demoSection.content,
          videoUrl: publicUrl,
          videoType: 'upload'
        };

        const { error } = await supabase
          .from('site_content')
          .update({ content: updatedContent })
          .eq('id', demoSection.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Video uploaded successfully",
        });

        await fetchContent();
        await refresh();
        setVideoFile(null);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload video",
        variant: "destructive",
      });
    } finally {
      setUploadingVideo(false);
    }
  };

  const saveColorPalette = async () => {
    try {
      // Update CSS variables in site_content
      const brandingSection = contentRows.find(row => row.section === 'branding');
      
      const updatedContent = {
        ...brandingSection?.content,
        primaryColor,
        secondaryColor
      };

      const { error } = await supabase
        .from('site_content')
        .upsert({
          section: 'branding',
          content: updatedContent
        }, { onConflict: 'section' });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Color palette updated. Refresh the main site to see changes.",
      });

      await fetchContent();
      await refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save color palette",
        variant: "destructive",
      });
    }
  };

  const createNewSection = async () => {
    try {
      const sectionName = prompt("Enter section name:");
      if (!sectionName) return;

      const { error } = await supabase
        .from('site_content')
        .insert({
          section: sectionName,
          content: {}
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Created ${sectionName} section`,
      });
      
      fetchContent();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create section",
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
          <TabsList className="grid w-full grid-cols-4 max-w-2xl">
            <TabsTrigger value="submissions" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Submissions
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Content
            </TabsTrigger>
            <TabsTrigger value="media" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Media
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Branding
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
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Content Management</CardTitle>
                <Button onClick={createNewSection} variant="outline">
                  Add New Section
                </Button>
              </CardHeader>
              <CardContent>
                {loadingContent ? (
                  <div className="text-center py-8">Loading content...</div>
                ) : contentRows.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No content sections yet. 
                    <Button onClick={createNewSection} variant="link">Create your first section</Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {contentRows.map((row) => (
                      <div key={row.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-semibold capitalize">{row.section} Section</h3>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              onClick={() => saveContentChanges(row.id, row.section)}
                            >
                              Save Changes
                            </Button>
                          </div>
                        </div>
                        <Textarea
                          value={editingContent[row.id] || ''}
                          onChange={(e) => setEditingContent(prev => ({
                            ...prev,
                            [row.id]: e.target.value
                          }))}
                          rows={12}
                          className="font-mono text-sm"
                          placeholder="JSON content..."
                        />
                        <div className="text-xs text-gray-500 mt-2">
                          Last updated: {new Date(row.updated_at).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="media">
            <Card>
              <CardHeader>
                <CardTitle>Video Upload</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="video">Demo Video</Label>
                    <Input
                      id="video"
                      type="file"
                      accept="video/*"
                      onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                      className="mt-2"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Upload a video for the demo section. Supported formats: MP4, WebM, MOV
                    </p>
                  </div>
                  <Button 
                    onClick={handleVideoUpload} 
                    disabled={!videoFile || uploadingVideo}
                  >
                    {uploadingVideo ? "Uploading..." : "Upload Video"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Brand Colors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="primary">Primary Color (HSL)</Label>
                    <Input
                      id="primary"
                      type="text"
                      placeholder="e.g., 345 90% 55%"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="mt-2"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Enter HSL values (e.g., 345 90% 55% for pink)
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="secondary">Secondary Color (HSL)</Label>
                    <Input
                      id="secondary"
                      type="text"
                      placeholder="e.g., 280 90% 55%"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="mt-2"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Enter HSL values (e.g., 280 90% 55% for purple)
                    </p>
                  </div>
                  <Button onClick={saveColorPalette}>
                    Save Color Palette
                  </Button>
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium mb-2">Current Colors:</p>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-8 h-8 rounded border"
                          style={{ backgroundColor: primaryColor ? `hsl(${primaryColor})` : 'hsl(345 90% 55%)' }}
                        />
                        <span className="text-sm">Primary</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-8 h-8 rounded border"
                          style={{ backgroundColor: secondaryColor ? `hsl(${secondaryColor})` : 'hsl(280 90% 55%)' }}
                        />
                        <span className="text-sm">Secondary</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}