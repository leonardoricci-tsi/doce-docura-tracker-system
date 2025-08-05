import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Bot, MessageCircle, X, Send } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export const AIAgentButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Olá! Sou o assistente IA do MaplyRastro. Como posso ajudá-lo hoje?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Chamar edge function para buscar dados e gerar resposta
      const { data, error } = await supabase.functions.invoke('chatbot-data', {
        body: {
          query: userMessage.content,
          action: determineAction(userMessage.content)
        }
      });

      if (error) throw error;

      let responseContent = '';

      if (data.success) {
        responseContent = generateResponse(userMessage.content, data.data);
      } else {
        responseContent = `Desculpe, ocorreu um erro ao buscar os dados: ${data.error}`;
      }

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: responseContent,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
      setTimeout(scrollToBottom, 100);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Desculpe, ocorreu um erro ao processar sua solicitação. Tente novamente.',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
      setIsLoading(false);
    }
  };

  const determineAction = (message: string): string => {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('todos') && (lowerMessage.includes('pedido') || lowerMessage.includes('lote'))) {
      return 'get_all_data';
    } else if (lowerMessage.includes('buscar') || lowerMessage.includes('procurar')) {
      return 'search_orders';
    } else if (lowerMessage.includes('detalhe') || lowerMessage.includes('detalhes')) {
      return 'get_order_details';
    } else {
      return 'general_query';
    }
  };

  const generateResponse = (query: string, data: any): string => {
    const lowerQuery = query.toLowerCase();

    if (data.summary) {
      // Resposta para dados gerais
      return `📊 **Resumo do Sistema MaplyRastro:**

🏭 **Lotes de Produção:** ${data.summary.total_lotes}
📦 **Distribuições:** ${data.summary.total_distribuicoes}
💰 **Vendas:** ${data.summary.total_vendas}
🍯 **Produtos:** ${data.summary.total_produtos}
🚚 **Distribuidores:** ${data.summary.total_distribuidores}

${data.lotes_producao.length > 0 ? `\n**Últimos Lotes:**\n${data.lotes_producao.slice(0, 3).map((lote: any) =>
        `• ${lote.codigo_lote} - ${new Date(lote.data_producao).toLocaleDateString('pt-BR')} (${lote.lote_itens?.length || 0} itens)`
      ).join('\n')}` : ''}

Como posso ajudá-lo com mais informações específicas?`;
    }

    if (data.lotes_encontrados || data.produtos_encontrados) {
      // Resposta para busca
      let response = '🔍 **Resultados da busca:**\n\n';

      if (data.lotes_encontrados?.length > 0) {
        response += `**Lotes encontrados:**\n${data.lotes_encontrados.map((lote: any) =>
          `• ${lote.codigo_lote} - ${new Date(lote.data_producao).toLocaleDateString('pt-BR')}`
        ).join('\n')}\n\n`;
      }

      if (data.produtos_encontrados?.length > 0) {
        response += `**Produtos encontrados:**\n${data.produtos_encontrados.map((produto: any) =>
          `• ${produto.nome} (${produto.tipo}${produto.sabor ? ` - ${produto.sabor}` : ''})`
        ).join('\n')}`;
      }

      if (data.lotes_encontrados?.length === 0 && data.produtos_encontrados?.length === 0) {
        response = 'Não encontrei resultados para sua busca. Tente usar outros termos.';
      }

      return response;
    }

    if (data.lote) {
      // Resposta para detalhes de lote
      const lote = data.lote;
      return `📋 **Detalhes do Lote ${lote.codigo_lote}:**

📅 **Data de Produção:** ${new Date(lote.data_producao).toLocaleDateString('pt-BR')}
⏰ **Data de Validade:** ${new Date(lote.data_validade).toLocaleDateString('pt-BR')}
👤 **Responsável:** ${lote.responsavel}
📊 **Status:** ${lote.status}

**Produtos no Lote:**
${lote.lote_itens?.map((item: any) =>
        `• ${item.produtos.nome} - ${item.quantidade_produzida} unidades`
      ).join('\n') || 'Nenhum item encontrado'}

${data.distribuicoes?.length > 0 ? `\n**Distribuições:**\n${data.distribuicoes.map((dist: any) =>
        `• ${dist.distribuidores.nome} - ${dist.quantidade_distribuida} unidades (${new Date(dist.data_distribuicao).toLocaleDateString('pt-BR')})`
      ).join('\n')}` : ''}`;
    }

    if (Array.isArray(data)) {
      // Resposta para listas
      if (lowerQuery.includes('distribuição')) {
        return `📦 **Distribuições Recentes:**\n\n${data.slice(0, 5).map((dist: any) =>
          `• ${dist.distribuidores?.nome || 'N/A'} - ${dist.quantidade_distribuida} unidades\n  📅 ${new Date(dist.data_distribuicao).toLocaleDateString('pt-BR')}`
        ).join('\n\n')}`;
      } else if (lowerQuery.includes('venda')) {
        return `💰 **Vendas Recentes:**\n\n${data.slice(0, 5).map((venda: any) =>
          `• ${venda.pontos_venda?.nome || 'N/A'} - ${venda.quantidade_vendida} unidades\n  📅 ${new Date(venda.data_venda).toLocaleDateString('pt-BR')}${venda.preco_venda ? `\n  💵 R$ ${Number(venda.preco_venda).toFixed(2)}` : ''}`
        ).join('\n\n')}`;
      }
    }

    return 'Dados encontrados! Como posso ajudá-lo a interpretar essas informações?';
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleClose = () => {
    setIsOpen(false);
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

      {/* AI Agent Chat Modal */}
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent
          className="max-w-md max-h-[600px] bg-white border-brand-brown-800 p-0 overflow-hidden [&_button[data-radix-dialog-close]]:hidden"
        >
          <DialogHeader className="flex flex-row items-center justify-between p-4 border-b border-brand-brown-200 bg-brand-AmareloOuro">
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

            </Button>
          </DialogHeader>

        {/* Chat Messages */}
        <ScrollArea className="flex-1 h-96 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${message.isUser
                      ? 'bg-brand-brown-800 text-white'
                      : 'bg-brand-AmareloOuro text-brand-brown-800 border border-brand-brown-200'
                    }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-brand-AmareloOuro text-brand-brown-800 border border-brand-brown-200 rounded-lg p-3 max-w-[80%]">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-brand-brown-800 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-brand-brown-800 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-brand-brown-800 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 border-t border-brand-brown-200 bg-white">
          <div className="flex space-x-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua mensagem..."
              className="flex-1 border-brand-brown-300 focus:border-brand-brown-800"
              disabled={isLoading}
            />
            <Button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="bg-brand-brown-800 hover:bg-brand-brown-700 text-white"
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog >
    </>
  );
};