import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import AuthModal from './AuthModal';
import { User, LogOut, Heart, Film } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  showFavoritesOnly: boolean;
  onToggleFavorites: () => void;
}

const Header = ({ showFavoritesOnly, onToggleFavorites }: HeaderProps) => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { user, loading, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container max-w-7xl py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Film className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold gradient-text">CineBook</span>
          </div>

          <div className="flex items-center gap-3">
            {user && (
              <Button
                variant={showFavoritesOnly ? 'default' : 'outline'}
                size="sm"
                onClick={onToggleFavorites}
                className="gap-2"
              >
                <Heart className={`w-4 h-4 ${showFavoritesOnly ? 'fill-current' : ''}`} />
                <span className="hidden sm:inline">Favorites</span>
              </Button>
            )}

            {loading ? (
              <div className="w-8 h-8 rounded-full bg-secondary animate-pulse" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user.email}</p>
                    <p className="text-xs text-muted-foreground">Signed in</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => setAuthModalOpen(true)} size="sm">
                <User className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </>
  );
};

export default Header;
