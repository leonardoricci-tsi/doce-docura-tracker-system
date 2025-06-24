
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FabricaLoginForm } from './FabricaLoginForm';
import { DistribuidorLoginForm } from './DistribuidorLoginForm';
import { UserRole } from '@/pages/Index';

interface LoginTabsProps {
  onLogin: (email: string, password: string, role: UserRole) => void;
  isLoading: boolean;
}

export const LoginTabs = ({ onLogin, isLoading }: LoginTabsProps) => {
  return (
    <Tabs defaultValue="fabrica" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6 bg-brand-yellow-300 text-brand-brown-700">
        <TabsTrigger
          value="fabrica"
          className="flex items-center gap-2 transform transition duration-200 data-[state=active]:scale-105 data-[state=active]:bg-brand-yellow-400 data-[state=active]:text-brand-brown-800"
        >
          🏭 Fábrica
        </TabsTrigger>
        <TabsTrigger
          value="distribuidor"
          className="flex items-center gap-2 transform transition duration-200 data-[state=active]:scale-105 data-[state=active]:bg-brand-yellow-400 data-[state=active]:text-brand-brown-800"
        >
          🚛 Distribuidor
        </TabsTrigger>
      </TabsList>

      <TabsContent value="fabrica">
        <FabricaLoginForm onLogin={onLogin} isLoading={isLoading} />
      </TabsContent>

      <TabsContent value="distribuidor">
        <DistribuidorLoginForm onLogin={onLogin} isLoading={isLoading} />
      </TabsContent>
    </Tabs>
  );
};
