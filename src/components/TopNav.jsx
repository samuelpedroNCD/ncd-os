import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import * as Dialog from '@radix-ui/react-dialog';
import { useAuthStore } from '../stores/authStore';
import { useThemeStore } from '../stores/themeStore';
import { Avatar } from './ui/Avatar';
import { Button } from './ui/Button';
import { LogOut, Moon, Sun } from 'lucide-react';

export function TopNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useAuthStore(state => state.logout);
  const { theme, toggleTheme } = useThemeStore();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setIsLogoutDialogOpen(false);
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/projects', label: 'Projects' },
    { path: '/tasks', label: 'Tasks' },
    { path: '/clients', label: 'Clients' },
    { path: '/team', label: 'Team' },
    { path: '/invoices', label: 'Invoices' },
  ];

  return (
    <div className="fixed top-4 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-card/80 backdrop-blur-xl border border-border rounded-full shadow-lg">
          <div className="h-14 flex items-center justify-between px-6">
            <Link to="/" className="text-xl font-bold flex items-center space-x-2">
              <span className="text-primary">NCD-OS</span>
            </Link>
            
            <NavigationMenu.Root className="relative">
              <NavigationMenu.List className="flex items-center space-x-1">
                {navItems.map((item) => (
                  <NavigationMenu.Item key={item.path}>
                    <Link
                      to={item.path}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        isActive(item.path)
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </NavigationMenu.Item>
                ))}
              </NavigationMenu.List>
            </NavigationMenu.Root>

            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleTheme} 
                className="relative w-9 h-9 rounded-full"
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                <Sun className={`h-[1.2rem] w-[1.2rem] transition-all ${
                  theme === 'dark' ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
                }`} />
                <Moon className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${
                  theme === 'dark' ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                }`} />
              </Button>
              <Avatar className="h-8 w-8" />
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsLogoutDialogOpen(true)}
                className="rounded-full"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog.Root open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-background/80 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-sm bg-card border border-border rounded-lg shadow-xl">
            <div className="p-6">
              <Dialog.Title className="text-xl font-semibold text-foreground mb-4">
                Confirm Logout
              </Dialog.Title>
              <Dialog.Description className="text-muted-foreground mb-6">
                Are you sure you want to log out? You'll need to sign in again to access your account.
              </Dialog.Description>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsLogoutDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
