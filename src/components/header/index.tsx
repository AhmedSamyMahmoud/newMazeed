import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "../../apis/auth";
import { LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function Header() {
  const navigate = useNavigate();
  const { logout, token } = useAuth();

  const handleSignOut = () => {
    navigate("/login");
    setTimeout(() => {
      logout();
    }, 300);
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="flex items-center font-medium text-gray-900 text-lg"
            >
              <span>mazeed.ai</span>
            </Link>
          </div>
          <nav className="ml-12 flex items-baseline space-x-8">
            <a
              href="#"
              className="px-1 py-2 text-sm font-medium text-gray-500 hover:text-gray-900"
            >
              Features
            </a>
            <a
              href="#"
              className="px-1 py-2 text-sm font-medium text-gray-500 hover:text-gray-900"
            >
              How It Works
            </a>
            <a
              href="#"
              className="px-1 py-2 text-sm font-medium text-gray-500 hover:text-gray-900"
            >
              Success Stories
            </a>
            <Link
              href={token ? "/" : "/auth"}
              className="px-1 py-2 text-sm font-medium text-[#FF7846] hover:text-[#FF5A2D]"
            >
              Content Transformer
            </Link>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          {token ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>{token?.firstName + " " + token?.lastName}</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-1" />
                Sign Out
              </Button>
            </div>
          ) : (
            <>
              <a
                href="#"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Join Waitlist
              </a>
              <a
                href="#"
                className="bg-[#FF7846] hover:bg-[#FF5A2D] text-white px-4 py-2 rounded text-sm font-medium transition-colors"
              >
                Book a Demo
              </a>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
