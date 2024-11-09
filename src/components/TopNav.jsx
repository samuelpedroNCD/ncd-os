import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import * as Dialog from '@radix-ui/react-dialog';
import { useAuthStore } from '../stores/authStore';
import { useThemeStore } from '../stores/themeStore';
import { Avatar } from './ui/Avatar';
import { Button } from './ui/Button';
import { LogOut, Moon, Sun } from 'lucide-react';

export function TopNav() {
  const navigate = useNavigate();
  const logout = useAuthStore(state => state.logout);
  const { theme, toggleTheme } = useThemeStore();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setIsLogoutDialogOpen(false);
    navigate('/login');
  };

  return (
    <div className="fixed top-0 left-0 right-0 border-b border-zinc-800 bg-background/50 backdrop-blur-xl z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/" className="text-xl font-bold">
            NCD-OS
          </Link>
          
          <NavigationMenu.Root className="relative">
            <NavigationMenu.List className="flex space-x-4">
              <NavigationMenu.Item>
                <Link to="/projects" className="text-muted-foreground hover:text-foreground transition-colors">
                  Projects
                </Link>
              </NavigationMenu.Item>
              <NavigationMenu.Item>
                <Link to="/tasks" className="text-muted-foreground hover:text-foreground transition-colors">
                  Tasks
                </Link>
              </NavigationMenu.Item>
              <NavigationMenu.Item>
                <Link to="/clients" className="text-muted-foreground hover:text-foreground transition-colors">
                  Clients
                </Link>
              </NavigationMenu.Item>
              <NavigationMenu.Item>
                <Link to="/team" className="text-muted-foreground hover:text-foreground transition-colors">
                  Team
                </Link>
              </NavigationMenu.Item>
              <NavigationMenu.Item>
                <Link to="/invoices" className="text-muted-foreground hover:text-foreground transition-colors">
                  Invoices
                </Link>
              </NavigationMenu.Item>
            </NavigationMenu.List>
          </NavigationMenu.Root>
        </div>

        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme} 
            className="relative w-9 h-9"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            <Sun className={`h-[1.2rem] w-[1.2rem] transition-all ${
              theme === 'dark' ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
            }`} />
            <Moon className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${
              theme === 'dark' ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
            }`} />
          </Button>
          <Avatar />
          <Button variant="ghost" size="icon" onClick={() => setIsLogoutDialogOpen(true)}>
            <LogOut className="h-5 w-5" />
          </Button>
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