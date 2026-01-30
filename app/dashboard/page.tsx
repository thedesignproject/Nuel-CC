'use client';

import { useState, useCallback, useMemo } from 'react';
import { TopBar } from '../components/TopBar';
import { Sidebar } from '../components/Sidebar';
import { NotificationsPanel } from '../components/NotificationsPanel';
import { useAuth } from '../context/AuthContext';
import { ActivityAlertWidget } from '../components/ActivityAlertWidget';
import { MetricCard } from '../components/MetricCard';
import { KPICard } from '../components/KPICard';
import { RegionalPerformanceHeader } from '../components/RegionalPerformanceHeader';
import { PerformanceCard } from '../components/PerformanceCard';
import { SectionHeader } from '../components/SectionHeader';
import { CostTrendChart } from '../components/CostTrendChart';
import { ExternalFactorsList } from '../components/ExternalFactorsList';
import { OptimizationRejectionsChart } from '../components/OptimizationRejectionsChart';
import { FadeInSection } from '../components/FadeInSection';
import { RegionalPerformanceTable } from '../components/RegionalPerformanceTable';
import { LAYOUT_SPACING } from '../design-tokens';

// Filter-based data multipliers for realistic variations
const getFilterMultiplier = (filters: { region: string; timeFrame: string; material: string }) => {
  let multiplier = 1;

  // Region multipliers
  const regionMultipliers: Record<string, number> = {
    'All Regions': 1,
    'Southeast': 0.28,
    'Midwest': 0.22,
    'West Coast': 0.19,
    'Southwest': 0.15,
    'Northeast': 0.12,
    'Mountain': 0.04,
  };

  // Time frame multipliers
  const timeMultipliers: Record<string, number> = {
    'Next 3 Months': 0.25,
    'Next 6 Months': 0.5,
    'Next Year': 1,
    'Last 3 Months': 0.25,
    'Last 6 Months': 0.5,
  };

  // Material multipliers
  const materialMultipliers: Record<string, number> = {
    'All Materials': 1,
    'Raw Material A': 0.35,
    'Raw Material B': 0.18,
    'Component C': 0.12,
    'Component D': 0.15,
    'Additive E': 0.08,
    'Additive F': 0.12,
  };

  multiplier *= regionMultipliers[filters.region] || 1;
  multiplier *= timeMultipliers[filters.timeFrame] || 1;
  multiplier *= materialMultipliers[filters.material] || 1;

  return multiplier;
};

export default function DashboardPage() {
  const [activeView, setActiveView] = useState(0); // 0 = Grid View, 1 = Table View
  const [isNotificationsPanelOpen, setIsNotificationsPanelOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentFilters, setCurrentFilters] = useState({
    region: 'All Regions',
    timeFrame: 'Next 3 Months',
    material: 'All Materials'
  });
  const { logout } = useAuth();

  // Handle filter changes - creates visual refresh effect and updates data
  const handleFilterChange = useCallback((filters: { region: string; timeFrame: string; material: string }) => {
    setIsRefreshing(true);
    // Brief loading state for visual feedback
    setTimeout(() => {
      setCurrentFilters(filters);
      setRefreshKey(prev => prev + 1);
      setIsRefreshing(false);
    }, 300);
  }, []);

  // Calculate dynamic metrics based on filters
  const dynamicMetrics = useMemo(() => {
    const mult = getFilterMultiplier(currentFilters);
    const baseSavings = 985000;
    const baseShipments = 3648;
    const baseCostPerShipment = 5420;

    return {
      annualSavings: Math.round(baseSavings * mult),
      shipments: Math.round(baseShipments * mult),
      costPerShipment: Math.round(baseCostPerShipment * (0.9 + Math.random() * 0.2)),
      onTimeDelivery: (88 + Math.random() * 6).toFixed(1),
    };
  }, [currentFilters, refreshKey]);

  // Dynamic regional data based on filters
  const dynamicRegionalData = useMemo(() => {
    const isRegionFilter = currentFilters.region !== 'All Regions';
    const mult = getFilterMultiplier(currentFilters);

    const baseData = [
      { region: 'Southeast', volume: 1245, savings: 385000, rate: 93.2, status: 'excellent' as const },
      { region: 'Midwest', volume: 980, savings: 295000, rate: 91.8, status: 'excellent' as const },
      { region: 'West Coast', volume: 865, savings: 248000, rate: 89.5, status: 'good' as const },
      { region: 'Southwest', volume: 558, savings: 157000, rate: 85.6, status: 'warning' as const },
    ];

    // If filtering by specific region, only show that region
    const filteredData = isRegionFilter
      ? baseData.filter(d => d.region === currentFilters.region)
      : baseData;

    return filteredData.map(d => ({
      ...d,
      volume: Math.round(d.volume * (currentFilters.region === 'All Regions' ? 1 : 1) * (currentFilters.timeFrame === 'Next Year' ? 4 : currentFilters.timeFrame.includes('6') ? 2 : 1)),
      savings: Math.round(d.savings * mult * 4),
    }));
  }, [currentFilters, refreshKey]);

  // Dynamic Optimization Rejections data based on filters
  const dynamicRejectionsData = useMemo(() => {
    const mult = getFilterMultiplier(currentFilters);
    const baseTotalRejections = 41;
    const baseRejectedValueK = 635;

    return {
      totalRejections: Math.round(baseTotalRejections * mult),
      rejectedValueK: Math.round(baseRejectedValueK * mult),
      dataMultiplier: mult,
    };
  }, [currentFilters, refreshKey]);

  // Dynamic KPI data based on filters
  const dynamicKPIData = useMemo(() => {
    const mult = getFilterMultiplier(currentFilters);
    const baseETAAccuracy = 91.2;
    const baseCapacityUtilization = 87.5;
    const basePeakReadiness = 92.8;
    const baseActiveAlerts = 10;

    // Add small variations based on filters
    const variation = (Math.random() - 0.5) * 2;

    return {
      etaAccuracy: Math.min(99, Math.max(75, baseETAAccuracy + variation)).toFixed(1),
      capacityUtilization: Math.min(99, Math.max(70, baseCapacityUtilization + variation)).toFixed(1),
      peakReadiness: Math.min(99, Math.max(75, basePeakReadiness + variation)).toFixed(1),
      activeAlerts: Math.max(1, Math.round(baseActiveAlerts * mult)),
      criticalAlerts: Math.max(1, Math.round(3 * mult)),
      warningAlerts: Math.max(1, Math.round(7 * mult)),
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
            activeItem="dashboard"
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
                title="Overview Dashboard"
                subtitle="Company-wide performance metrics and supply chain optimization impact"
                onFilterChange={handleFilterChange}
              />
            </div>

            {/* Dashboard Content */}
            <div className={`flex flex-col gap-[24px] transition-opacity duration-200 ${isRefreshing ? 'opacity-50' : 'opacity-100'}`} key={refreshKey}>
            {/* Active Alerts Section */}
            <FadeInSection delay={0}>
              <ActivityAlertWidget />
            </FadeInSection>

            {/* Metric Cards Section */}
            <FadeInSection delay={50}>
              <div className="grid grid-cols-4 gap-[12px] w-full">
              <MetricCard
                icon="dollar"
                title="Annual Cost Savings"
                value={`$${dynamicMetrics.annualSavings.toLocaleString()}`}
                trend={{
                  direction: 'up',
                  percentage: '+12.4%',
                  label: 'vs. previous year',
                }}
                comparison={{
                  preNuel: `$${Math.round(dynamicMetrics.annualSavings * 0.73).toLocaleString()}`,
                  postNuel: `$${dynamicMetrics.annualSavings.toLocaleString()}`,
                }}
              />
              <MetricCard
                icon="trending-down"
                title="Avg Cost per Shipment"
                value={`$${dynamicMetrics.costPerShipment.toLocaleString()}`}
                trend={{
                  direction: 'down',
                  percentage: '-8.2%',
                  label: 'improvement',
                }}
                comparison={{
                  preNuel: `$${Math.round(dynamicMetrics.costPerShipment * 1.09).toLocaleString()}`,
                  postNuel: `$${dynamicMetrics.costPerShipment.toLocaleString()}`,
                }}
              />
              <MetricCard
                icon="package"
                title="Annual Shipments"
                value={dynamicMetrics.shipments.toLocaleString()}
                trend={{
                  direction: 'up',
                  percentage: '+6.8%',
                  label: 'vs. previous year',
                }}
                comparison={{
                  preNuel: Math.round(dynamicMetrics.shipments * 0.94).toLocaleString(),
                  postNuel: dynamicMetrics.shipments.toLocaleString(),
                }}
              />
              <MetricCard
                icon="target"
                title="On-Time Delivery"
                value={`${dynamicMetrics.onTimeDelivery}%`}
                trend={{
                  direction: 'up',
                  percentage: '+3.1%',
                  label: 'vs. previous year',
                }}
                comparison={{
                  preNuel: `${(parseFloat(dynamicMetrics.onTimeDelivery) - 2.7).toFixed(1)}%`,
                  postNuel: `${dynamicMetrics.onTimeDelivery}%`,
                }}
              />
              </div>
            </FadeInSection>

            {/* Regional Performance Section */}
            <FadeInSection delay={100}>
              <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '24px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                width: '100%',
              }}
            >
              {/* Section Header with Tabs */}
              <RegionalPerformanceHeader
                activeView={activeView}
                onViewChange={setActiveView}
              />

              {/* Performance Cards Grid (only show in Grid View) */}
              {activeView === 0 && (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: dynamicRegionalData.length === 1 ? '1fr' : 'repeat(2, 1fr)',
                    gap: '11.5px',
                    width: '100%',
                  }}
                >
                  {dynamicRegionalData.map((data) => (
                    <PerformanceCard
                      key={data.region}
                      region={data.region}
                      directionIcon={data.status === 'excellent' ? 'up-right' : data.status === 'good' ? 'down-right' : 'down-left'}
                      alerts={data.status === 'excellent' ? 2 : data.status === 'good' ? 3 : 4}
                      status={data.status}
                      executionRate={`${data.rate}%`}
                      volume={`${data.volume.toLocaleString()} Shipments`}
                      savings={`$${Math.round(data.savings / 1000)}K`}
                      untappedPotential={`$${Math.round((data.savings * 0.11) / 1000)}K`}
                      facilities={data.region === 'Southeast' ? 7 : data.region === 'Midwest' ? 5 : data.region === 'West Coast' ? 6 : 5}
                      plants={data.region === 'Southeast' ? 5 : data.region === 'Midwest' ? 4 : data.region === 'West Coast' ? 5 : 3}
                      terminals={data.region === 'Southeast' ? 2 : data.region === 'Midwest' ? 1 : data.region === 'West Coast' ? 1 : 2}
                      onAlertsClick={() => console.log(`View ${data.region} alerts`)}
                      onReviewClick={() => console.log(`Review ${data.region} potential`)}
                    />
                  ))}
                </div>
              )}

              {/* Table View */}
              {activeView === 1 && (
                <RegionalPerformanceTable
                  data={dynamicRegionalData.map(d => ({
                    location: d.region,
                    plants: d.region === 'Southeast' ? 5 : d.region === 'Midwest' ? 4 : d.region === 'West Coast' ? 5 : 3,
                    terminals: d.region === 'Southeast' ? 2 : d.region === 'Midwest' ? 1 : d.region === 'West Coast' ? 1 : 2,
                    volume: d.volume,
                    costPerTon: Math.round(5000 + Math.random() * 500),
                    costPerTonPre: Math.round(5500 + Math.random() * 500),
                    currentCost: d.volume * 5280,
                    currentCostPre: d.volume * 5850,
                    preNuel: d.volume * 5850,
                    executionRate: d.rate,
                    untappedPotential: Math.round(d.savings * 0.11),
                    alerts: d.status === 'excellent' ? 2 : d.status === 'good' ? 3 : 4,
                    status: d.status,
                  }))}
                />
              )}
              </div>
            </FadeInSection>

            {/* Cost Trend Analysis Section */}
            <FadeInSection delay={150}>
              <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '24px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                width: '100%',
              }}
            >
              {/* Section Header */}
              <SectionHeader
                level="primary"
                icon="chart-line"
                title="Cost Trend Analysis"
                description="Monthly cost trends showing Pre-Nuel vs Post-Nuel performance"
              />

              {/* Chart */}
              <CostTrendChart />
              </div>
            </FadeInSection>

            {/* External Factors Impact Section */}
            <FadeInSection delay={200}>
              <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '24px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                width: '100%',
              }}
            >
              {/* Section Header */}
              <SectionHeader
                level="primary"
                icon="chart-line"
                title="External Factors Impact"
                description="Click factors to view detailed impact analysis and mitigation strategies"
              />

              {/* External Factors List */}
              <ExternalFactorsList
                items={[
                  {
                    icon: 'gas-pump',
                    title: 'Fuel Cost Impact',
                    description: 'Rising diesel fuel costs affecting transportation expenses',
                    value: '+$320/Shipment',
                    secondaryValue: '+5.9%',
                    trend: 'up',
                  },
                  {
                    icon: 'trend-up',
                    title: 'Port Congestion',
                    description: 'Increased wait times at major shipping ports',
                    value: '+$180/Shipment',
                    secondaryValue: '+3.3%',
                    trend: 'up',
                  },
                  {
                    icon: 'receipt',
                    title: 'Cross-Border Compliance',
                    description: 'Regulatory compliance costs for international shipments',
                    value: '+$95/Shipment',
                    secondaryValue: '+1.8%',
                    trend: 'up',
                  },
                  {
                    icon: 'train',
                    title: 'Route Optimization',
                    description: 'AI-driven route optimization reducing transit times',
                    value: '-$285/Shipment',
                    secondaryValue: '-5.3%',
                    trend: 'down',
                  },
                  {
                    icon: 'sparkle',
                    title: 'Demand Forecasting',
                    description: 'Predictive analytics improving capacity utilization',
                    value: '-$425/Shipment',
                    secondaryValue: '-7.8%',
                    trend: 'down',
                  },
                  {
                    title: 'Net Impact:',
                    description: '',
                    value: '-$115/Shipment',
                    secondaryValue: 'Combined factors (Nuel optimized)',
                    trend: 'down',
                    isNetImpact: true,
                  },
                ]}
              />
              </div>
            </FadeInSection>

            {/* Optimization Rejections Analysis Section */}
            <FadeInSection delay={250}>
              <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '24px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                width: '100%',
              }}
            >
              {/* Section Header */}
              <SectionHeader
                level="primary"
                icon="chart-line"
                title="Optimization Rejections Analysis"
                description="Quarterly analysis of rejected optimization recommendations by category"
              />

              {/* Chart with Integrated Cards */}
              <OptimizationRejectionsChart
                totalRejections={dynamicRejectionsData.totalRejections}
                rejectedValueK={dynamicRejectionsData.rejectedValueK}
                dataMultiplier={dynamicRejectionsData.dataMultiplier}
              />
              </div>
            </FadeInSection>

            {/* KPI Cards Section */}
            <FadeInSection delay={300}>
              <div className="grid grid-cols-4 gap-[12px] w-full">
                <KPICard
                  icon="check-circle"
                  title="ETA Accuracy"
                  value={`${dynamicKPIData.etaAccuracy}%`}
                  progressBar={{
                    value: `${dynamicKPIData.etaAccuracy}%`,
                    label: "Target 94%"
                  }}
                  comparison={{
                    preNuel: `${(parseFloat(dynamicKPIData.etaAccuracy) - 8.7).toFixed(1)}%`,
                    postNuel: `${dynamicKPIData.etaAccuracy}%`
                  }}
                  variant="standard"
                />
                <KPICard
                  icon="package"
                  title="Capacity Utilization"
                  value={`${dynamicKPIData.capacityUtilization}%`}
                  progressBar={{
                    value: `${dynamicKPIData.capacityUtilization}%`,
                    label: "Target 90%"
                  }}
                  comparison={{
                    preNuel: `${(parseFloat(dynamicKPIData.capacityUtilization) - 15.2).toFixed(1)}%`,
                    postNuel: `${dynamicKPIData.capacityUtilization}%`
                  }}
                  variant="standard"
                />
                <KPICard
                  icon="clock"
                  title="Q3 Peak Readiness"
                  value={`${dynamicKPIData.peakReadiness}%`}
                  progressBar={{
                    value: `${dynamicKPIData.peakReadiness}%`,
                    label: "Peak: Jul-Sep"
                  }}
                  comparison={{
                    preNuel: `${(parseFloat(dynamicKPIData.peakReadiness) - 14.4).toFixed(1)}%`,
                    postNuel: `${dynamicKPIData.peakReadiness}%`
                  }}
                  variant="standard"
                />
                <KPICard
                  icon="bell"
                  title="Active Alerts"
                  value={`${dynamicKPIData.activeAlerts}`}
                  alertTags={[
                    { label: `${dynamicKPIData.criticalAlerts} critical`, color: "error" },
                    { label: `${dynamicKPIData.warningAlerts} warning`, color: "warning" }
                  ]}
                  onReviewClick={() => console.log('Review alerts')}
                  variant="alert"
                />
              </div>
            </FadeInSection>

            {/* Regional Performance Summary Table Section */}
            <FadeInSection delay={350}>
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '24px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  width: '100%',
                }}
              >
                {/* Section Header */}
                <SectionHeader
                  level="primary"
                  icon="chart-line"
                  title="Regional Performance Summary"
                  description="Comprehensive performance metrics by operational region with Pre-Nuel vs Post-Nuel tracking"
                  buttons={[
                    {
                      label: "View Details",
                      onClick: () => console.log('View regional details'),
                      variant: 'secondary',
                    }
                  ]}
                />

                {/* Regional Performance Table */}
                <RegionalPerformanceTable
                  data={dynamicRegionalData.map(d => ({
                    location: d.region,
                    plants: d.region === 'Southeast' ? 5 : d.region === 'Midwest' ? 4 : d.region === 'West Coast' ? 5 : 3,
                    terminals: d.region === 'Southeast' ? 2 : d.region === 'Midwest' ? 1 : d.region === 'West Coast' ? 1 : 2,
                    volume: d.volume,
                    costPerTon: Math.round(5000 + Math.random() * 500),
                    costPerTonPre: Math.round(5500 + Math.random() * 500),
                    currentCost: d.volume * 5280,
                    currentCostPre: d.volume * 5850,
                    preNuel: d.volume * 5850,
                    executionRate: d.rate,
                    untappedPotential: Math.round(d.savings * 0.11),
                    alerts: d.status === 'excellent' ? 2 : d.status === 'good' ? 3 : 4,
                    status: d.status,
                  }))}
                />
              </div>
            </FadeInSection>
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
