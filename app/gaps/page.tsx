'use client';

import { useState, useCallback, useMemo } from 'react';
import { TopBar } from '../components/TopBar';
import { Sidebar } from '../components/Sidebar';
import { NotificationsPanel } from '../components/NotificationsPanel';
import { MetricCard } from '../components/MetricCard';
import { UntappedPotentialTable } from '../components/UntappedPotentialTable';
import { useAuth } from '../context/AuthContext';
import { LAYOUT_SPACING } from '../design-tokens';

// Filter-based multiplier for realistic variations
const getFilterMultiplier = (filters: { region: string; timeFrame: string; material: string }) => {
  let multiplier = 1;

  const regionMultipliers: Record<string, number> = {
    'All Regions': 1,
    'Southeast': 0.25,
    'Midwest': 0.20,
    'West Coast': 0.18,
    'Southwest': 0.17,
    'Northeast': 0.12,
    'Mountain': 0.08,
  };

  const timeMultipliers: Record<string, number> = {
    'Next 3 Months': 0.25,
    'Next 6 Months': 0.5,
    'Next Year': 1,
    'Last 3 Months': 0.25,
    'Last 6 Months': 0.5,
  };

  multiplier *= regionMultipliers[filters.region] || 1;
  multiplier *= timeMultipliers[filters.timeFrame] || 1;

  return multiplier;
};

export default function GapsPage() {
  const [isNotificationsPanelOpen, setIsNotificationsPanelOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentFilters, setCurrentFilters] = useState({
    region: 'All Regions',
    timeFrame: 'Next 3 Months',
    material: 'All Materials'
  });
  const { logout } = useAuth();

  // Handle filter changes
  const handleFilterChange = useCallback((filters: { region: string; timeFrame: string; material: string }) => {
    setIsRefreshing(true);
    setTimeout(() => {
      setCurrentFilters(filters);
      setRefreshKey(prev => prev + 1);
      setIsRefreshing(false);
    }, 300);
  }, []);

  // Calculate dynamic metrics based on filters
  const dynamicMetrics = useMemo(() => {
    const mult = getFilterMultiplier(currentFilters);
    const baseMissedSavings = 52200;
    const baseOpportunities = 528;
    const baseJustificationRate = 68;
    const baseResponseTime = 2.4;

    return {
      missedSavings: Math.round(baseMissedSavings * mult),
      opportunities: Math.round(baseOpportunities * mult),
      justificationRate: Math.min(95, Math.max(50, baseJustificationRate + (Math.random() - 0.5) * 10)).toFixed(0),
      responseTime: (baseResponseTime + (Math.random() - 0.5) * 0.5).toFixed(1),
    };
  }, [currentFilters, refreshKey]);

  return (
    <div className="min-h-screen relative bg-[#E8F3FF]">
      {/* Grid Background */}
      <div
        className="fixed inset-0 z-0 opacity-40"
        style={{
          backgroundImage: 'url(/Grid.svg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Main Layout */}
      <div className="relative z-10 flex h-screen overflow-hidden">
        {/* Sidebar - Sticky */}
        <div className="h-screen sticky top-0 z-30" style={{ padding: LAYOUT_SPACING.pageEdge }}>
          <Sidebar
            mode="executive"
            variant="expanded"
            activeItem="gaps"
            onNotificationsClick={() => setIsNotificationsPanelOpen(true)}
            onLogout={logout}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          {/* Content Wrapper with shared padding */}
          <div
            className="flex-1 flex flex-col min-w-0 overflow-y-auto"
            style={{
              paddingLeft: LAYOUT_SPACING.contentEdge,
              paddingRight: LAYOUT_SPACING.pageEdge,
              paddingTop: LAYOUT_SPACING.pageEdge,
              paddingBottom: LAYOUT_SPACING.pageEdge,
            }}
          >
            {/* Top Nav - Sticky with glass effect */}
            <div className="sticky top-0 z-20" style={{ marginBottom: LAYOUT_SPACING.contentTopGap }}>
              <TopBar
                title="Untapped Potential"
                subtitle="Track optimization opportunities and understand manager decision-making with comprehensive reason analysis"
                onFilterChange={handleFilterChange}
              />
            </div>

            {/* Page Content */}
            <div className={`flex flex-col gap-[24px] transition-opacity duration-200 ${isRefreshing ? 'opacity-50' : 'opacity-100'}`} key={refreshKey} style={{ overflowX: 'hidden' }}>
              {/* Metric Cards Section */}
              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  width: '100%',
                }}
              >
                <MetricCard
                  icon="dollar"
                  title="Total Missed Savings"
                  value={`$${dynamicMetrics.missedSavings.toLocaleString()}`}
                  trend={{
                    direction: 'up',
                    percentage: '+12%',
                    label: 'vs last month',
                  }}
                  comparison={{
                    preNuel: `$${Math.round(dynamicMetrics.missedSavings * 0.89).toLocaleString()}`,
                    postNuel: `$${dynamicMetrics.missedSavings.toLocaleString()}`,
                  }}
                />
                <MetricCard
                  icon="target"
                  title="Opportunities Tracked"
                  value={dynamicMetrics.opportunities.toString()}
                  trend={{
                    direction: 'down',
                    percentage: '-8%',
                    label: 'vs last month',
                  }}
                  comparison={{
                    preNuel: Math.round(dynamicMetrics.opportunities * 1.09).toString(),
                    postNuel: dynamicMetrics.opportunities.toString(),
                  }}
                />
                <MetricCard
                  icon="trending-down"
                  title="Justification Rate"
                  value={`${dynamicMetrics.justificationRate}%`}
                  trend={{
                    direction: 'up',
                    percentage: '+5%',
                    label: 'vs last month',
                  }}
                  comparison={{
                    preNuel: `${parseInt(dynamicMetrics.justificationRate) - 5}%`,
                    postNuel: `${dynamicMetrics.justificationRate}%`,
                  }}
                />
                <MetricCard
                  icon="package"
                  title="Avg Response Time"
                  value={`${dynamicMetrics.responseTime} days`}
                  trend={{
                    direction: 'up',
                    percentage: '+0.3 days',
                    label: 'vs last month',
                  }}
                  comparison={{
                    preNuel: `${(parseFloat(dynamicMetrics.responseTime) - 0.3).toFixed(1)} days`,
                    postNuel: `${dynamicMetrics.responseTime} days`,
                  }}
                />
              </div>

              {/* Untapped Potential Table Section */}
              <UntappedPotentialTable filters={currentFilters} />
            </div>
          </div>
        </div>
      </div>

      {/* Notifications Panel */}
      <NotificationsPanel
        isOpen={isNotificationsPanelOpen}
        onClose={() => setIsNotificationsPanelOpen(false)}
      />
    </div>
  );
}
