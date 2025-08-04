import { Search, User, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ThemeToggle";

interface AppHeaderProps {
  currentUser: {
    name: string;
    role: string;
  };
  pendingClaims: number;
}

export function Header({ currentUser, pendingClaims }: AppHeaderProps) {
  return (
    <header className="border-b sticky top-0 z-50" style={{ backgroundColor: 'hsl(var(--header-bg))' }}>
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-6">
          <h1 className="text-2xl font-bold text-white">
            <span style={{ color: 'hsl(var(--header-brand-accent))' }}>AIIM</span>Track
          </h1>
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 h-4 w-4" />
            <Input 
              placeholder="Search expenses, assets, departments..." 
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/10">
            <Bell className="h-5 w-5" />
            {pendingClaims > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground">
                {pendingClaims}
              </Badge>
            )}
          </Button>
          
          <div className="flex items-center gap-2 text-sm text-white">
            <User className="h-4 w-4" />
            <div>
              <p className="font-medium">{currentUser.name}</p>
              <p className="text-white/70 text-xs">{currentUser.role}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}