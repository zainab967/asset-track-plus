import { Search, User, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface AppHeaderProps {
  currentUser: {
    name: string;
    role: string;
  };
  pendingClaims: number;
}

export function AppHeader({ currentUser, pendingClaims }: AppHeaderProps) {
  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-6">
          <h1 className="text-2xl font-bold text-primary">AIIMTrack</h1>
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Search expenses, assets, departments..." 
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {pendingClaims > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                {pendingClaims}
              </Badge>
            )}
          </Button>
          
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4" />
            <div>
              <p className="font-medium">{currentUser.name}</p>
              <p className="text-muted-foreground text-xs">{currentUser.role}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}