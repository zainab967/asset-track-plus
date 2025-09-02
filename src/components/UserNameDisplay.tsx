import { useNavigate } from "react-router-dom";

interface UserNameDisplayProps {
  userName: string;
  currentUserRole: string;
  className?: string;
  children?: React.ReactNode;
}

export function UserNameDisplay({ userName, currentUserRole, className, children }: UserNameDisplayProps) {
  const navigate = useNavigate();

  const handleRightClick = (e: React.MouseEvent) => {
    // Only allow admins to right-click on user names to view profiles
    if (currentUserRole.toLowerCase() === "admin") {
      e.preventDefault();
      const userId = userName.toLowerCase().replace(/\s+/g, '-');
      navigate(`/profile/${userId}`);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    // Allow any user to click on their own name
    if (currentUserRole.toLowerCase() === "admin") {
      const userId = userName.toLowerCase().replace(/\s+/g, '-');
      navigate(`/profile/${userId}`);
    }
  };

  if (currentUserRole.toLowerCase() === "admin") {
    return (
      <span 
        className={`cursor-pointer hover:text-primary transition-colors ${className || ''}`}
        onClick={handleClick}
        onContextMenu={handleRightClick}
        title="Click to view user profile"
      >
        {children || userName}
      </span>
    );
  }

  return (
    <span className={className}>
      {children || userName}
    </span>
  );
}