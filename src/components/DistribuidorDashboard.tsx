
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RegistroDistribuicao } from '@/components/RegistroDistribuicao';

interface DistribuidorDashboardProps {
  currentUser: string;
  onLogout: () => void;
}

export const DistribuidorDashboard = ({ currentUser, onLogout }: DistribuidorDashboardProps) => {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-sweet-cream-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-sweet-pink-500 to-sweet-gold-500 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl">🍰</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-sweet-gold-800">Doce Doçura</h1>
                <p className="text-sweet-gold-600">Painel do Distribuidor</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-sweet-gold-600">Bem-vindo,</p>
                <p className="font-medium text-sweet-gold-800">{currentUser}</p>
              </div>
              <Button onClick={onLogout} variant="outline" className="border-sweet-cream-400 hover:bg-sweet-cream-100">
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="distribuicao" className="w-full">
          <TabsList className="grid w-full grid-cols-1 mb-8 bg-white border border-sweet-cream-300">
            <TabsTrigger value="distribuicao" className="flex items-center gap-2 data-[state=active]:bg-sweet-pink-500 data-[state=active]:text-white">
              🚛 Distribuição
            </TabsTrigger>
          </TabsList>

          <TabsContent value="distribuicao">
            <RegistroDistribuicao distribuidorName={currentUser} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};
