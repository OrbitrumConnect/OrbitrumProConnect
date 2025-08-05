// Configuração específica para o Vercel
export const VERCEL_ENV = {
  // Verificar se estamos no Vercel
  IS_VERCEL: import.meta.env.VITE_VERCEL === '1' || import.meta.env.VERCEL === '1',
  
  // Verificar se estamos em produção
  IS_PRODUCTION: import.meta.env.PROD === true || import.meta.env.NODE_ENV === 'production',
  
  // API URL para produção
  API_URL: import.meta.env.VITE_API_URL || 'https://orbitrum-connect-production.up.railway.app',
  
  // Configuração de dados
  DATA_CONFIG: {
    // Sempre usar dados reais (R$ 50,00)
    USE_REAL_DATA: true,
    // Fonte de dados
    SOURCE: 'real_users',
    // Receita total real
    TOTAL_REVENUE: 50.00
  }
};

// Log para debug no Vercel
if (VERCEL_ENV.IS_VERCEL) {
  console.log('🚀 Vercel Environment:', {
    isVercel: VERCEL_ENV.IS_VERCEL,
    isProduction: VERCEL_ENV.IS_PRODUCTION,
    apiUrl: VERCEL_ENV.API_URL,
    useRealData: VERCEL_ENV.DATA_CONFIG.USE_REAL_DATA,
    totalRevenue: VERCEL_ENV.DATA_CONFIG.TOTAL_REVENUE
  });
}

// Função para verificar se deve usar dados reais
export const shouldUseRealData = (): boolean => {
  return VERCEL_ENV.DATA_CONFIG.USE_REAL_DATA;
};

// Função para obter API URL
export const getApiUrl = (): string => {
  return VERCEL_ENV.API_URL;
}; 