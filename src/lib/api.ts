// API Client for Transfer Traders Platform

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class ApiClient {
  private getHeaders(): HeadersInit {
    const token = localStorage.getItem('auth_token');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_URL}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(error.error || `HTTP ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth
  async register(data: { email: string; username: string; password: string }) {
    return this.request<{ token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: { email: string; password: string }) {
    return this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMe() {
    return this.request<any>('/auth/me');
  }

  // Traders
  async getTraders(params?: { specialty?: string; featured?: boolean; search?: string }) {
    const query = new URLSearchParams();
    if (params?.specialty) query.append('specialty', params.specialty);
    if (params?.featured) query.append('featured', 'true');
    if (params?.search) query.append('search', params.search);

    return this.request<any[]>(`/traders?${query.toString()}`);
  }

  async getTrader(id: string) {
    return this.request<any>(`/traders/${id}`);
  }

  async subscribeToTrader(id: string, tier: 'MONTHLY' | 'YEARLY' = 'MONTHLY') {
    return this.request<any>(`/traders/${id}/subscribe`, {
      method: 'POST',
      body: JSON.stringify({ tier }),
    });
  }

  async unsubscribeFromTrader(id: string) {
    return this.request<any>(`/traders/${id}/subscribe`, {
      method: 'DELETE',
    });
  }

  async getTraderPosts(id: string, limit = 10, offset = 0) {
    return this.request<any[]>(`/traders/${id}/posts?limit=${limit}&offset=${offset}`);
  }

  // Posts
  async getFeed(params?: { limit?: number; offset?: number; type?: string }) {
    const query = new URLSearchParams();
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.offset) query.append('offset', params.offset.toString());
    if (params?.type) query.append('type', params.type);

    return this.request<any[]>(`/posts/feed?${query.toString()}`);
  }

  async getPost(id: string) {
    return this.request<any>(`/posts/${id}`);
  }

  async createPost(data: any) {
    return this.request<any>('/posts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async likePost(id: string) {
    return this.request<{ liked: boolean }>(`/posts/${id}/like`, {
      method: 'POST',
    });
  }

  async getComments(postId: string) {
    return this.request<any[]>(`/posts/${postId}/comments`);
  }

  async createComment(postId: string, content: string, parentId?: string) {
    return this.request<any>(`/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content, parentId }),
    });
  }

  // Portfolio
  async getPortfolio(status?: string) {
    const query = status ? `?status=${status}` : '';
    return this.request<{ portfolio: any[]; stats: any }>(`/portfolio${query}`);
  }

  async addToPortfolio(data: { cardId: string; quantity: number; buyPrice: number }) {
    return this.request<any>('/portfolio', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePortfolioItem(id: string, data: any) {
    return this.request<any>(`/portfolio/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deletePortfolioItem(id: string) {
    return this.request<any>(`/portfolio/${id}`, {
      method: 'DELETE',
    });
  }

  // Notifications
  async getNotifications(unreadOnly = false, limit = 20) {
    return this.request<{ notifications: any[]; unreadCount: number }>(
      `/notifications?unreadOnly=${unreadOnly}&limit=${limit}`
    );
  }

  async markNotificationRead(id: string) {
    return this.request<any>(`/notifications/${id}/read`, {
      method: 'PATCH',
    });
  }

  async markNotificationAsRead(id: string) {
    return this.markNotificationRead(id);
  }

  async markAllNotificationsRead() {
    return this.request<any>('/notifications/read-all', {
      method: 'POST',
    });
  }

  async deleteNotification(id: string) {
    return this.request<any>(`/notifications/${id}`, {
      method: 'DELETE',
    });
  }

  // Cards
  async searchCards(query: string, platform = 'PS', limit = 20) {
    return this.request<any[]>(`/cards/search?q=${query}&platform=${platform}&limit=${limit}`);
  }

  async getTrendingCards(platform = 'PS', limit = 10) {
    return this.request<any[]>(`/cards/trending?platform=${platform}&limit=${limit}`);
  }

  async getCard(id: string) {
    return this.request<any>(`/cards/${id}`);
  }

  async getCardHistory(id: string) {
    return this.request<any>(`/cards/${id}/history`);
  }

  // Trending & Market Data
  async getTrendingCardsV2(params?: { timeframe?: '6h' | '12h' | '24h'; limit?: number; direction?: 'rising' | 'falling' | 'all' }) {
    const query = new URLSearchParams();
    if (params?.timeframe) query.append('timeframe', params.timeframe);
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.direction) query.append('direction', params.direction);
    return this.request<{ timeframe: string; cards: any[]; count: number; cachedAt: string }>(
      `/trending/cards?${query.toString()}`
    );
  }

  async getMarketSummary(params?: { timeframe?: '6h' | '12h' | '24h'; riseThreshold?: number; fallThreshold?: number }) {
    const query = new URLSearchParams();
    if (params?.timeframe) query.append('timeframe', params.timeframe);
    if (params?.riseThreshold) query.append('riseThreshold', params.riseThreshold.toString());
    if (params?.fallThreshold) query.append('fallThreshold', params.fallThreshold.toString());
    return this.request<{
      timeframe: string;
      total: number;
      trending: number;
      falling: number;
      stable: number;
      thresholds: { rise: number; fall: number };
      cachedAt: string;
    }>(`/trending/summary?${query.toString()}`);
  }

  async getMarketMovers(limit = 10) {
    return this.request<{
      gainers: any[];
      losers: any[];
      cachedAt: string;
    }>(`/trending/movers?limit=${limit}`);
  }

  // Stories
  async getStories() {
    return this.request<any[]>('/stories');
  }

  async viewStory(id: string) {
    return this.request<any>(`/stories/${id}/view`, {
      method: 'POST',
    });
  }

  // Price Alerts
  async getPriceAlerts() {
    return this.request<any[]>('/cards/price-alerts');
  }

  async createPriceAlert(data: { cardId: string; targetPrice: number; alertType: 'PRICE_DROP' | 'PRICE_RISE' }) {
    return this.request<any>('/cards/price-alerts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deletePriceAlert(id: string) {
    return this.request<any>(`/cards/price-alerts/${id}`, {
      method: 'DELETE',
    });
  }

  // Health check
  async healthCheck() {
    return this.request<{ status: string }>('/health');
  }
}

export const api = new ApiClient();
