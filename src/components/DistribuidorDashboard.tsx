
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RegistroDistribuicao } from '@/components/RegistroDistribuicao';
import { Rastreabilidade } from '@/components/Rastreabilidade';
import { RoleBasedAccess } from '@/components/RoleBasedAccess';
import { AIAgentButton } from '@/components/AIAgentButton';

interface DistribuidorDashboardProps {
  currentUser: string;
  onLogout: () => void;
}

export const DistribuidorDashboard = ({ currentUser, onLogout }: DistribuidorDashboardProps) => {
  return (
    <RoleBasedAccess allowedRoles={['distribuidor']}>
      <div className="min-h-screen">
        {/* Header */}
        <header className="bg-brand-brown-800 shadow-md border-b border-brand-brown-700">
          <div className="max-w-77xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-brand-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-brand-brown-800 text-2xl">
                    <img src="/logo_system.png" alt="Logo" className="w-20 h-20 object-contain" />
                  </span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">MaplyRastro</h1>
                  <p className="text-brand-yellow-100">Painel do Distribuidor</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-brand-yellow-100">Bem-vindo,</p>
                  <p className="font-medium text-white">{currentUser}</p>
                </div>
                <Button onClick={onLogout} variant="outline" className="border-brand-yellow-400 text-brand-chocolate hover:bg-brand-yellow-400 hover:text-brand-brown-800">
                  Sair
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-brand-AmareloOuro min-h-screen">
          <Tabs defaultValue="distribuicao" className="w-full ">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-brand-yellow-300 border border-brand-neutral-300">
              <TabsTrigger value="distribuicao" className="flex items-center text-brand-chocolate gap-2 data-[state=active]:bg-brand-amareloPastel data-[state=active]:text-brand-doceLeite font-semibold">
                🚛 Distribuição
              </TabsTrigger>
              <TabsTrigger value="rastreabilidade" className="flex items-center text-brand-chocolate gap-2 data-[state=active]:bg-brand-amareloPastel data-[state=active]:text-brand-doceLeite font-semibold">
                🔍 Rastreabilidade 
              </TabsTrigger>
            </TabsList>

            <TabsContent value="distribuicao">
              <RoleBasedAccess allowedRoles={['distribuidor']}>
                <RegistroDistribuicao distribuidorName={currentUser} />
              </RoleBasedAccess>
            </TabsContent>

            <TabsContent value="rastreabilidade">
              <RoleBasedAccess allowedRoles={['distribuidor']}>
                <Rastreabilidade />
              </RoleBasedAccess>
            </TabsContent>
          </Tabs>
        </main>

        {/* AI Agent Button */}
        <AIAgentButton />
      </div>
    </RoleBasedAccess>
  );
};
