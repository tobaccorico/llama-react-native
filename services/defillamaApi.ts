
import axios, {AxiosInstance} from 'axios';

const BASE_URL = 'https://api.llama.fi';

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response?.data || error.message);
    throw error;
  },
);

// Type definitions for API responses
export interface Chain {
  gecko_id: string;
  tvl: number;
  tokenSymbol: string;
  cmcId: string;
  name: string;
  chainId: number;
  tvlPrevDay?: number;
  tvlPrevWeek?: number;
  tvlPrevMonth?: number;
  protocols?: number;
}

export interface Protocol {
  id: string;
  name: string;
  address: string;
  symbol: string;
  url: string;
  description: string;
  chain: string;
  logo: string;
  audits: string;
  audit_note: string;
  gecko_id: string;
  cmcId: string;
  category: string;
  chains: string[];
  module: string;
  twitter: string;
  forkedFrom: string[];
  oracles: string[];
  listedAt: number;
  slug: string;
  tvl: number;
  chainTvls: Record<string, number>;
  change_1h: number;
  change_1d: number;
  change_7d: number;
  staking?: number;
  fdv?: number;
  mcap?: number;
  treasury?: number;
}

export const defillamaAPI = {
  // TVL endpoints
  getTVL: async () => {
    const response = await apiClient.get('/tvl');
    return response.data;
  },

  getHistoricalTVL: async () => {
    const response = await apiClient.get('/v2/historicalChainTvl');
    return response.data;
  },

  // Protocols endpoints
  getProtocols: async (): Promise<Protocol[]> => {
    const response = await apiClient.get('/protocols');
    return response.data;
  },

  getProtocol: async (slug: string): Promise<Protocol> => {
    const response = await apiClient.get(`/protocol/${slug}`);
    return response.data;
  },

  // Chains endpoints
  getChains: async (): Promise<Chain[]> => {
    const response = await apiClient.get('/v2/chains');
    return response.data;
  },

  getChainTVL: async (chain: string) => {
    const response = await apiClient.get(`/v2/historicalChainTvl/${chain}`);
    return response.data;
  },
};
