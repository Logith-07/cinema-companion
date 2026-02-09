import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, Monitor, Plus, Trash2, Edit2, Save, X, ArrowLeft } from 'lucide-react';
import adminAvatar from '@/assets/admin-avatar.jpeg';

interface Theatre {
  id: string;
  name: string;
  location: string;
  city: string;
  amenities: string[];
  contact_phone: string | null;
  is_active: boolean;
}

interface Screen {
  id: string;
  theatre_id: string;
  name: string;
  screen_type: string;
  total_seats: number;
  seat_rows: number;
  seats_per_row: number;
  is_active: boolean;
}

interface AdminPanelProps {
  onBack: () => void;
}

const AdminPanel = ({ onBack }: AdminPanelProps) => {
  const { user } = useAuth();
  const [theatres, setTheatres] = useState<Theatre[]>([]);
  const [screens, setScreens] = useState<Screen[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedTheatre, setSelectedTheatre] = useState<string | null>(null);
  const [editingTheatre, setEditingTheatre] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', location: '', city: '', contact_phone: '' });

  useEffect(() => {
    if (user) {
      checkAdminRole();
      fetchTheatres();
      fetchScreens();
    }
  }, [user]);

  const checkAdminRole = async () => {
    if (!user) return;
    const { data } = await supabase.rpc('has_role', { _user_id: user.id, _role: 'admin' });
    setIsAdmin(!!data);
  };

  const fetchTheatres = async () => {
    const { data } = await supabase.from('theatres').select('*').order('name');
    if (data) setTheatres(data);
    setLoading(false);
  };

  const fetchScreens = async () => {
    const { data } = await supabase.from('screens').select('*').order('name');
    if (data) setScreens(data);
  };

  const startEditing = (theatre: Theatre) => {
    setEditingTheatre(theatre.id);
    setEditForm({
      name: theatre.name,
      location: theatre.location,
      city: theatre.city,
      contact_phone: theatre.contact_phone || '',
    });
  };

  const saveTheatre = async (id: string) => {
    await supabase.from('theatres').update(editForm).eq('id', id);
    setEditingTheatre(null);
    fetchTheatres();
  };

  const theatreScreens = screens.filter(s => s.theatre_id === selectedTheatre);

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Admin Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <img src={adminAvatar} alt="Admin" className="w-12 h-12 rounded-full object-cover border-2 border-primary" />
        <div>
          <h2 className="text-2xl font-bold gradient-text">Admin Panel</h2>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>
        {!isAdmin && (
          <Badge variant="destructive" className="ml-auto">Not Admin — View Only</Badge>
        )}
      </div>

      <Separator />

      <Tabs defaultValue="theatres">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="theatres" className="gap-2">
            <Building2 className="w-4 h-4" />
            Theatres ({theatres.length})
          </TabsTrigger>
          <TabsTrigger value="screens" className="gap-2">
            <Monitor className="w-4 h-4" />
            Screens ({screens.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="theatres" className="space-y-4 mt-4">
          <div className="grid gap-4">
            {theatres.map((theatre) => (
              <div key={theatre.id} className="p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors">
                {editingTheatre === theatre.id ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Name</Label>
                        <Input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                      </div>
                      <div>
                        <Label>City</Label>
                        <Input value={editForm.city} onChange={(e) => setEditForm({ ...editForm, city: e.target.value })} />
                      </div>
                      <div>
                        <Label>Location</Label>
                        <Input value={editForm.location} onChange={(e) => setEditForm({ ...editForm, location: e.target.value })} />
                      </div>
                      <div>
                        <Label>Phone</Label>
                        <Input value={editForm.contact_phone} onChange={(e) => setEditForm({ ...editForm, contact_phone: e.target.value })} />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => saveTheatre(theatre.id)} className="gap-1"><Save className="w-3 h-3" />Save</Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditingTheatre(null)}><X className="w-3 h-3" /></Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 cursor-pointer flex-1" onClick={() => setSelectedTheatre(selectedTheatre === theatre.id ? null : theatre.id)}>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{theatre.name}</h3>
                        <Badge variant={theatre.is_active ? 'default' : 'secondary'}>
                          {theatre.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{theatre.location}, {theatre.city}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {theatre.amenities?.map((a) => (
                          <Badge key={a} variant="outline" className="text-xs">{a}</Badge>
                        ))}
                      </div>
                      {theatre.contact_phone && (
                        <p className="text-xs text-muted-foreground mt-1">📞 {theatre.contact_phone}</p>
                      )}
                    </div>
                    {isAdmin && (
                      <Button variant="ghost" size="icon" onClick={() => startEditing(theatre)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                )}

                {/* Screens under this theatre */}
                {selectedTheatre === theatre.id && (
                  <div className="mt-4 pt-4 border-t border-border space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Screens</h4>
                    {theatreScreens.length > 0 ? theatreScreens.map((screen) => (
                      <div key={screen.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                        <div>
                          <span className="font-medium">{screen.name}</span>
                          <Badge variant="outline" className="ml-2 text-xs">{screen.screen_type}</Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">{screen.total_seats} seats</span>
                      </div>
                    )) : (
                      <p className="text-sm text-muted-foreground">No screens found</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="screens" className="space-y-4 mt-4">
          <div className="grid gap-3">
            {screens.map((screen) => {
              const theatre = theatres.find(t => t.id === screen.theatre_id);
              return (
                <div key={screen.id} className="flex items-center justify-between p-4 rounded-xl bg-card border border-border">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{screen.name}</span>
                      <Badge variant="outline">{screen.screen_type}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{theatre?.name || 'Unknown Theatre'}</p>
                  </div>
                  <div className="text-right text-sm">
                    <p>{screen.total_seats} seats</p>
                    <p className="text-muted-foreground">{screen.seat_rows} rows × {screen.seats_per_row} cols</p>
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;
