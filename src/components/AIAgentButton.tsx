import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Bot, MessageCircle, X } from 'lucide-react';

export const AIAgentButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-brand-brown-800 hover:bg-brand-brown-700 text-brand-yellow-400 shadow-lg transition-all duration-300 hover:scale-110"
          size="icon"
        >
          <Bot className="h-6 w-6" />
        </Button>
      </div>

      {/* AI Agent Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md max-h-[80vh] bg-brand-AmareloOuro border-brand-brown-800">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="text-brand-brown-800 flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Assistente IA MaplyRastro
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-6 w-6 text-brand-brown-800 hover:bg-brand-brown-800/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          
          <div className="flex flex-col h-96">
            {/* Chat Messages Area */}
            <div className="flex-1 bg-white/50 rounded-lg p-4 mb-4 overflow-y-auto">
              <div className="flex items-center gap-3 text-brand-brown-800">
                <Bot className="h-8 w-8 text-brand-brown-800" />
                <div>
                  <p className="font-medium">Olá! Sou seu assistente IA</p>
                  <p className="text-sm text-brand-brown-600">
                    Como posso ajudá-lo hoje com suas distribuições?
                  </p>
                </div>
              </div>
            </div>
            
            {/* Chat Input */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Digite sua mensagem..."
                className="flex-1 px-3 py-2 border border-brand-brown-300 rounded-md bg-white text-brand-brown-800 placeholder:text-brand-brown-500 focus:outline-none focus:ring-2 focus:ring-brand-brown-800"
              />
              <Button 
                size="icon"
                className="bg-brand-brown-800 hover:bg-brand-brown-700 text-brand-yellow-400"
              >
                <MessageCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};