
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GerenciamentoProducao } from '@/components/GerenciamentoProducao';
import { Rastreabilidade } from '@/components/Rastreabilidade';
import { DashboardAnalytics } from '@/components/DashboardAnalytics';

interface FabricaDashboardProps {
  currentUser: string;
  onLogout: () => void;
}

export const FabricaDashboard = ({ currentUser, onLogout }: FabricaDashboardProps) => {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-brand-brown-800 shadow-md border-b border-brand-brown-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-brand-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-brand-brown-800 text-2xl">🍰</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Doce Doçura</h1>
                <p className="text-brand-yellow-100">Painel da Fábrica</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-brand-yellow-100">Bem-vindo,</p>
                <p className="font-medium text-white">{currentUser}</p>
              </div>
              <Button 
                onClick={onLogout} 
                variant="outline" 
                className="border-brand-yellow-400 bg-brand-yellow-400 text-brand-brown-800 hover:bg-brand-yellow-300 hover:text-brand-brown-900 font-semibold"
              >
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-brand-yellow-400 min-h-screen">
        <Tabs defaultValue="producao" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-brand-yellow-300 border border-brand-neutral-300">
            <TabsTrigger value="producao" className="flex items-center gap-2 data-[state=active]:bg-brand-yellow-400 data-[state=active]:text-brand-brown-800">
              🏭 Produção
            </TabsTrigger>
            <TabsTrigger value="rastreabilidade" className="flex items-center gap-2 data-[state=active]:bg-brand-yellow-400 data-[state=active]:text-brand-brown-800">
              🔍 Rastreabilidade
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2 data-[state=active]:bg-brand-yellow-400 data-[state=active]:text-brand-brown-800">
              📊 Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="producao">
            <GerenciamentoProducao />
          </TabsContent>

          <TabsContent value="rastreabilidade">
            <Rastreabilidade />
          </TabsContent>

          <TabsContent value="analytics">
            <DashboardAnalytics />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};
