'use client';

import React, { useState, useMemo } from 'react';
import { SectionHeader } from './SectionHeader';
import { NotificationCard } from './NotificationCard';
import { ReviewAlertModal } from './ReviewAlertModal';
import { Bell, SlidersHorizontal } from '@phosphor-icons/react';

export interface InventoryAlertsProps {
  className?: string;
  filters?: {
    region: string;
    timeFrame: string;
    material: string;
  };
}

// Base alert data with material categorization
const BASE_ALERTS = [
  {
    id: '1',
    severity: 'info' as const,
    title: 'Raw Material B Stock Above Target',
    description: 'Excess Raw Material B inventory at Regional Hub, consider redistribution',
    location: 'Regional Hub - Raw Material B',
    date: '01/15/2026',
    status: 'info' as const,
    statusLabel: 'Info',
    region: 'Southeast',
    facility: 'Regional Hub',
    material: 'Raw Material B',
    impact: 'Medium - Inventory buildup',
    reported: '01/15/2026',
  },
  {
    id: '2',
    severity: 'warning' as const,
    title: 'Additive E Running Low',
    description: 'Additive E inventory at Eastern Terminal below safety stock',
    location: 'Eastern Terminal - Additive E',
    date: '01/18/2026',
    status: 'warning' as const,
    statusLabel: 'Warning',
    region: 'Northeast',
    facility: 'Eastern Terminal',
    material: 'Additive E',
    impact: 'High - Stock shortage risk',
    reported: '01/18/2026',
  },
  {
    id: '3',
    severity: 'critical' as const,
    title: 'Raw Material A Critical Shortage',
    description: 'Southern Terminal Raw Material A at 48% capacity, production at risk',
    location: 'Southern Terminal - Raw Material A',
    date: '01/20/2026',
    status: 'critical' as const,
    statusLabel: 'Critical',
    region: 'Southwest',
    facility: 'Southern Terminal',
    material: 'Raw Material A',
    impact: 'Critical - Immediate action required',
    reported: '01/20/2026',
  },
  {
    id: '4',
    severity: 'warning' as const,
    title: 'Component C Approaching Minimum',
    description: 'Component C at Midwest Processing nearing safety stock levels',
    location: 'Midwest Processing - Component C',
    date: '01/19/2026',
    status: 'warning' as const,
    statusLabel: 'Warning',
    region: 'Midwest',
    facility: 'Midwest Processing',
    material: 'Component C',
    impact: 'Medium - Monitor closely',
    reported: '01/19/2026',
  },
  {
    id: '5',
    severity: 'info' as const,
    title: 'Component D Reorder Scheduled',
    description: 'Automatic reorder triggered for Component D at West Coast facility',
    location: 'Los Angeles Facility - Component D',
    date: '01/17/2026',
    status: 'info' as const,
    statusLabel: 'Info',
    region: 'West Coast',
    facility: 'Los Angeles Facility',
    material: 'Component D',
    impact: 'Low - Automated action',
    reported: '01/17/2026',
  },
];

/**
 * InventoryAlerts Component
 * Displays a scrollable list of inventory alerts with filter button
 * Filters based on TopBar selections
 */
export const InventoryAlerts = React.forwardRef<HTMLDivElement, InventoryAlertsProps>(
  ({ className, filters }, ref) => {
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [selectedAlert, setSelectedAlert] = useState<any>(null);
    const [dismissedIds, setDismissedIds] = useState<string[]>([]);

    // Filter alerts based on TopBar filters
    const filteredAlerts = useMemo(() => {
      let alerts = BASE_ALERTS.filter(alert => !dismissedIds.includes(alert.id));

      if (filters) {
        // Filter by region
        if (filters.region !== 'All Regions') {
          alerts = alerts.filter(alert => alert.region === filters.region);
        }

        // Filter by material
        if (filters.material !== 'All Materials') {
          alerts = alerts.filter(alert => alert.material === filters.material);
        }
      }

      return alerts;
    }, [filters, dismissedIds]);

    const handleReviewAlert = (alert: any) => {
      setSelectedAlert(alert);
      setShowReviewModal(true);
    };

    const handleDismissCard = (id: string) => {
      setDismissedIds(prev => [...prev, id]);
    };

    const handleCompleteReview = (data: { priority: string; assignedTo: string; notes: string; }) => {
      console.log('Review completed:', data);
    };

    const handleMarkUnread = () => {
      console.log('Marked as unread');
    };

    return (
      <div
        ref={ref}
        className={className}
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          padding: '24px',
          width: '504px',
          height: '504px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {/* Section Header */}
        <SectionHeader
          level="primary"
          icon={<Bell size={24} weight="regular" className="text-[#1C58F7]" />}
          title="Inventory Alerts"
          buttons={[
            {
              label: 'Filters',
              onClick: () => console.log('Open filters'),
              icon: <SlidersHorizontal size={16} weight="regular" />,
              variant: 'secondary',
            },
          ]}
        />

        {/* Alerts Container with Scroll */}
        <div
          style={{
            position: 'relative',
            height: '386px',
            width: '100%',
          }}
        >
          {/* Scrollable Alerts List */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              height: '100%',
              overflowY: 'auto',
              overflowX: 'hidden',
              width: '100%',
            }}
          >
            {filteredAlerts.length === 0 ? (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                color: '#7F8FA4',
                fontFamily: 'DM Sans',
                fontSize: '14px',
              }}>
                No alerts match the selected filters
              </div>
            ) : (
              filteredAlerts.map((alert) => (
                <NotificationCard
                  key={alert.id}
                  severity={alert.severity}
                  title={alert.title}
                  description={alert.description}
                  date={alert.date}
                  primaryAction="Review"
                  secondaryAction="Dismiss"
                  onPrimaryAction={() => handleReviewAlert(alert)}
                  onSecondaryAction={() => handleDismissCard(alert.id)}
                  className="w-full min-h-[140px]"
                />
              ))
            )}
          </div>

          {/* Shadow Gradient Overlay */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '504px',
              height: '80px',
              background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.5))',
              pointerEvents: 'none',
            }}
          />
        </div>

        {/* Review Alert Modal */}
        <ReviewAlertModal
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          alert={selectedAlert}
          onComplete={handleCompleteReview}
          onMarkUnread={handleMarkUnread}
        />
      </div>
    );
  }
);

InventoryAlerts.displayName = 'InventoryAlerts';
