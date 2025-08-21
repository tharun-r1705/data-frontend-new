import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { studentAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Mail, 
  GraduationCap, 
  Edit3,
  Save,
  X,
  LogOut,
  Shield,
  AlertTriangle
} from 'lucide-react';

type HostelStatus = 'hosteler' | 'dayscholar' | undefined;

interface StudentProfile {
  _id?: string;
  user?: string;
  rollNo: string;
  name: string;
  class: string;
  section: string;
  phoneNumber: string;
  email: string;
  address?: string;
  clubs?: string[];
  dob?: string;
  certificationsCount?: number;
  tenthMark?: number;
  twelfthMark?: number;
  hostelOrDayScholar?: HostelStatus;
  roomNumber?: string;
  busNumber?: string;
}

const emptyProfile: StudentProfile = {
  rollNo: '',
  name: '',
  class: '',
  section: '',
  phoneNumber: '',
  email: '',
};

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [flaggedFields, setFlaggedFields] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<StudentProfile>(emptyProfile);

  const formatDate = (iso?: string) => {
    if (!iso) return '';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString();
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const response = await studentAPI.getProfile();
      const { profile, missingFields, flaggedFields } = response.data;
      setProfile(profile);
      setMissingFields(missingFields || []);
      setFlaggedFields(flaggedFields || []);
      setEditData(profile);
    } catch (error: any) {
      if (error?.response?.status === 404) {
        // No profile yet — allow creating one
        setProfile(null);
        setEditData({ ...emptyProfile, email: user?.email || '' });
        setIsEditing(true);
      } else {
        toast({
          title: 'Error loading profile',
          description: error?.response?.data?.message || 'Failed to load profile',
          variant: 'destructive',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const response = await studentAPI.updateProfile(editData);
      const { profile, missingFields, flaggedFields } = response.data;
      setProfile(profile);
      setMissingFields(missingFields || []);
      setFlaggedFields(flaggedFields || []);
      setIsEditing(false);
      toast({
        title: 'Profile saved',
        description: 'Your profile has been saved successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Save failed',
        description: error?.response?.data?.message || 'Failed to save profile',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (profile) setEditData(profile);
    setIsEditing(false);
  };

  const handleUnflagField = async (fieldName: string) => {
    try {
      await studentAPI.unflagField({ fieldName });
      await loadProfile();
      toast({
        title: 'Field unflagged',
        description: `${fieldName} has been unflagged`,
      });
    } catch (error: any) {
      toast({
        title: 'Unflag failed',
        description: error?.response?.data?.message || 'Failed to unflag field',
        variant: 'destructive',
      });
    }
  };

  const isHosteler = editData.hostelOrDayScholar === 'hosteler';
  const isDayscholar = editData.hostelOrDayScholar === 'dayscholar';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-white/5 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Student Dashboard</h1>
                <p className="text-sm text-muted-foreground">Welcome back, {user?.name || user?.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className="text-primary hover:text-primary/80"
              >
                {isEditing ? <X className="w-4 h-4 mr-2" /> : <Edit3 className="w-4 h-4 mr-2" />}
                {isEditing ? 'Cancel' : (profile ? 'Edit Profile' : 'Create Profile')}
              </Button>

              {isEditing && (
                <>
                  <Button onClick={handleSave} disabled={isLoading} className="bg-gradient-primary hover:bg-gradient-primary/90">
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  {profile && (
                    <Button variant="ghost" size="sm" onClick={handleCancel} className="text-muted-foreground hover:text-foreground">
                      <X className="w-4 h-4 mr-2" />
                      Discard
                    </Button>
                  )}
                </>
              )}

              <Button variant="ghost" size="sm" onClick={logout} className="text-muted-foreground hover:text-foreground">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card className="backdrop-blur-xl bg-white/10 border-white/20">
              <CardHeader className="text-center">
                <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-12 h-12 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold">{editData.name || '-'}</CardTitle>
                <CardDescription className="text-muted-foreground">{editData.class ? `Class ${editData.class}${editData.section ? '-' + editData.section : ''}` : '-'}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{editData.email || user?.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <GraduationCap className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Roll No: {editData.rollNo || '-'}</span>
                  </div>
                </div>

                {missingFields.length > 0 && (
                  <div className="pt-2">
                    <p className="text-xs text-muted-foreground mb-2">Missing fields</p>
                    <div className="flex flex-wrap gap-2">
                      {missingFields.map((f) => (
                        <Badge key={f} variant="secondary" className="bg-destructive/10 text-destructive border-destructive/20">{f}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card className="backdrop-blur-xl bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Personal Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" value={editData.name || ''} onChange={(e) => setEditData({ ...editData, name: e.target.value })} disabled={!isEditing} className="bg-white/5 border-white/20" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" value={editData.phoneNumber || ''} onChange={(e) => setEditData({ ...editData, phoneNumber: e.target.value })} disabled={!isEditing} className="bg-white/5 border-white/20" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input
                      id="dob"
                      type={isEditing ? 'date' : 'text'}
                      value={isEditing
                        ? (editData.dob ? new Date(editData.dob).toISOString().slice(0, 10) : '')
                        : formatDate(editData.dob)}
                      onChange={(e) => setEditData({ ...editData, dob: e.target.value || undefined })}
                      disabled={!isEditing}
                      className="bg-white/5 border-white/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={editData.email || ''} onChange={(e) => setEditData({ ...editData, email: e.target.value })} disabled={!isEditing} className="bg-white/5 border-white/20" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" value={editData.address || ''} onChange={(e) => setEditData({ ...editData, address: e.target.value })} disabled={!isEditing} className="bg-white/5 border-white/20" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-xl bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <GraduationCap className="w-5 h-5" />
                  <span>Academic Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rollNo">Roll Number</Label>
                    <Input id="rollNo" value={editData.rollNo || ''} onChange={(e) => setEditData({ ...editData, rollNo: e.target.value })} disabled={!isEditing} className="bg-white/5 border-white/20" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="class">Class</Label>
                    <Input id="class" value={editData.class || ''} onChange={(e) => setEditData({ ...editData, class: e.target.value })} disabled={!isEditing} className="bg-white/5 border-white/20" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="section">Section</Label>
                    <Input id="section" value={editData.section || ''} onChange={(e) => setEditData({ ...editData, section: e.target.value })} disabled={!isEditing} className="bg-white/5 border-white/20" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="certs">Certifications Count</Label>
                    <Input id="certs" type="number" value={editData.certificationsCount ?? ''} onChange={(e) => setEditData({ ...editData, certificationsCount: e.target.value === '' ? undefined : Number(e.target.value) })} disabled={!isEditing} className="bg-white/5 border-white/20" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tenth">10th Mark</Label>
                    <Input id="tenth" type="number" value={editData.tenthMark ?? ''} onChange={(e) => setEditData({ ...editData, tenthMark: e.target.value === '' ? undefined : Number(e.target.value) })} disabled={!isEditing} className="bg-white/5 border-white/20" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twelfth">12th Mark</Label>
                    <Input id="twelfth" type="number" value={editData.twelfthMark ?? ''} onChange={(e) => setEditData({ ...editData, twelfthMark: e.target.value === '' ? undefined : Number(e.target.value) })} disabled={!isEditing} className="bg-white/5 border-white/20" />
                  </div>
                </div>

                <Separator className="my-2" />

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Hostel/Day Scholar</Label>
                    <Input id="status" placeholder="hosteler or dayscholar" value={editData.hostelOrDayScholar || ''} onChange={(e) => setEditData({ ...editData, hostelOrDayScholar: (e.target.value as HostelStatus) })} disabled={!isEditing} className="bg-white/5 border-white/20" />
                  </div>
                  {isHosteler && (
                    <div className="space-y-2">
                      <Label htmlFor="room">Room Number</Label>
                      <Input id="room" value={editData.roomNumber || ''} onChange={(e) => setEditData({ ...editData, roomNumber: e.target.value })} disabled={!isEditing} className="bg-white/5 border-white/20" />
                    </div>
                  )}
                  {isDayscholar && (
                    <div className="space-y-2">
                      <Label htmlFor="bus">Bus Number</Label>
                      <Input id="bus" value={editData.busNumber || ''} onChange={(e) => setEditData({ ...editData, busNumber: e.target.value })} disabled={!isEditing} className="bg-white/5 border-white/20" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {flaggedFields.length > 0 && (
              <Card className="backdrop-blur-xl bg-white/10 border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-warning" />
                    <span>Flagged Fields</span>
                  </CardTitle>
                  <CardDescription>These fields were flagged by a teacher</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {flaggedFields.map((field) => (
                      <div key={field} className="flex items-center gap-2 p-2 pr-3 rounded-md bg-warning/10 border border-warning/20">
                        <Badge variant="secondary" className="bg-warning/20 text-warning border-warning/30">{field}</Badge>
                        <Button size="sm" variant="outline" onClick={() => handleUnflagField(field)} className="border-warning/30 text-warning hover:bg-warning/10">
                          <Shield className="w-4 h-4 mr-2" /> Unflag
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
