import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin } from 'lucide-react';

interface Theatre {
  id: string;
  name: string;
  location: string;
  city: string;
  amenities: string[] | null;
  is_active: boolean;
}

interface TheatreSelectorProps {
  userCity?: string;
  selectedTheatreId?: string;
  onSelectTheatre: (theatre: Theatre) => void;
}

const TheatreSelector = ({ userCity, selectedTheatreId, onSelectTheatre }: TheatreSelectorProps) => {
  const [theatres, setTheatres] = useState<Theatre[]>([]);
  const [search, setSearch] = useState(userCity || '');

  useEffect(() => {
    fetchTheatres();
  }, []);

  const fetchTheatres = async () => {
    const { data } = await supabase.from('theatres').select('*').eq('is_active', true).order('name');
    if (data) setTheatres(data);
  };

  const filtered = theatres.filter(t =>
    t.city.toLowerCase().includes(search.toLowerCase()) ||
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search theatres by city..."
          className="pl-9 bg-secondary/50"
        />
      </div>
      <div className="grid gap-2 max-h-[300px] overflow-y-auto">
        {filtered.map((theatre) => (
          <div
            key={theatre.id}
            onClick={() => onSelectTheatre(theatre)}
            className={`p-3 rounded-lg border cursor-pointer transition-all ${
              selectedTheatreId === theatre.id
                ? 'border-primary bg-primary/10'
                : 'border-border hover:border-primary/30 bg-card'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">{theatre.name}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {theatre.location}, {theatre.city}
                </p>
              </div>
              {theatre.amenities && theatre.amenities.length > 0 && (
                <div className="flex gap-1">
                  {theatre.amenities.slice(0, 2).map(a => (
                    <Badge key={a} variant="outline" className="text-[10px]">{a}</Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">No theatres found in "{search}"</p>
        )}
      </div>
    </div>
  );
};

export default TheatreSelector;
