import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DatabaseQueryResponse {
  success: boolean;
  data?: any;
  error?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { query, action } = await req.json();

    console.log('Chatbot data request:', { query, action });

    let response: DatabaseQueryResponse;

    switch (action) {
      case 'get_all_data':
        response = await getAllOrdersData(supabaseClient);
        break;
      case 'search_orders':
        response = await searchOrders(supabaseClient, query);
        break;
      case 'get_order_details':
        response = await getOrderDetails(supabaseClient, query);
        break;
      default:
        response = await processGeneralQuery(supabaseClient, query);
    }

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in chatbot-data function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: `Erro interno: ${error.message}` 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function getAllOrdersData(supabase: any): Promise<DatabaseQueryResponse> {
  try {
    // Buscar lotes de produção com itens
    const { data: lotes, error: lotesError } = await supabase
      .from('lotes_producao')
      .select(`
        *,
        lote_itens (
          id,
          quantidade_produzida,
          produtos (
            nome,
            tipo,
            sabor
          )
        )
      `)
      .order('data_producao', { ascending: false });

    if (lotesError) throw lotesError;

    // Buscar distribuições
    const { data: distribuicoes, error: distError } = await supabase
      .from('distribuicoes')
      .select(`
        *,
        lotes_producao (
          codigo_lote,
          data_producao,
          lote_itens (
            produtos (
              nome
            )
          )
        ),
        distribuidores (
          nome,
          cnpj,
          endereco
        )
      `)
      .order('data_distribuicao', { ascending: false });

    if (distError) throw distError;

    // Buscar vendas
    const { data: vendas, error: vendasError } = await supabase
      .from('vendas_pdv')
      .select(`
        *,
        distribuicoes (
          lotes_producao (
            codigo_lote
          ),
          distribuidores (
            nome
          )
        ),
        pontos_venda (
          nome,
          endereco,
          tipo
        )
      `)
      .order('data_venda', { ascending: false });

    if (vendasError) throw vendasError;

    // Buscar produtos
    const { data: produtos, error: produtosError } = await supabase
      .from('produtos')
      .select('*')
      .order('nome');

    if (produtosError) throw produtosError;

    // Buscar distribuidores
    const { data: distribuidores, error: distribuidoresError } = await supabase
      .from('distribuidores')
      .select('*')
      .order('nome');

    if (distribuidoresError) throw distribuidoresError;

    return {
      success: true,
      data: {
        lotes_producao: lotes || [],
        distribuicoes: distribuicoes || [],
        vendas_pdv: vendas || [],
        produtos: produtos || [],
        distribuidores: distribuidores || [],
        summary: {
          total_lotes: lotes?.length || 0,
          total_distribuicoes: distribuicoes?.length || 0,
          total_vendas: vendas?.length || 0,
          total_produtos: produtos?.length || 0,
          total_distribuidores: distribuidores?.length || 0
        }
      }
    };
  } catch (error) {
    return {
      success: false,
      error: `Erro ao buscar dados: ${error.message}`
    };
  }
}

async function searchOrders(supabase: any, searchTerm: string): Promise<DatabaseQueryResponse> {
  try {
    // Buscar por código de lote
    const { data: lotesByCode, error: loteError } = await supabase
      .from('lotes_producao')
      .select(`
        *,
        lote_itens (
          id,
          quantidade_produzida,
          produtos (
            nome,
            tipo,
            sabor
          )
        )
      `)
      .ilike('codigo_lote', `%${searchTerm}%`);

    if (loteError) throw loteError;

    // Buscar por nome de produto
    const { data: produtos, error: produtoError } = await supabase
      .from('produtos')
      .select('*')
      .ilike('nome', `%${searchTerm}%`);

    if (produtoError) throw produtoError;

    return {
      success: true,
      data: {
        lotes_encontrados: lotesByCode || [],
        produtos_encontrados: produtos || []
      }
    };
  } catch (error) {
    return {
      success: false,
      error: `Erro na busca: ${error.message}`
    };
  }
}

async function getOrderDetails(supabase: any, loteId: string): Promise<DatabaseQueryResponse> {
  try {
    const { data: lote, error: loteError } = await supabase
      .from('lotes_producao')
      .select(`
        *,
        lote_itens (
          id,
          quantidade_produzida,
          produtos (
            nome,
            tipo,
            sabor
          )
        )
      `)
      .eq('id', loteId)
      .single();

    if (loteError) throw loteError;

    // Buscar distribuições relacionadas
    const { data: distribuicoes, error: distError } = await supabase
      .from('distribuicoes')
      .select(`
        *,
        distribuidores (
          nome,
          cnpj,
          endereco
        )
      `)
      .eq('lote_id', loteId);

    if (distError) throw distError;

    return {
      success: true,
      data: {
        lote,
        distribuicoes: distribuicoes || []
      }
    };
  } catch (error) {
    return {
      success: false,
      error: `Erro ao buscar detalhes: ${error.message}`
    };
  }
}

async function processGeneralQuery(supabase: any, query: string): Promise<DatabaseQueryResponse> {
  // Análise simples da query para determinar que tipo de informação buscar
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('lote') || lowerQuery.includes('produção')) {
    return await getAllOrdersData(supabase);
  } else if (lowerQuery.includes('distribuição') || lowerQuery.includes('distribuidor')) {
    const { data, error } = await supabase
      .from('distribuicoes')
      .select(`
        *,
        lotes_producao (
          codigo_lote,
          data_producao
        ),
        distribuidores (
          nome,
          endereco
        )
      `)
      .order('data_distribuicao', { ascending: false })
      .limit(10);

    return {
      success: !error,
      data: data || [],
      error: error?.message
    };
  } else if (lowerQuery.includes('venda') || lowerQuery.includes('pdv')) {
    const { data, error } = await supabase
      .from('vendas_pdv')
      .select(`
        *,
        pontos_venda (
          nome,
          endereco,
          tipo
        )
      `)
      .order('data_venda', { ascending: false })
      .limit(10);

    return {
      success: !error,
      data: data || [],
      error: error?.message
    };
  } else {
    // Query geral - retornar resumo
    return await getAllOrdersData(supabase);
  }
}