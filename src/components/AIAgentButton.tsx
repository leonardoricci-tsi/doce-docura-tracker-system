import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Bot, MessageCircle, X } from 'lucide-react';

declare global {
  interface Window {
    CozeWebSDK: {
      WebChatClient: new (config: {
        el: HTMLElement;
        config: { bot_id: string };
        componentProps: { title: string };
        auth: {
          type: string;
          token: string;
          onRefreshToken: () => string;
        };
      }) => any;
    };
  }
}

export const AIAgentButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const chatClientRef = useRef<any>(null);

  useEffect(() => {
    const initializeCoze = async () => {
      if (isOpen && chatContainerRef.current && !chatClientRef.current) {
        // Clear container first
        chatContainerRef.current.innerHTML = '';
        
        try {
          // Wait for SDK to be available
          if (!window.CozeWebSDK) {
            console.error('Coze WebSDK não está disponível');
            return;
          }

          console.log('Inicializando Coze WebSDK...');
          
          chatClientRef.current = new window.CozeWebSDK.WebChatClient({
            el: chatContainerRef.current,
            config: {
              bot_id: '7532925215522029573',
            },
            componentProps: {
              title: 'Assistente IA MaplyRastro',
            },
            auth: {
              type: 'token',
              token: 'pat_iwzBQyblroWu6fIbrGS7OvkLMSBowwzeNSuwTC1EvdUIDAIO1UuFDmViXukjfWFD',
              onRefreshToken: function () {
                return 'pat_iwzBQyblroWu6fIbrGS7OvkLMSBowwzeNSuwTC1EvdUIDAIO1UuFDmViXukjfWFD';
              }
            }
          });
          
          console.log('Coze WebSDK inicializado com sucesso');
        } catch (error) {
          console.error('Erro ao inicializar Coze WebSDK:', error);
          console.log('SDK disponível:', !!window.CozeWebSDK);
          console.log('Container:', chatContainerRef.current);
        }
      }
    };

    if (isOpen) {
      // Small delay to ensure DOM is ready
      setTimeout(initializeCoze, 100);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    if (chatClientRef.current) {
      chatClientRef.current = null;
    }
  };

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
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl max-h-[80vh] bg-brand-AmareloOuro border-brand-brown-800">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="text-brand-brown-800 flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Assistente IA MaplyRastro
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-6 w-6 text-brand-brown-800 hover:bg-brand-brown-800/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          
          {/* Container para o Coze WebSDK */}
          <div 
            ref={chatContainerRef}
            id="coze-chat-container"
            className="w-full h-96 bg-white rounded-lg overflow-hidden"
          />
        </DialogContent>
      </Dialog>
    </>
  );
};