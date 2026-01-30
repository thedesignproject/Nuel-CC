'use client';

import React, { useState } from 'react';
import { SectionHeader } from './SectionHeader';
import { ProgressBar } from './ProgressBar';
import { Modal } from './Modal';
import { Input } from './Input';
import { Button } from './Button';
import { ChartLine, Factory, Cube, GearSix } from '@phosphor-icons/react';
import { warning } from '../../lib/design-tokens/colors';

export interface RegionalTargetsProps {
  className?: string;
}

type TabType = 'facility' | 'material';

/**
 * RegionalTargets Component
 * Displays regional performance targets with detailed progress bars
 * Exactly replicates Figma specifications with XL and LG progress bar variants
 */
export const RegionalTargets = React.forwardRef<HTMLDivElement, RegionalTargetsProps>(
  ({ className }, ref) => {
    const [activeTab, setActiveTab] = useState<TabType>('facility');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState<{ name: string; current: number; target: number; capacity: number } | null>(null);
    const [targetValue, setTargetValue] = useState('');
    const [reasonValue, setReasonValue] = useState('');

    const handleSettingsClick = (name: string, current: number, target: number, capacity: number) => {
      setSelectedMaterial({ name, current, target, capacity });
      setTargetValue(target.toString());
      setReasonValue('');
      setIsModalOpen(true);
    };

    const handleModalClose = () => {
      setIsModalOpen(false);
      setSelectedMaterial(null);
      setTargetValue('');
      setReasonValue('');
    };

    const handleSave = () => {
      console.log('Saving configuration:', {
        material: selectedMaterial?.name,
        target: targetValue,
        reason: reasonValue,
      });
      handleModalClose();
    };

    // Material icons for supply chain
    const materialIcons = {
      'Raw Material A': (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="8" fill="#FF3B30" opacity="0.2" />
          <circle cx="12" cy="12" r="4" fill="#FF3B30" />
        </svg>
      ),
      'Raw Material B': (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="8" fill={warning[500]} opacity="0.2" />
          <circle cx="12" cy="12" r="4" fill={warning[500]} />
        </svg>
      ),
      'Additive E': (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="8" fill="#34C759" opacity="0.2" />
          <circle cx="12" cy="12" r="4" fill="#34C759" />
        </svg>
      ),
      'Additive F': (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="8" fill="#7F8FA4" opacity="0.2" />
          <circle cx="12" cy="12" r="4" fill="#7F8FA4" />
        </svg>
      ),
    };

    return (
      <div
        ref={ref}
        className={className}
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
        {/* Section Header with ALL filter pills active */}
        <SectionHeader
          level="primary"
          icon={<ChartLine size={24} weight="regular" className="text-[#1C58F7]" />}
          title="Regional Targets"
          showFilters={true}
          filters={[
            { label: 'Critical', variant: 'error', active: true },
            { label: 'Warning', variant: 'warning', active: true },
            { label: 'Good', variant: 'success', active: true },
            { label: 'Excellent', variant: 'info', active: true },
          ]}
        />

        {/* Tab Structure */}
        <div
          style={{
            display: 'flex',
            gap: '24px',
            borderBottom: '1px solid #E8EDF2',
            paddingBottom: '0px',
          }}
        >
          <button
            onClick={() => setActiveTab('facility')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '12px 0',
              fontSize: '16px',
              lineHeight: '24px',
              fontWeight: 600,
              fontFamily: 'DM Sans',
              color: activeTab === 'facility' ? '#17263D' : '#7F8FA4',
              borderBottom: activeTab === 'facility' ? '2px solid #1C58F7' : '2px solid transparent',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Factory size={16} weight="regular" />
            By Facility
          </button>
          <button
            onClick={() => setActiveTab('material')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '12px 0',
              fontSize: '16px',
              lineHeight: '24px',
              fontWeight: 600,
              fontFamily: 'DM Sans',
              color: activeTab === 'material' ? '#17263D' : '#7F8FA4',
              borderBottom: activeTab === 'material' ? '2px solid #1C58F7' : '2px solid transparent',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Cube size={16} weight="regular" />
            By Material
          </button>
        </div>

        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {activeTab === 'facility' ? (
            // By Facility View
            <>
              {/* Southern Terminal */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Facility Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Factory size={20} weight="regular" color="#1C58F7" />
                  <p style={{ fontSize: '16px', lineHeight: '24px', fontWeight: 600, color: '#17263D', fontFamily: 'DM Sans' }}>
                    Southern Terminal
                  </p>
                  <p style={{ fontSize: '14px', lineHeight: '22px', fontWeight: 400, color: '#7F8FA4', fontFamily: 'DM Sans' }}>
                    Using 50% of total capacity — Target is at 86% capacity
                  </p>

                  {/* Alert Badge */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '2px 8px', backgroundColor: '#FFD6DB', borderRadius: '6px', marginLeft: 'auto' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#FF3B30' }} />
                    <p style={{ fontSize: '12px', lineHeight: '20px', fontWeight: 500, color: '#FF3B30', fontFamily: 'DM Sans' }}>
                      2 Alerts
                    </p>
                  </div>
                </div>

                {/* Material Progress Bars (XL) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingLeft: '28px' }}>
                  <ProgressBar
                    size="xl"
                    name="Raw Material A"
                    icon={materialIcons['Raw Material A']}
                    current={14}
                    target={24}
                    capacity={28}
                    percentage={50}
                    status="critical"
                    onSettingsClick={() => handleSettingsClick('Raw Material A', 14, 24, 28)}
                  />
                  <ProgressBar
                    size="xl"
                    name="Raw Material B"
                    icon={materialIcons['Raw Material B']}
                    current={18}
                    target={20}
                    capacity={25}
                    percentage={72}
                    status="warning"
                    onSettingsClick={() => handleSettingsClick('Raw Material B', 18, 20, 25)}
                  />
                  <ProgressBar
                    size="xl"
                    name="Additive E"
                    icon={materialIcons['Additive E']}
                    current={22}
                    target={24}
                    capacity={28}
                    percentage={79}
                    status="good"
                    onSettingsClick={() => handleSettingsClick('Additive E', 22, 24, 28)}
                  />
                  <ProgressBar
                    size="xl"
                    name="Additive F"
                    icon={materialIcons['Additive F']}
                    current={0}
                    target={0}
                    capacity={0}
                    status="warning"
                    warningMessage="No data available for this material/facility"
                    onSettingsClick={() => handleSettingsClick('Additive F', 0, 0, 0)}
                  />
                </div>
              </div>

              {/* Regional Hub */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Facility Header with "All clear" badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Factory size={20} weight="regular" color="#1C58F7" />
                  <p style={{ fontSize: '16px', lineHeight: '24px', fontWeight: 600, color: '#17263D', fontFamily: 'DM Sans' }}>
                    Regional Hub
                  </p>
                  <p style={{ fontSize: '14px', lineHeight: '22px', fontWeight: 400, color: '#7F8FA4', fontFamily: 'DM Sans' }}>
                    Using 91% of total capacity — Target is at 86% capacity
                  </p>

                  {/* All Clear Badge */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '2px 8px', backgroundColor: '#D6F5E1', borderRadius: '6px', marginLeft: 'auto' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#34C759' }} />
                    <p style={{ fontSize: '12px', lineHeight: '20px', fontWeight: 500, color: '#34C759', fontFamily: 'DM Sans' }}>
                      All clear
                    </p>
                  </div>
                </div>

                {/* Single XL Progress Bar */}
                <div style={{ paddingLeft: '28px' }}>
                  <ProgressBar
                    size="xl"
                    name=""
                    current={32}
                    target={30}
                    capacity={35}
                    percentage={91}
                    status="good"
                    showSettings={false}
                  />
                </div>
              </div>

              {/* Midwest Processing */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Facility Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Factory size={20} weight="regular" color="#1C58F7" />
                  <p style={{ fontSize: '16px', lineHeight: '24px', fontWeight: 600, color: '#17263D', fontFamily: 'DM Sans' }}>
                    Midwest Processing
                  </p>
                  <p style={{ fontSize: '14px', lineHeight: '22px', fontWeight: 400, color: '#7F8FA4', fontFamily: 'DM Sans' }}>
                    Using 90% of total capacity — Target is at 86% capacity
                  </p>

                  {/* All Clear Badge */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '2px 8px', backgroundColor: '#D6F5E1', borderRadius: '6px', marginLeft: 'auto' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#34C759' }} />
                    <p style={{ fontSize: '12px', lineHeight: '20px', fontWeight: 500, color: '#34C759', fontFamily: 'DM Sans' }}>
                      All clear
                    </p>
                  </div>
                </div>

                {/* Single XL Progress Bar */}
                <div style={{ paddingLeft: '28px' }}>
                  <ProgressBar
                    size="xl"
                    name=""
                    current={38}
                    target={36}
                    capacity={42}
                    percentage={90}
                    status="good"
                    showSettings={false}
                  />
                </div>
              </div>
            </>
          ) : (
            // By Material View
            <>
              {/* Raw Material A */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Material Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {materialIcons['Raw Material A']}
                  <p style={{ fontSize: '16px', lineHeight: '24px', fontWeight: 600, color: '#17263D', fontFamily: 'DM Sans' }}>
                    Raw Material A
                  </p>
                  <p style={{ fontSize: '14px', lineHeight: '22px', fontWeight: 400, color: '#7F8FA4', fontFamily: 'DM Sans' }}>
                    Using 45% of total capacity — Target is at 65% capacity
                  </p>

                  {/* Alert Badge */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '2px 8px', backgroundColor: '#FFD6DB', borderRadius: '6px', marginLeft: 'auto' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#FF3B30' }} />
                    <p style={{ fontSize: '12px', lineHeight: '20px', fontWeight: 500, color: '#FF3B30', fontFamily: 'DM Sans' }}>
                      1 Alert
                    </p>
                  </div>
                </div>

                {/* Single XL Progress Bar */}
                <div style={{ paddingLeft: '28px' }}>
                  <ProgressBar
                    size="xl"
                    name=""
                    current={45}
                    target={65}
                    capacity={100}
                    percentage={45}
                    status="critical"
                    showSettings={false}
                  />
                </div>
              </div>

              {/* Raw Material B */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Material Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {materialIcons['Raw Material B']}
                  <p style={{ fontSize: '16px', lineHeight: '24px', fontWeight: 600, color: '#17263D', fontFamily: 'DM Sans' }}>
                    Raw Material B
                  </p>
                  <p style={{ fontSize: '14px', lineHeight: '22px', fontWeight: 400, color: '#7F8FA4', fontFamily: 'DM Sans' }}>
                    Using 72% of total capacity — Target is at 80% capacity
                  </p>

                  {/* Alert Badge */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '2px 8px', backgroundColor: warning[100], borderRadius: '6px', marginLeft: 'auto' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: warning[500] }} />
                    <p style={{ fontSize: '12px', lineHeight: '20px', fontWeight: 500, color: warning[500], fontFamily: 'DM Sans' }}>
                      1 Alert
                    </p>
                  </div>
                </div>

                {/* Single XL Progress Bar */}
                <div style={{ paddingLeft: '28px' }}>
                  <ProgressBar
                    size="xl"
                    name=""
                    current={72}
                    target={80}
                    capacity={100}
                    percentage={72}
                    status="warning"
                    showSettings={false}
                  />
                </div>
              </div>

              {/* Additive E */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Material Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {materialIcons['Additive E']}
                  <p style={{ fontSize: '16px', lineHeight: '24px', fontWeight: 600, color: '#17263D', fontFamily: 'DM Sans' }}>
                    Additive E
                  </p>
                  <p style={{ fontSize: '14px', lineHeight: '22px', fontWeight: 400, color: '#7F8FA4', fontFamily: 'DM Sans' }}>
                    Using 88% of total capacity — Target is at 85% capacity
                  </p>

                  {/* All Clear Badge */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '2px 8px', backgroundColor: '#D6F5E1', borderRadius: '6px', marginLeft: 'auto' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#34C759' }} />
                    <p style={{ fontSize: '12px', lineHeight: '20px', fontWeight: 500, color: '#34C759', fontFamily: 'DM Sans' }}>
                      All clear
                    </p>
                  </div>
                </div>

                {/* Single XL Progress Bar */}
                <div style={{ paddingLeft: '28px' }}>
                  <ProgressBar
                    size="xl"
                    name=""
                    current={88}
                    target={85}
                    capacity={100}
                    percentage={88}
                    status="good"
                    showSettings={false}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Configuration Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          title="Configuration"
          icon={<GearSix size={24} weight="regular" color="#1C58F7" />}
          subtitle={selectedMaterial ? `Material: ${selectedMaterial.name}` : ''}
          footer={
            <>
              <Button
                size="medium"
                variant="secondary"
                onClick={handleModalClose}
                style={{ flex: 1 }}
              >
                Cancel
              </Button>
              <Button
                size="medium"
                variant="primary"
                onClick={handleSave}
                style={{ flex: 1 }}
              >
                Update
              </Button>
            </>
          }
        >
          {/* Modal Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div
              style={{
                borderBottom: '1px solid #D9E0E9',
                paddingBottom: '16px',
              }}
            >
              <Input
                label="Target"
                helperText={selectedMaterial ? `Nuel Optimization: ${selectedMaterial.target.toLocaleString()}` : ''}
                value={targetValue}
                onChange={(e) => setTargetValue((e.target as HTMLInputElement).value)}
                placeholder={selectedMaterial?.target.toString() || '0'}
              />
            </div>

            <div
              style={{
                borderBottom: '1px solid #D9E0E9',
                paddingBottom: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              <Input
                variant="textarea"
                multiline
                label="Reason"
                value={reasonValue}
                onChange={(e) => setReasonValue((e.target as HTMLTextAreaElement).value)}
                placeholder="Enter reason for configuration change..."
              />
            </div>

            {selectedMaterial && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  padding: '12px',
                  backgroundColor: '#F3F6F9',
                  borderRadius: '8px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '12px', color: '#7F8FA4', fontFamily: 'DM Sans' }}>
                    Current:
                  </span>
                  <span style={{ fontSize: '12px', color: '#17263D', fontFamily: 'DM Sans', fontWeight: 500 }}>
                    {selectedMaterial.current.toLocaleString()} shipments
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '12px', color: '#7F8FA4', fontFamily: 'DM Sans' }}>
                    Capacity:
                  </span>
                  <span style={{ fontSize: '12px', color: '#17263D', fontFamily: 'DM Sans', fontWeight: 500 }}>
                    {selectedMaterial.capacity.toLocaleString()} shipments
                  </span>
                </div>
              </div>
            )}
          </div>
        </Modal>
      </div>
    );
  }
);

RegionalTargets.displayName = 'RegionalTargets';
