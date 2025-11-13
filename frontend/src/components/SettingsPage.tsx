import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import { User, Lock, Palette, Bell } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    name: 'Utilizador Admin',
    email: 'admin@carlosmateus.pt',
    role: 'Administrador'
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    reportUpdates: true,
    systemAlerts: false
  });

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Perfil atualizado com sucesso!');
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Palavra-passe alterada com sucesso!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[#2B2B2B] mb-2">Definições</h2>
        <p className="text-sm text-gray-500">Gerir as definições e preferências da sua conta</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Segurança
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Aparência
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notificações
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-4">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>Informações do Perfil</CardTitle>
              <CardDescription>Atualizar as informações do perfil da sua conta</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Endereço de Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Função</Label>
                  <Input
                    id="role"
                    value={profile.role}
                    disabled
                    className="bg-gray-50"
                  />
                </div>

                <Button type="submit" className="bg-[#0057D9] hover:bg-[#003A8C] text-white">
                  Atualizar Perfil
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-4">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Ensure your account is using a strong password</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    placeholder="Enter current password"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="Enter new password"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm new password"
                  />
                </div>

                <Button type="submit" className="bg-[#0057D9] hover:bg-[#003A8C] text-white">
                  Change Password
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="space-y-4">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>Theme Preferences</CardTitle>
              <CardDescription>Customize the appearance of your interface</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm text-[#2B2B2B]">Color Theme</h4>
                <div className="grid grid-cols-3 gap-4">
                  <button className="p-4 border-2 border-[#0057D9] rounded-lg bg-white flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-white border-2 border-gray-200 rounded"></div>
                    <span className="text-sm">Light</span>
                  </button>
                  <button className="p-4 border-2 border-gray-200 rounded-lg bg-white flex flex-col items-center gap-2 opacity-50">
                    <div className="w-12 h-12 bg-gray-900 rounded"></div>
                    <span className="text-sm">Dark (Coming Soon)</span>
                  </button>
                  <button className="p-4 border-2 border-gray-200 rounded-lg bg-white flex flex-col items-center gap-2 opacity-50">
                    <div className="w-12 h-12 bg-gradient-to-br from-white to-gray-900 rounded"></div>
                    <span className="text-sm">Auto (Coming Soon)</span>
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-sm text-[#2B2B2B] mb-4">Accent Color</h4>
                <div className="flex gap-3">
                  <button className="w-10 h-10 rounded-full bg-[#0057D9] border-2 border-gray-300 shadow-sm"></button>
                  <button className="w-10 h-10 rounded-full bg-green-500 border-2 border-transparent shadow-sm opacity-50"></button>
                  <button className="w-10 h-10 rounded-full bg-purple-500 border-2 border-transparent shadow-sm opacity-50"></button>
                  <button className="w-10 h-10 rounded-full bg-orange-500 border-2 border-transparent shadow-sm opacity-50"></button>
                </div>
                <p className="text-xs text-gray-500 mt-2">Additional colors coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Manage how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-[#2B2B2B]">Email Notifications</p>
                  <p className="text-xs text-gray-500">Receive email updates about your account</p>
                </div>
                <Switch
                  checked={notifications.emailNotifications}
                  onCheckedChange={(checked) => 
                    setNotifications({ ...notifications, emailNotifications: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-[#2B2B2B]">Report Updates</p>
                  <p className="text-xs text-gray-500">Get notified when reports are updated</p>
                </div>
                <Switch
                  checked={notifications.reportUpdates}
                  onCheckedChange={(checked) => 
                    setNotifications({ ...notifications, reportUpdates: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-[#2B2B2B]">System Alerts</p>
                  <p className="text-xs text-gray-500">Receive alerts about system maintenance</p>
                </div>
                <Switch
                  checked={notifications.systemAlerts}
                  onCheckedChange={(checked) => 
                    setNotifications({ ...notifications, systemAlerts: checked })
                  }
                />
              </div>

              <Button className="bg-[#0057D9] hover:bg-[#003A8C] text-white mt-4">
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
