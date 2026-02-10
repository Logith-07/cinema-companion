import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, Monitor, Users, Ticket, Star, BarChart3, ArrowLeft, Edit2, Save, X, Search } from 'lucide-react';
import adminAvatar from '@/assets/admin-avatar.jpeg';
import { format } from 'date-fns';

interface AdminPanelProps {
  onBack: () => void;
}

const AdminPanel = ({ onBack }: AdminPanelProps) => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [theatres, setTheatres] = useState<any[]>([]);
  const [screens, setScreens] = useState<any[]>([]);
  const [allBookings, setAllBookings] = useState<any[]>([]);
  const [allProfiles, setAllProfiles] = useState<any[]>([]);
  const [allReviews, setAllReviews] = useState<any[]>([]);
  const [selectedTheatre, setSelectedTheatre] = useState<string | null>(null);
  const [editingTheatre, setEditingTheatre] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', location: '', city: '', contact_phone: '' });
  const [bookingSearch, setBookingSearch] = useState('');
  const [verifyRef, setVerifyRef] = useState('');
  const [verifyResult, setVerifyResult] = useState<any>(null);

  useEffect(() => {
    if (user) init();
  }, [user]);

  const init = async () => {
    const { data: roleData } = await supabase.rpc('has_role', { _user_id: user!.id, _role: 'admin' });
    const admin = !!roleData;
    setIsAdmin(admin);
    
    const [t, s] = await Promise.all([
      supabase.from('theatres').select('*').order('name'),
      supabase.from('screens').select('*').order('name'),
    ]);
    if (t.data) setTheatres(t.data);
    if (s.data) setScreens(s.data);

    if (admin) {
      const [b, p, r] = await Promise.all([
        supabase.from('bookings').select('*').order('created_at', { ascending: false }),
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('reviews').select('*').order('created_at', { ascending: false }),
      ]);
      if (b.data) setAllBookings(b.data);
      if (p.data) setAllProfiles(p.data);
      if (r.data) setAllReviews(r.data);
    }
    setLoading(false);
  };

  const startEditing = (theatre: any) => {
    setEditingTheatre(theatre.id);
    setEditForm({ name: theatre.name, location: theatre.location, city: theatre.city, contact_phone: theatre.contact_phone || '' });
  };

  const saveTheatre = async (id: string) => {
    await supabase.from('theatres').update(editForm).eq('id', id);
    setEditingTheatre(null);
    const { data } = await supabase.from('theatres').select('*').order('name');
    if (data) setTheatres(data);
  };

  const verifyTicket = () => {
    const found = allBookings.find(b => b.booking_ref === verifyRef);
    setVerifyResult(found || 'not_found');
  };

  const totalRevenue = allBookings.reduce((s, b) => s + Number(b.total_amount), 0);
  const theatreScreens = screens.filter(s => s.theatre_id === selectedTheatre);
  const filteredBookings = allBookings.filter(b =>
    b.movie_title?.toLowerCase().includes(bookingSearch.toLowerCase()) ||
    b.booking_ref?.toLowerCase().includes(bookingSearch.toLowerCase())
  );

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;
  }

  if (!isAdmin) {
    return (
      <div className="text-center py-20 space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-destructive/20 flex items-center justify-center">
          <X className="w-8 h-8 text-destructive" />
        </div>
        <h2 className="text-2xl font-bold">Access Denied</h2>
        <p className="text-muted-foreground">You don't have admin privileges.</p>
        <Button variant="outline" onClick={onBack}><ArrowLeft className="w-4 h-4 mr-2" />Go Back</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}><ArrowLeft className="w-5 h-5" /></Button>
        <img src={adminAvatar} alt="Admin" className="w-12 h-12 rounded-full object-cover border-2 border-primary" />
        <div>
          <h2 className="text-2xl font-bold gradient-text">Admin Dashboard</h2>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-card border border-border"><p className="text-xs text-muted-foreground">Users</p><p className="text-2xl font-bold">{allProfiles.length}</p></div>
        <div className="p-4 rounded-xl bg-card border border-border"><p className="text-xs text-muted-foreground">Bookings</p><p className="text-2xl font-bold">{allBookings.length}</p></div>
        <div className="p-4 rounded-xl bg-card border border-border"><p className="text-xs text-muted-foreground">Revenue</p><p className="text-2xl font-bold text-cinema-gold">${totalRevenue.toFixed(0)}</p></div>
        <div className="p-4 rounded-xl bg-card border border-border"><p className="text-xs text-muted-foreground">Theatres</p><p className="text-2xl font-bold">{theatres.length}</p></div>
      </div>

      <Separator />

      <Tabs defaultValue="bookings">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="bookings" className="gap-1 text-xs"><Ticket className="w-3 h-3" />Bookings</TabsTrigger>
          <TabsTrigger value="users" className="gap-1 text-xs"><Users className="w-3 h-3" />Users</TabsTrigger>
          <TabsTrigger value="reviews" className="gap-1 text-xs"><Star className="w-3 h-3" />Reviews</TabsTrigger>
          <TabsTrigger value="theatres" className="gap-1 text-xs"><Building2 className="w-3 h-3" />Theatres</TabsTrigger>
          <TabsTrigger value="verify" className="gap-1 text-xs"><BarChart3 className="w-3 h-3" />Verify</TabsTrigger>
        </TabsList>

        <TabsContent value="bookings" className="space-y-4 mt-4">
          <Input value={bookingSearch} onChange={(e) => setBookingSearch(e.target.value)} placeholder="Search by movie or booking ref..." className="bg-secondary/50" />
          <div className="grid gap-3 max-h-[500px] overflow-y-auto">
            {filteredBookings.map((b) => (
              <div key={b.id} className="p-3 rounded-xl bg-card border border-border text-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{b.movie_title}</p>
                    <p className="text-xs text-muted-foreground">{b.showtime} • {b.screen}</p>
                    <p className="text-xs text-muted-foreground">Seats: {b.seats?.join(', ')}</p>
                    <p className="text-xs font-mono text-primary mt-1">Ref: {b.booking_ref}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={b.status === 'confirmed' ? 'default' : 'secondary'}>{b.status}</Badge>
                    <p className="font-bold mt-1">${Number(b.total_amount).toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">{format(new Date(b.created_at), 'MMM d, yyyy')}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4 mt-4">
          <div className="grid gap-3 max-h-[500px] overflow-y-auto">
            {allProfiles.map((p) => (
              <div key={p.id} className="p-3 rounded-xl bg-card border border-border text-sm flex justify-between items-center">
                <div>
                  <p className="font-semibold">{(p as any).display_name || p.email || 'Unknown'}</p>
                  <p className="text-xs text-muted-foreground">{p.email}</p>
                  {(p as any).city && <p className="text-xs text-muted-foreground">📍 {(p as any).city}</p>}
                </div>
                <p className="text-xs text-muted-foreground">{format(new Date(p.created_at), 'MMM d, yyyy')}</p>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4 mt-4">
          <div className="grid gap-3 max-h-[500px] overflow-y-auto">
            {allReviews.map((r: any) => (
              <div key={r.id} className="p-3 rounded-xl bg-card border border-border text-sm">
                <div className="flex items-center gap-1 mb-1">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} className={`w-3 h-3 ${s <= r.rating ? 'text-cinema-gold fill-cinema-gold' : 'text-muted-foreground/30'}`} />
                  ))}
                  <span className="text-xs text-muted-foreground ml-2">Movie #{r.movie_id}</span>
                </div>
                {r.comment && <p className="text-muted-foreground">{r.comment}</p>}
                <p className="text-xs text-muted-foreground mt-1">{format(new Date(r.created_at), 'MMM d, yyyy')}</p>
              </div>
            ))}
            {allReviews.length === 0 && <p className="text-center text-muted-foreground py-8">No reviews yet</p>}
          </div>
        </TabsContent>

        <TabsContent value="theatres" className="space-y-4 mt-4">
          <div className="grid gap-4">
            {theatres.map((theatre) => (
              <div key={theatre.id} className="p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors">
                {editingTheatre === theatre.id ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div><Label>Name</Label><Input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} /></div>
                      <div><Label>City</Label><Input value={editForm.city} onChange={(e) => setEditForm({ ...editForm, city: e.target.value })} /></div>
                      <div><Label>Location</Label><Input value={editForm.location} onChange={(e) => setEditForm({ ...editForm, location: e.target.value })} /></div>
                      <div><Label>Phone</Label><Input value={editForm.contact_phone} onChange={(e) => setEditForm({ ...editForm, contact_phone: e.target.value })} /></div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => saveTheatre(theatre.id)} className="gap-1"><Save className="w-3 h-3" />Save</Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditingTheatre(null)}><X className="w-3 h-3" /></Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between">
                    <div className="cursor-pointer flex-1" onClick={() => setSelectedTheatre(selectedTheatre === theatre.id ? null : theatre.id)}>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{theatre.name}</h3>
                        <Badge variant={theatre.is_active ? 'default' : 'secondary'}>{theatre.is_active ? 'Active' : 'Inactive'}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{theatre.location}, {theatre.city}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {theatre.amenities?.map((a: string) => <Badge key={a} variant="outline" className="text-xs">{a}</Badge>)}
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => startEditing(theatre)}><Edit2 className="w-4 h-4" /></Button>
                  </div>
                )}
                {selectedTheatre === theatre.id && (
                  <div className="mt-4 pt-4 border-t border-border space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Screens</h4>
                    {theatreScreens.length > 0 ? theatreScreens.map((screen) => (
                      <div key={screen.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                        <div><span className="font-medium">{screen.name}</span><Badge variant="outline" className="ml-2 text-xs">{screen.screen_type}</Badge></div>
                        <span className="text-sm text-muted-foreground">{screen.total_seats} seats</span>
                      </div>
                    )) : <p className="text-sm text-muted-foreground">No screens</p>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="verify" className="space-y-4 mt-4">
          <div className="max-w-md mx-auto space-y-4">
            <h3 className="font-semibold">Verify Ticket</h3>
            <div className="flex gap-2">
              <Input value={verifyRef} onChange={(e) => setVerifyRef(e.target.value)} placeholder="Enter booking reference..." />
              <Button onClick={verifyTicket} className="gap-1"><Search className="w-4 h-4" />Verify</Button>
            </div>
            {verifyResult && verifyResult !== 'not_found' && (
              <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30">
                <Badge className="bg-green-500">✓ Valid Ticket</Badge>
                <p className="font-semibold mt-2">{verifyResult.movie_title}</p>
                <p className="text-sm text-muted-foreground">{verifyResult.showtime} • {verifyResult.screen}</p>
                <p className="text-sm">Seats: {verifyResult.seats?.join(', ')}</p>
              </div>
            )}
            {verifyResult === 'not_found' && (
              <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30">
                <Badge variant="destructive">✗ Invalid</Badge>
                <p className="text-sm text-muted-foreground mt-2">No booking found with that reference.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;
