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
    <header className="border-b-0 flex-1 bg-primary">
      <div className="flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-8">
          <h1 className="text-4xl font-bold text-primary-foreground">
            <span className="text-accent">AIIM</span>Track
          </h1>
          <div className="relative w-full max-w-md sm:max-w-lg lg:max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-foreground/70 h-4 w-4" />
            <Input 
              placeholder="Search expenses, assets, departments..." 
              className="pl-10 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60 focus:bg-primary-foreground/20"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <ThemeToggle />
          
          <Button variant="ghost" size="icon" className="relative text-primary-foreground hover:bg-primary-foreground/10">
            <Bell className="h-5 w-5" />
            {pendingClaims > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-destructive text-destructive-foreground">
                {pendingClaims}
              </Badge>
            )}
          </Button>
          
          <div className="flex items-center gap-3 text-base text-primary-foreground">
            <User className="h-5 w-5" />
            <div>
              <p className="font-medium">{currentUser.name}</p>
              <p className="text-primary-foreground/70 text-sm">{currentUser.role}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}