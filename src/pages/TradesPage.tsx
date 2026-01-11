import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  Download,
  Upload,
  Edit2,
  Trash2,
  Filter,
  TrendingUp,
  TrendingDown,
  DollarSign,
} from "lucide-react";
import { motion } from "framer-motion";
import AddTradeModal from "@/components/AddTradeModal";
import EditTradeModal from "@/components/EditTradeModal";

const TradesPage = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTrade, setEditingTrade] = useState<any>(null);
  const [filterTag, setFilterTag] = useState("");
  const [filterPlatform, setFilterPlatform] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const queryClient = useQueryClient();

  // Fetch trades
  const { data: tradesData, isLoading } = useQuery({
    queryKey: ['trades', filterTag, filterPlatform, filterStatus],
    queryFn: () => api.getTrades({
      limit: 100,
      ...(filterTag && { tag: filterTag }),
      ...(filterPlatform && { platform: filterPlatform }),
      ...(filterStatus && { status: filterStatus }),
      sortBy: 'tradeDate',
      sortOrder: 'desc',
    }),
  });

  // Fetch analytics
  const { data: analytics } = useQuery({
    queryKey: ['trade-analytics'],
    queryFn: () => api.getTradeAnalytics(),
  });

  // Delete trade mutation
  const deleteTradeMutation = useMutation({
    mutationFn: (id: string) => api.deleteTrade(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trades'] });
      queryClient.invalidateQueries({ queryKey: ['trade-analytics'] });
    },
  });

  // Export trades
  const handleExport = async () => {
    try {
      const blob = await api.exportTrades();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `trades-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      alert('Failed to export trades');
    }
  };

  const trades = tradesData?.trades || [];

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">My Trades</h1>
          <p className="text-sm text-muted-foreground mt-1">Track and manage your FUT trading history</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="hero" onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Trade
          </Button>
        </div>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-card border border-border rounded-xl p-4"
          >
            <div className="flex items-center gap-2 text-success mb-2">
              <DollarSign className="w-4 h-4" />
              <p className="text-xs font-medium uppercase tracking-wider">Total Profit</p>
            </div>
            <p className="font-display text-2xl font-bold text-success">
              {analytics.totalProfit >= 0 ? '+' : ''}{analytics.totalProfit.toLocaleString()}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-card border border-border rounded-xl p-4"
          >
            <div className="flex items-center gap-2 text-primary mb-2">
              <TrendingUp className="w-4 h-4" />
              <p className="text-xs font-medium uppercase tracking-wider">Win Rate</p>
            </div>
            <p className="font-display text-2xl font-bold text-foreground">{analytics.winRate}%</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-card border border-border rounded-xl p-4"
          >
            <div className="flex items-center gap-2 text-accent mb-2">
              <TrendingUp className="w-4 h-4" />
              <p className="text-xs font-medium uppercase tracking-wider">Avg ROI</p>
            </div>
            <p className="font-display text-2xl font-bold text-foreground">{analytics.avgROI}%</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-card border border-border rounded-xl p-4"
          >
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <TrendingDown className="w-4 h-4" />
              <p className="text-xs font-medium uppercase tracking-wider">Total Trades</p>
            </div>
            <p className="font-display text-2xl font-bold text-foreground">{analytics.totalTrades}</p>
          </motion.div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <select
          value={filterTag}
          onChange={(e) => setFilterTag(e.target.value)}
          className="px-3 py-2 bg-secondary/50 border border-border rounded-lg text-sm text-foreground"
        >
          <option value="">All Tags</option>
          <option value="Snipe">Snipe</option>
          <option value="Investment">Investment</option>
          <option value="Flip">Flip</option>
          <option value="SBC">SBC</option>
          <option value="Pack Pull">Pack Pull</option>
        </select>

        <select
          value={filterPlatform}
          onChange={(e) => setFilterPlatform(e.target.value)}
          className="px-3 py-2 bg-secondary/50 border border-border rounded-lg text-sm text-foreground"
        >
          <option value="">All Platforms</option>
          <option value="PS">PlayStation</option>
          <option value="XBOX">Xbox</option>
          <option value="PC">PC</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 bg-secondary/50 border border-border rounded-lg text-sm text-foreground"
        >
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="CLOSED">Closed</option>
        </select>

        {(filterTag || filterPlatform || filterStatus) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setFilterTag('');
              setFilterPlatform('');
              setFilterStatus('');
            }}
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Trades Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/30 border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Player</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Buy</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Sell</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Profit</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">ROI</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Tag</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-4 py-3" colSpan={8}>
                      <Skeleton className="h-10 w-full" />
                    </td>
                  </tr>
                ))
              ) : trades.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center">
                    <p className="text-muted-foreground">No trades found</p>
                    <Button variant="ghost" className="mt-2" onClick={() => setShowAddModal(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add your first trade
                    </Button>
                  </td>
                </tr>
              ) : (
                trades.map((trade: any) => (
                  <tr key={trade.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-foreground">{trade.playerName}</p>
                        {trade.rating && (
                          <p className="text-xs text-muted-foreground">{trade.rating} {trade.cardVersion}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-foreground">{trade.buyPrice.toLocaleString()}</td>
                    <td className="px-4 py-3 text-foreground">
                      {trade.sellPrice ? trade.sellPrice.toLocaleString() : '-'}
                    </td>
                    <td className="px-4 py-3">
                      {trade.profit !== null ? (
                        <span className={trade.profit >= 0 ? 'text-success' : 'text-destructive'}>
                          {trade.profit >= 0 ? '+' : ''}{trade.profit.toLocaleString()}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {trade.roi !== null ? (
                        <span className={trade.roi >= 0 ? 'text-success' : 'text-destructive'}>
                          {trade.roi >= 0 ? '+' : ''}{trade.roi}%
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {trade.tag && (
                        <span className="px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">
                          {trade.tag}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                        trade.status === 'ACTIVE'
                          ? 'bg-accent/10 text-accent'
                          : 'bg-success/10 text-success'
                      }`}>
                        {trade.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingTrade(trade)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this trade?')) {
                              deleteTradeMutation.mutate(trade.id);
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <AddTradeModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />

      {editingTrade && (
        <EditTradeModal
          isOpen={!!editingTrade}
          onClose={() => setEditingTrade(null)}
          trade={editingTrade}
        />
      )}
    </div>
  );
};

export default TradesPage;
