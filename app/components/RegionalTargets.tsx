'use client';

import React, { useState, useMemo } from 'react';
import { SectionHeader } from './SectionHeader';
import { ProgressBar } from './ProgressBar';
import { Modal } from './Modal';
import { Input } from './Input';
import { Button } from './Button';
import { ChartLine, Factory, Cube, GearSix } from '@phosphor-icons/react';
import { warning } from '../../lib/design-tokens/colors';

export interface RegionalTargetsProps {
  className?: string;
  filters?: {
    region: string;
    timeFrame: string;
    material: string;
  };
}

type TabType = 'facility' | 'material';

// Facility data with region mapping
const FACILITIES_DATA = [
  {
    name: 'Southern Terminal',
    region: 'Southwest',
    usagePercent: 50,
    targetPercent: 86,
    alerts: 2,
    status: 'critical' as const,
    materials: [
      { name: 'Raw Material A', current: 14, target: 24, capacity: 28, percentage: 50, status: 'critical' as const },
      { name: 'Raw Material B', current: 18, target: 20, capacity: 25, percentage: 72, status: 'warning' as const },
      { name: 'Additive E', current: 22, target: 24, capacity: 28, percentage: 79, status: 'good' as const },
      { name: 'Additive F', current: 0, target: 0, capacity: 0, status: 'warning' as const, noData: true },
    ],
  },
  {
    name: 'Regional Hub',
    region: 'Southeast',
    usagePercent: 91,
    targetPercent: 86,
    alerts: 0,
    status: 'good' as const,
    materials: [
      { name: 'Raw Material B', current: 32, target: 30, capacity: 35, percentage: 91, status: 'good' as const },
    ],
  },
  {
    name: 'Midwest Processing',
    region: 'Midwest',
    usagePercent: 90,
    targetPercent: 86,
    alerts: 0,
    status: 'good' as const,
    materials: [
      { name: 'Component C', current: 38, target: 36, capacity: 42, percentage: 90, status: 'good' as const },
    ],
  },
  {
    name: 'Los Angeles Facility',
    region: 'West Coast',
    usagePercent: 75,
    targetPercent: 80,
    alerts: 1,
    status: 'warning' as const,
    materials: [
      { name: 'Component D', current: 28, target: 32, capacity: 38, percentage: 74, status: 'warning' as const },
    ],
  },
  {
    name: 'Eastern Terminal',
    region: 'Northeast',
    usagePercent: 65,
    targetPercent: 85,
    alerts: 1,
    status: 'warning' as const,
    materials: [
      { name: 'Additive E', current: 18, target: 25, capacity: 30, percentage: 60, status: 'warning' as const },
    ],
  },
];

// Material aggregated data
const MATERIALS_DATA = [
  { name: 'Raw Material A', usagePercent: 45, targetPercent: 65, alerts: 1, status: 'critical' as const },
  { name: 'Raw Material B', usagePercent: 72, targetPercent: 80, alerts: 1, status: 'warning' as const },
  { name: 'Additive E', usagePercent: 88, targetPercent: 85, alerts: 0, status: 'good' as const },
  { name: 'Component C', usagePercent: 90, targetPercent: 86, alerts: 0, status: 'good' as const },
  { name: 'Component D', usagePercent: 74, targetPercent: 80, alerts: 1, status: 'warning' as const },
];

/**
 * RegionalTargets Component
 * Displays regional performance targets with detailed progress bars
 * Filters based on TopBar selections
 */
export const RegionalTargets = React.forwardRef<HTMLDivElement, RegionalTargetsProps>(
  ({ className, filters }, ref) => {
    const [activeTab, setActiveTab] = useState<TabType>('facility');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState<{ name: string; current: number; target: number; capacity: number } | null>(null);
    const [targetValue, setTargetValue] = useState('');
    const [reasonValue, setReasonValue] = useState('');

    // Filter facilities based on region
    const filteredFacilities = useMemo(() => {
      let facilities = FACILITIES_DATA;

      if (filters) {
        // Filter by region
        if (filters.region !== 'All Regions') {
          facilities = facilities.filter(f => f.region === filters.region);
        }

        // Filter materials within each facility
        if (filters.material !== 'All Materials') {
          facilities = facilities.map(f => ({
            ...f,
            materials: f.materials.filter(m => m.name === filters.material),
          })).filter(f => f.materials.length > 0);
        }
      }

      return facilities;
    }, [filters]);

    // Filter materials based on selection
    const filteredMaterials = useMemo(() => {
      let materials = MATERIALS_DATA;

      if (filters && filters.material !== 'All Materials') {
        materials = materials.filter(m => m.name === filters.material);
      }

      return materials;
    }, [filters]);

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
            filteredFacilities.length === 0 ? (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '48px',
                color: '#7F8FA4',
                fontFamily: 'DM Sans',
                fontSize: '14px',
              }}>
                No facilities match the selected filters
              </div>
            ) : (
              filteredFacilities.map((facility) => (
                <div key={facility.name} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {/* Facility Header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Factory size={20} weight="regular" color="#1C58F7" />
                    <p style={{ fontSize: '16px', lineHeight: '24px', fontWeight: 600, color: '#17263D', fontFamily: 'DM Sans' }}>
                      {facility.name}
                    </p>
                    <p style={{ fontSize: '14px', lineHeight: '22px', fontWeight: 400, color: '#7F8FA4', fontFamily: 'DM Sans' }}>
                      Using {facility.usagePercent}% of total capacity — Target is at {facility.targetPercent}% capacity
                    </p>

                    {/* Status Badge */}
                    {facility.alerts > 0 ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '2px 8px', backgroundColor: facility.status === 'critical' ? '#FFD6DB' : warning[100], borderRadius: '6px', marginLeft: 'auto' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: facility.status === 'critical' ? '#FF3B30' : warning[500] }} />
                        <p style={{ fontSize: '12px', lineHeight: '20px', fontWeight: 500, color: facility.status === 'critical' ? '#FF3B30' : warning[500], fontFamily: 'DM Sans' }}>
                          {facility.alerts} Alert{facility.alerts > 1 ? 's' : ''}
                        </p>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '2px 8px', backgroundColor: '#D6F5E1', borderRadius: '6px', marginLeft: 'auto' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#34C759' }} />
                        <p style={{ fontSize: '12px', lineHeight: '20px', fontWeight: 500, color: '#34C759', fontFamily: 'DM Sans' }}>
                          All clear
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Material Progress Bars */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingLeft: '28px' }}>
                    {facility.materials.map((mat) => (
                      <ProgressBar
                        key={mat.name}
                        size="xl"
                        name={mat.name}
                        icon={materialIcons[mat.name as keyof typeof materialIcons]}
                        current={mat.current}
                        target={mat.target}
                        capacity={mat.capacity}
                        percentage={mat.percentage}
                        status={mat.status}
                        warningMessage={(mat as any).noData ? 'No data available for this material/facility' : undefined}
                        onSettingsClick={() => handleSettingsClick(mat.name, mat.current, mat.target, mat.capacity)}
                      />
                    ))}
                  </div>
                </div>
              ))
            )
          ) : (
            // By Material View
            filteredMaterials.length === 0 ? (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '48px',
                color: '#7F8FA4',
                fontFamily: 'DM Sans',
                fontSize: '14px',
              }}>
                No materials match the selected filters
              </div>
            ) : (
              filteredMaterials.map((material) => (
                <div key={material.name} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {/* Material Header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {materialIcons[material.name as keyof typeof materialIcons]}
                    <p style={{ fontSize: '16px', lineHeight: '24px', fontWeight: 600, color: '#17263D', fontFamily: 'DM Sans' }}>
                      {material.name}
                    </p>
                    <p style={{ fontSize: '14px', lineHeight: '22px', fontWeight: 400, color: '#7F8FA4', fontFamily: 'DM Sans' }}>
                      Using {material.usagePercent}% of total capacity — Target is at {material.targetPercent}% capacity
                    </p>

                    {/* Status Badge */}
                    {material.alerts > 0 ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '2px 8px', backgroundColor: material.status === 'critical' ? '#FFD6DB' : warning[100], borderRadius: '6px', marginLeft: 'auto' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: material.status === 'critical' ? '#FF3B30' : warning[500] }} />
                        <p style={{ fontSize: '12px', lineHeight: '20px', fontWeight: 500, color: material.status === 'critical' ? '#FF3B30' : warning[500], fontFamily: 'DM Sans' }}>
                          {material.alerts} Alert{material.alerts > 1 ? 's' : ''}
                        </p>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '2px 8px', backgroundColor: '#D6F5E1', borderRadius: '6px', marginLeft: 'auto' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#34C759' }} />
                        <p style={{ fontSize: '12px', lineHeight: '20px', fontWeight: 500, color: '#34C759', fontFamily: 'DM Sans' }}>
                          All clear
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Single XL Progress Bar */}
                  <div style={{ paddingLeft: '28px' }}>
                    <ProgressBar
                      size="xl"
                      name=""
                      current={material.usagePercent}
                      target={material.targetPercent}
                      capacity={100}
                      percentage={material.usagePercent}
                      status={material.status}
                      showSettings={false}
                    />
                  </div>
                </div>
              ))
            )
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
