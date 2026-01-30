'use client';

import React, { useState } from 'react';
import { SectionHeader } from './SectionHeader';
import { NotificationCard } from './NotificationCard';
import { ReviewAlertModal } from './ReviewAlertModal';
import { Bell, SlidersHorizontal } from '@phosphor-icons/react';

export interface InventoryAlertsProps {
  className?: string;
}

/**
 * InventoryAlerts Component
 * Displays a scrollable list of inventory alerts with filter button
 * Exactly replicates Figma specifications
 */
export const InventoryAlerts = React.forwardRef<HTMLDivElement, InventoryAlertsProps>(
  ({ className }, ref) => {
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [selectedAlert, setSelectedAlert] = useState<any>(null);

    const [alerts, setAlerts] = useState([
      {
        id: '1',
        severity: 'info' as const,
        title: 'CO₂ Stock Above Target',
        description: 'Excess CO₂ inventory at Atlanta Hub, consider redistribution',
        location: 'Atlanta Hub - CO₂',
        date: '01/15/2026',
        status: 'info' as const,
        statusLabel: 'Info',
        region: 'Atlanta Hub',
        impact: 'Medium - Inventory buildup',
        reported: '01/15/2026',
      },
      {
        id: '2',
        severity: 'warning' as const,
        title: 'Cola Extract Running Low',
        description: 'Cola Extract inventory at Newark Terminal below safety stock',
        location: 'Newark Terminal - Cola Extract',
        date: '01/18/2026',
        status: 'warning' as const,
        statusLabel: 'Warning',
        region: 'Newark Terminal',
        impact: 'High - Stock shortage risk',
        reported: '01/18/2026',
      },
      {
        id: '3',
        severity: 'critical' as const,
        title: 'HFCS Critical Shortage',
        description: 'Houston Terminal HFCS at 48% capacity, production at risk',
        location: 'Houston Terminal - HFCS',
        date: '01/20/2026',
        status: 'critical' as const,
        statusLabel: 'Critical',
        region: 'Houston Terminal',
        impact: 'Critical - Immediate action required',
        reported: '01/20/2026',
      },
    ]);

    const handleReviewAlert = (alert: any) => {
      setSelectedAlert(alert);
      setShowReviewModal(true);
    };

    const handleDismissCard = (id: string) => {
      setAlerts(alerts.filter(alert => alert.id !== id));
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
            {alerts.map((alert) => (
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
            ))}
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
