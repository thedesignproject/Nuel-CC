'use client';

import { useState, useMemo } from 'react';
import { MagnifyingGlass, FunnelSimple, PencilLine, House, BuildingOffice, CaretUp, CaretDown, Check } from '@phosphor-icons/react';
import { TopBar } from '../components/TopBar';
import { Sidebar } from '../components/Sidebar';
import { SectionHeader } from '../components/SectionHeader';
import { StatusPill } from '../components/StatusPill';
import { NotificationsPanel } from '../components/NotificationsPanel';
import { Dropdown } from '../components/Dropdown';
import { useAuth } from '../context/AuthContext';
import { LAYOUT_SPACING, TYPOGRAPHY, COLORS, BORDER_RADIUS } from '../design-tokens';
import { neutral, primary } from '../../lib/design-tokens/colors';

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface OrderRow {
  orderId: string;
  orderPlaced: string;
  deliveryDate: string;
  deliveryStatus: 'pending' | 'shipped' | 'delivered' | 'in-progress';
  deliveryUpdated: string;
  creator: string;
  customer: string;
  customerCode: string;
  shipTo: string;
  deliveryCity: string;
  deliveryState: string;
  material: string;
  materialCode: string;
  volume: number;
  optimizedSource: string;
  sourceType: 'plant' | 'terminal';
  status: string;
  statusVariant: 'info' | 'warning' | 'good' | 'error' | 'neutral';
  actionLabel: string;
  region: string;
}

type SortField = 'orderId' | 'orderPlaced' | 'deliveryDate' | 'material' | 'volume' | 'customer';
type SortDirection = 'asc' | 'desc';

// ============================================
// SAMPLE DATA - US-Based Beverage Industry
// ============================================

const ORDERS_DATA: OrderRow[] = [
  // Page 1 - HFCS & Sweeteners
  {
    orderId: 'BEV-2026-001',
    orderPlaced: '01/08/2026',
    deliveryDate: '01/19/2026',
    deliveryStatus: 'pending',
    deliveryUpdated: 'Updated on 01/15/26 at 11:23am',
    creator: 'HFCS',
    customer: 'Nashville Bottler',
    customerCode: 'NB-2045',
    shipTo: 'Production Facility',
    deliveryCity: 'Nashville',
    deliveryState: 'TN',
    material: 'HFCS-55 Concentrate',
    materialCode: 'HFCS-55-BLK',
    volume: 28.5,
    optimizedSource: 'Midwest HFCS Facility',
    sourceType: 'plant',
    status: 'Sent to source',
    statusVariant: 'info',
    actionLabel: 'Accepted',
    region: 'Southeast',
  },
  {
    orderId: 'BEV-2026-002',
    orderPlaced: '01/09/2026',
    deliveryDate: '01/18/2026',
    deliveryStatus: 'shipped',
    deliveryUpdated: 'Updated on 01/16/26 at 2:45pm',
    creator: 'CO2G',
    customer: 'Los Angeles Bottler',
    customerCode: 'LAB-3821',
    shipTo: 'West Coast Hub',
    deliveryCity: 'Los Angeles',
    deliveryState: 'CA',
    material: 'Carbon Dioxide (CO₂)',
    materialCode: 'CO2-BULK-TK',
    volume: 35.2,
    optimizedSource: 'Houston Terminal',
    sourceType: 'terminal',
    status: 'In Transit',
    statusVariant: 'warning',
    actionLabel: 'Tracking',
    region: 'West Coast',
  },
  {
    orderId: 'BEV-2026-003',
    orderPlaced: '01/10/2026',
    deliveryDate: '01/17/2026',
    deliveryStatus: 'delivered',
    deliveryUpdated: 'Updated on 01/17/26 at 9:12am',
    creator: 'COLA',
    customer: 'Atlanta Hub',
    customerCode: 'ATL-1001',
    shipTo: 'Main Distribution',
    deliveryCity: 'Atlanta',
    deliveryState: 'GA',
    material: 'Caramel Color (Class IV)',
    materialCode: 'CARAMEL-IV',
    volume: 8.4,
    optimizedSource: 'Chicago Processing',
    sourceType: 'plant',
    status: 'Delivered',
    statusVariant: 'good',
    actionLabel: 'Completed',
    region: 'Southeast',
  },
  {
    orderId: 'BEV-2026-004',
    orderPlaced: '01/11/2026',
    deliveryDate: '01/20/2026',
    deliveryStatus: 'pending',
    deliveryUpdated: 'Updated on 01/15/26 at 4:30pm',
    creator: 'ACID',
    customer: 'Midwest HFCS Facility',
    customerCode: 'MHF-5502',
    shipTo: 'Processing Plant',
    deliveryCity: 'Des Moines',
    deliveryState: 'IA',
    material: 'Phosphoric Acid (H₃PO₄)',
    materialCode: 'PHOS-ACID-HZ',
    volume: 12.8,
    optimizedSource: 'Houston Terminal',
    sourceType: 'terminal',
    status: 'Pending Approval',
    statusVariant: 'warning',
    actionLabel: 'Review',
    region: 'Midwest',
  },
  {
    orderId: 'BEV-2026-005',
    orderPlaced: '01/12/2026',
    deliveryDate: '01/21/2026',
    deliveryStatus: 'in-progress',
    deliveryUpdated: 'Updated on 01/18/26 at 10:15am',
    creator: 'FLVR',
    customer: 'Nashville Bottler',
    customerCode: 'NB-2045',
    shipTo: 'Flavor Lab',
    deliveryCity: 'Nashville',
    deliveryState: 'TN',
    material: 'Natural Cola Extract',
    materialCode: 'COLA-EXT-NAT',
    volume: 4.2,
    optimizedSource: 'New Jersey Plant',
    sourceType: 'plant',
    status: 'Processing',
    statusVariant: 'info',
    actionLabel: 'Accepted',
    region: 'Southeast',
  },
  {
    orderId: 'BEV-2026-006',
    orderPlaced: '01/13/2026',
    deliveryDate: '01/22/2026',
    deliveryStatus: 'pending',
    deliveryUpdated: 'Updated on 01/19/26 at 1:45pm',
    creator: 'SWTN',
    customer: 'Los Angeles Bottler',
    customerCode: 'LAB-3821',
    shipTo: 'Sweetener Storage',
    deliveryCity: 'Los Angeles',
    deliveryState: 'CA',
    material: 'Aspartame',
    materialCode: 'ASPR-PWD-55',
    volume: 6.5,
    optimizedSource: 'Newark Terminal',
    sourceType: 'terminal',
    status: 'FM Assigned',
    statusVariant: 'warning',
    actionLabel: 'Sent to source',
    region: 'West Coast',
  },
  {
    orderId: 'BEV-2026-007',
    orderPlaced: '01/14/2026',
    deliveryDate: '01/23/2026',
    deliveryStatus: 'shipped',
    deliveryUpdated: 'Updated on 01/20/26 at 3:20pm',
    creator: 'SUGR',
    customer: 'Phoenix Bottler',
    customerCode: 'PHX-4420',
    shipTo: 'Main Plant',
    deliveryCity: 'Phoenix',
    deliveryState: 'AZ',
    material: 'Cane Sugar (Sucrose)',
    materialCode: 'CANE-SUG-FL',
    volume: 22.3,
    optimizedSource: 'Miami Terminal',
    sourceType: 'terminal',
    status: 'In Transit',
    statusVariant: 'warning',
    actionLabel: 'Tracking',
    region: 'Southwest',
  },
  {
    orderId: 'BEV-2026-008',
    orderPlaced: '01/15/2026',
    deliveryDate: '01/24/2026',
    deliveryStatus: 'pending',
    deliveryUpdated: 'Updated on 01/21/26 at 11:50am',
    creator: 'CITR',
    customer: 'Seattle Bottler',
    customerCode: 'SEA-7712',
    shipTo: 'Citrus Processing',
    deliveryCity: 'Seattle',
    deliveryState: 'WA',
    material: 'Citrus Oils (Lemon/Lime)',
    materialCode: 'CITR-OIL-MX',
    volume: 5.8,
    optimizedSource: 'Florida Citrus Plant',
    sourceType: 'plant',
    status: 'Pending',
    statusVariant: 'warning',
    actionLabel: 'Review',
    region: 'West Coast',
  },
  // Page 2 - CO2 & Acids
  {
    orderId: 'BEV-2026-009',
    orderPlaced: '01/16/2026',
    deliveryDate: '01/25/2026',
    deliveryStatus: 'delivered',
    deliveryUpdated: 'Updated on 01/25/26 at 8:30am',
    creator: 'PRES',
    customer: 'Dallas Terminal',
    customerCode: 'DAL-3301',
    shipTo: 'Distribution Center',
    deliveryCity: 'Dallas',
    deliveryState: 'TX',
    material: 'Sodium Benzoate',
    materialCode: 'SOD-BENZ-FG',
    volume: 3.2,
    optimizedSource: 'New Jersey Plant',
    sourceType: 'plant',
    status: 'Delivered',
    statusVariant: 'good',
    actionLabel: 'Completed',
    region: 'Southwest',
  },
  {
    orderId: 'BEV-2026-010',
    orderPlaced: '01/17/2026',
    deliveryDate: '01/26/2026',
    deliveryStatus: 'in-progress',
    deliveryUpdated: 'Updated on 01/24/26 at 2:15pm',
    creator: 'TEA',
    customer: 'Boston Bottler',
    customerCode: 'BOS-5501',
    shipTo: 'Tea Processing',
    deliveryCity: 'Boston',
    deliveryState: 'MA',
    material: 'Tea Leaf Extract',
    materialCode: 'TEA-EXT-BLK',
    volume: 8.9,
    optimizedSource: 'Charleston Plant',
    sourceType: 'plant',
    status: 'Processing',
    statusVariant: 'info',
    actionLabel: 'Accepted',
    region: 'Northeast',
  },
  {
    orderId: 'BEV-2026-011',
    orderPlaced: '01/18/2026',
    deliveryDate: '01/27/2026',
    deliveryStatus: 'pending',
    deliveryUpdated: 'Updated on 01/25/26 at 9:45am',
    creator: 'ELEC',
    customer: 'Denver Bottler',
    customerCode: 'DEN-4420',
    shipTo: 'Sports Drink Line',
    deliveryCity: 'Denver',
    deliveryState: 'CO',
    material: 'Electrolyte Mix (Na/K/Mg)',
    materialCode: 'ELEC-MIX-SP',
    volume: 4.5,
    optimizedSource: 'Atlanta Hub',
    sourceType: 'terminal',
    status: 'Pending',
    statusVariant: 'warning',
    actionLabel: 'Review',
    region: 'Mountain',
  },
  {
    orderId: 'BEV-2026-012',
    orderPlaced: '01/19/2026',
    deliveryDate: '01/28/2026',
    deliveryStatus: 'shipped',
    deliveryUpdated: 'Updated on 01/26/26 at 4:20pm',
    creator: 'CAFF',
    customer: 'Portland Bottler',
    customerCode: 'PDX-7712',
    shipTo: 'Energy Drink Line',
    deliveryCity: 'Portland',
    deliveryState: 'OR',
    material: 'Caffeine Extract',
    materialCode: 'CAFF-EXT-PW',
    volume: 2.1,
    optimizedSource: 'New Jersey Plant',
    sourceType: 'plant',
    status: 'In Transit',
    statusVariant: 'warning',
    actionLabel: 'Tracking',
    region: 'West Coast',
  },
  {
    orderId: 'BEV-2026-013',
    orderPlaced: '01/20/2026',
    deliveryDate: '01/29/2026',
    deliveryStatus: 'pending',
    deliveryUpdated: 'Updated on 01/27/26 at 10:30am',
    creator: 'HFCS',
    customer: 'Minneapolis Bottler',
    customerCode: 'MSP-8801',
    shipTo: 'Main Processing',
    deliveryCity: 'Minneapolis',
    deliveryState: 'MN',
    material: 'HFCS-55 Concentrate',
    materialCode: 'HFCS-55-BLK',
    volume: 45.2,
    optimizedSource: 'Midwest HFCS Facility',
    sourceType: 'plant',
    status: 'Pending',
    statusVariant: 'warning',
    actionLabel: 'Review',
    region: 'Midwest',
  },
  {
    orderId: 'BEV-2026-014',
    orderPlaced: '01/21/2026',
    deliveryDate: '01/30/2026',
    deliveryStatus: 'in-progress',
    deliveryUpdated: 'Updated on 01/28/26 at 1:15pm',
    creator: 'JCON',
    customer: 'Detroit Bottler',
    customerCode: 'DET-6602',
    shipTo: 'Juice Line',
    deliveryCity: 'Detroit',
    deliveryState: 'MI',
    material: 'Orange Juice Concentrate',
    materialCode: 'OJ-CONC-100',
    volume: 18.6,
    optimizedSource: 'Florida Citrus Plant',
    sourceType: 'plant',
    status: 'Processing',
    statusVariant: 'info',
    actionLabel: 'Accepted',
    region: 'Midwest',
  },
  {
    orderId: 'BEV-2026-015',
    orderPlaced: '01/22/2026',
    deliveryDate: '01/31/2026',
    deliveryStatus: 'shipped',
    deliveryUpdated: 'Updated on 01/29/26 at 11:45am',
    creator: 'COFF',
    customer: 'San Antonio Bottler',
    customerCode: 'SAT-2203',
    shipTo: 'Coffee Processing',
    deliveryCity: 'San Antonio',
    deliveryState: 'TX',
    material: 'Coffee Extract (Arabica)',
    materialCode: 'COFF-ARB-EX',
    volume: 7.3,
    optimizedSource: 'Houston Terminal',
    sourceType: 'terminal',
    status: 'In Transit',
    statusVariant: 'warning',
    actionLabel: 'Tracking',
    region: 'Southwest',
  },
  {
    orderId: 'BEV-2026-016',
    orderPlaced: '01/23/2026',
    deliveryDate: '02/01/2026',
    deliveryStatus: 'pending',
    deliveryUpdated: 'Updated on 01/30/26 at 3:30pm',
    creator: 'VANL',
    customer: 'San Diego Bottler',
    customerCode: 'SAN-4405',
    shipTo: 'Flavoring Lab',
    deliveryCity: 'San Diego',
    deliveryState: 'CA',
    material: 'Vanilla Extract (Natural)',
    materialCode: 'VAN-EXT-MAD',
    volume: 2.8,
    optimizedSource: 'New Jersey Plant',
    sourceType: 'plant',
    status: 'Pending',
    statusVariant: 'warning',
    actionLabel: 'Review',
    region: 'West Coast',
  },
  // Page 3 - Vitamins & Specialty
  {
    orderId: 'BEV-2026-017',
    orderPlaced: '01/24/2026',
    deliveryDate: '02/02/2026',
    deliveryStatus: 'pending',
    deliveryUpdated: 'Updated on 01/31/26 at 9:00am',
    creator: 'VITB',
    customer: 'Chicago Bottler',
    customerCode: 'CHI-8801',
    shipTo: 'Enhanced Water Line',
    deliveryCity: 'Chicago',
    deliveryState: 'IL',
    material: 'Vitamin B-Complex',
    materialCode: 'VIT-B-COMP',
    volume: 1.5,
    optimizedSource: 'New Jersey Plant',
    sourceType: 'plant',
    status: 'FM Assigned',
    statusVariant: 'warning',
    actionLabel: 'Sent to source',
    region: 'Midwest',
  },
  {
    orderId: 'BEV-2026-018',
    orderPlaced: '01/25/2026',
    deliveryDate: '02/03/2026',
    deliveryStatus: 'delivered',
    deliveryUpdated: 'Updated on 02/03/26 at 2:00pm',
    creator: 'GUAR',
    customer: 'Miami Bottler',
    customerCode: 'MIA-2203',
    shipTo: 'Energy Drink Line',
    deliveryCity: 'Miami',
    deliveryState: 'FL',
    material: 'Guarana Extract',
    materialCode: 'GUAR-EXT-BR',
    volume: 3.4,
    optimizedSource: 'Houston Terminal',
    sourceType: 'terminal',
    status: 'Delivered',
    statusVariant: 'good',
    actionLabel: 'Completed',
    region: 'Southeast',
  },
  {
    orderId: 'BEV-2026-019',
    orderPlaced: '01/26/2026',
    deliveryDate: '02/04/2026',
    deliveryStatus: 'delivered',
    deliveryUpdated: 'Updated on 02/04/26 at 5:30pm',
    creator: 'FRJC',
    customer: 'Austin Bottler',
    customerCode: 'AUS-1102',
    shipTo: 'Juice Processing',
    deliveryCity: 'Austin',
    deliveryState: 'TX',
    material: 'Fruit Juice Concentrate (Tropical)',
    materialCode: 'TROP-JC-MX',
    volume: 14.2,
    optimizedSource: 'Florida Citrus Plant',
    sourceType: 'plant',
    status: 'Delivered',
    statusVariant: 'good',
    actionLabel: 'Completed',
    region: 'Southwest',
  },
  {
    orderId: 'BEV-2026-020',
    orderPlaced: '01/27/2026',
    deliveryDate: '02/05/2026',
    deliveryStatus: 'shipped',
    deliveryUpdated: 'Updated on 02/02/26 at 12:15pm',
    creator: 'CITAC',
    customer: 'Indianapolis Bottler',
    customerCode: 'IND-3301',
    shipTo: 'Acid Storage',
    deliveryCity: 'Indianapolis',
    deliveryState: 'IN',
    material: 'Citric Acid',
    materialCode: 'CITR-ACID-PW',
    volume: 5.6,
    optimizedSource: 'Chicago Processing',
    sourceType: 'plant',
    status: 'In Transit',
    statusVariant: 'warning',
    actionLabel: 'Tracking',
    region: 'Midwest',
  },
  {
    orderId: 'BEV-2026-021',
    orderPlaced: '01/28/2026',
    deliveryDate: '02/06/2026',
    deliveryStatus: 'pending',
    deliveryUpdated: 'Updated on 02/03/26 at 8:45am',
    creator: 'COLR',
    customer: 'Columbus Bottler',
    customerCode: 'COL-7701',
    shipTo: 'Color Lab',
    deliveryCity: 'Columbus',
    deliveryState: 'OH',
    material: 'FD&C Yellow #5',
    materialCode: 'YEL-5-FDC',
    volume: 1.8,
    optimizedSource: 'Atlanta Hub',
    sourceType: 'terminal',
    status: 'Pending',
    statusVariant: 'warning',
    actionLabel: 'Review',
    region: 'Midwest',
  },
  {
    orderId: 'BEV-2026-022',
    orderPlaced: '01/29/2026',
    deliveryDate: '02/07/2026',
    deliveryStatus: 'in-progress',
    deliveryUpdated: 'Updated on 02/04/26 at 4:00pm',
    creator: 'HFCS',
    customer: 'Kansas City Bottler',
    customerCode: 'KCM-1102',
    shipTo: 'Syrup Line',
    deliveryCity: 'Kansas City',
    deliveryState: 'MO',
    material: 'HFCS-55 Concentrate',
    materialCode: 'HFCS-55-BLK',
    volume: 32.5,
    optimizedSource: 'Midwest HFCS Facility',
    sourceType: 'plant',
    status: 'Processing',
    statusVariant: 'info',
    actionLabel: 'Accepted',
    region: 'Midwest',
  },
  {
    orderId: 'BEV-2026-023',
    orderPlaced: '01/30/2026',
    deliveryDate: '02/08/2026',
    deliveryStatus: 'pending',
    deliveryUpdated: 'Updated on 02/05/26 at 11:30am',
    creator: 'GING',
    customer: 'Tampa Bottler',
    customerCode: 'TPA-3301',
    shipTo: 'Specialty Line',
    deliveryCity: 'Tampa',
    deliveryState: 'FL',
    material: 'Ginger Extract',
    materialCode: 'GING-EXT-CN',
    volume: 2.4,
    optimizedSource: 'New Jersey Plant',
    sourceType: 'plant',
    status: 'Pending',
    statusVariant: 'warning',
    actionLabel: 'Review',
    region: 'Southeast',
  },
  {
    orderId: 'BEV-2026-024',
    orderPlaced: '01/31/2026',
    deliveryDate: '02/09/2026',
    deliveryStatus: 'shipped',
    deliveryUpdated: 'Updated on 02/06/26 at 3:45pm',
    creator: 'SORB',
    customer: 'Charlotte Bottler',
    customerCode: 'CLT-7701',
    shipTo: 'Preservative Storage',
    deliveryCity: 'Charlotte',
    deliveryState: 'NC',
    material: 'Potassium Sorbate',
    materialCode: 'POT-SORB-FG',
    volume: 2.9,
    optimizedSource: 'Houston Terminal',
    sourceType: 'terminal',
    status: 'In Transit',
    statusVariant: 'warning',
    actionLabel: 'Tracking',
    region: 'Southeast',
  },
  // Page 4 - More orders
  {
    orderId: 'BEV-2026-025',
    orderPlaced: '02/01/2026',
    deliveryDate: '02/10/2026',
    deliveryStatus: 'pending',
    deliveryUpdated: 'Updated on 02/07/26 at 10:00am',
    creator: 'CO2G',
    customer: 'Nashville Bottler',
    customerCode: 'NB-2045',
    shipTo: 'Carbonation Line',
    deliveryCity: 'Nashville',
    deliveryState: 'TN',
    material: 'Carbon Dioxide (CO₂)',
    materialCode: 'CO2-BULK-TK',
    volume: 38.5,
    optimizedSource: 'Houston Terminal',
    sourceType: 'terminal',
    status: 'Pending',
    statusVariant: 'warning',
    actionLabel: 'Review',
    region: 'Southeast',
  },
  {
    orderId: 'BEV-2026-026',
    orderPlaced: '02/02/2026',
    deliveryDate: '02/11/2026',
    deliveryStatus: 'in-progress',
    deliveryUpdated: 'Updated on 02/08/26 at 2:30pm',
    creator: 'ACEK',
    customer: 'San Francisco Bottler',
    customerCode: 'SFO-4420',
    shipTo: 'Zero Sugar Line',
    deliveryCity: 'San Francisco',
    deliveryState: 'CA',
    material: 'Acesulfame Potassium (Ace-K)',
    materialCode: 'ACE-K-PWD',
    volume: 3.8,
    optimizedSource: 'New Jersey Plant',
    sourceType: 'plant',
    status: 'Processing',
    statusVariant: 'info',
    actionLabel: 'Accepted',
    region: 'West Coast',
  },
  {
    orderId: 'BEV-2026-027',
    orderPlaced: '02/03/2026',
    deliveryDate: '02/12/2026',
    deliveryStatus: 'pending',
    deliveryUpdated: 'Updated on 02/09/26 at 9:15am',
    creator: 'ASCB',
    customer: 'St. Louis Bottler',
    customerCode: 'STL-6602',
    shipTo: 'Vitamin Line',
    deliveryCity: 'St. Louis',
    deliveryState: 'MO',
    material: 'Ascorbic Acid (Vitamin C)',
    materialCode: 'VIT-C-ASC',
    volume: 4.2,
    optimizedSource: 'Chicago Processing',
    sourceType: 'plant',
    status: 'FM Assigned',
    statusVariant: 'warning',
    actionLabel: 'Sent to source',
    region: 'Midwest',
  },
  {
    orderId: 'BEV-2026-028',
    orderPlaced: '02/04/2026',
    deliveryDate: '02/13/2026',
    deliveryStatus: 'shipped',
    deliveryUpdated: 'Updated on 02/10/26 at 1:00pm',
    creator: 'LMNG',
    customer: 'New Orleans Bottler',
    customerCode: 'NOL-2203',
    shipTo: 'Tea Processing',
    deliveryCity: 'New Orleans',
    deliveryState: 'LA',
    material: 'Lemongrass Extract',
    materialCode: 'LMNG-EXT-TH',
    volume: 2.6,
    optimizedSource: 'Charleston Plant',
    sourceType: 'plant',
    status: 'In Transit',
    statusVariant: 'warning',
    actionLabel: 'Tracking',
    region: 'Southeast',
  },
  {
    orderId: 'BEV-2026-029',
    orderPlaced: '02/05/2026',
    deliveryDate: '02/14/2026',
    deliveryStatus: 'pending',
    deliveryUpdated: 'Updated on 02/11/26 at 11:45am',
    creator: 'COLA',
    customer: 'Los Angeles Bottler',
    customerCode: 'LAB-3821',
    shipTo: 'Main Production',
    deliveryCity: 'Los Angeles',
    deliveryState: 'CA',
    material: 'Cola Nut Extract',
    materialCode: 'COLA-NUT-EX',
    volume: 5.1,
    optimizedSource: 'New Jersey Plant',
    sourceType: 'plant',
    status: 'Pending',
    statusVariant: 'warning',
    actionLabel: 'Review',
    region: 'West Coast',
  },
  {
    orderId: 'BEV-2026-030',
    orderPlaced: '02/06/2026',
    deliveryDate: '02/15/2026',
    deliveryStatus: 'delivered',
    deliveryUpdated: 'Updated on 02/15/26 at 4:30pm',
    creator: 'SUCR',
    customer: 'Philadelphia Bottler',
    customerCode: 'PHL-7712',
    shipTo: 'Sweetener Storage',
    deliveryCity: 'Philadelphia',
    deliveryState: 'PA',
    material: 'Sucralose',
    materialCode: 'SUCR-PWD-PR',
    volume: 1.9,
    optimizedSource: 'Newark Terminal',
    sourceType: 'terminal',
    status: 'Delivered',
    statusVariant: 'good',
    actionLabel: 'Completed',
    region: 'Northeast',
  },
  {
    orderId: 'BEV-2026-031',
    orderPlaced: '02/07/2026',
    deliveryDate: '02/16/2026',
    deliveryStatus: 'in-progress',
    deliveryUpdated: 'Updated on 02/13/26 at 10:30am',
    creator: 'RED40',
    customer: 'Baltimore Bottler',
    customerCode: 'BAL-1102',
    shipTo: 'Color Processing',
    deliveryCity: 'Baltimore',
    deliveryState: 'MD',
    material: 'FD&C Red #40',
    materialCode: 'RED-40-FDC',
    volume: 1.2,
    optimizedSource: 'New Jersey Plant',
    sourceType: 'plant',
    status: 'Processing',
    statusVariant: 'info',
    actionLabel: 'Accepted',
    region: 'Northeast',
  },
  {
    orderId: 'BEV-2026-032',
    orderPlaced: '02/08/2026',
    deliveryDate: '02/17/2026',
    deliveryStatus: 'pending',
    deliveryUpdated: 'Updated on 02/14/26 at 3:15pm',
    creator: 'APPL',
    customer: 'Sacramento Bottler',
    customerCode: 'SAC-4405',
    shipTo: 'Juice Line',
    deliveryCity: 'Sacramento',
    deliveryState: 'CA',
    material: 'Apple Juice Concentrate',
    materialCode: 'APPL-JC-100',
    volume: 12.8,
    optimizedSource: 'Washington Apple Plant',
    sourceType: 'plant',
    status: 'Pending',
    statusVariant: 'warning',
    actionLabel: 'Review',
    region: 'West Coast',
  },
];

// ============================================
// STYLES
// ============================================

const headerCellStyle = {
  ...TYPOGRAPHY.bodySmallMedium,
  color: '#F9FAFB',
  textAlign: 'left' as const,
  padding: '20px 16px',
  whiteSpace: 'nowrap' as const,
  cursor: 'pointer',
  userSelect: 'none' as const,
};

const dataCellStyle = {
  ...TYPOGRAPHY.bodySmallMedium,
  fontWeight: 400,
  color: COLORS.text.primary,
  padding: '16px',
  borderBottom: `1px solid ${COLORS.border.subtle}`,
  whiteSpace: 'nowrap' as const,
};

// ============================================
// HELPER FUNCTIONS
// ============================================

const getDeliveryStatusVariant = (status: OrderRow['deliveryStatus']): 'good' | 'warning' | 'info' | 'neutral' => {
  switch (status) {
    case 'delivered':
      return 'good';
    case 'shipped':
    case 'in-progress':
      return 'warning';
    case 'pending':
      return 'info';
    default:
      return 'neutral';
  }
};

const getDeliveryStatusLabel = (status: OrderRow['deliveryStatus']): string => {
  switch (status) {
    case 'in-progress':
      return 'In Progress';
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
};

// ============================================
// CONSTANTS
// ============================================

const ITEMS_PER_PAGE = 8;

// ============================================
// MAIN COMPONENT
// ============================================

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isNotificationsPanelOpen, setIsNotificationsPanelOpen] = useState(false);
  const { logout } = useAuth();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Sorting state
  const [sortField, setSortField] = useState<SortField>('orderId');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Selection state
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());

  // Filter states
  const [regionFilter, setRegionFilter] = useState('All regions');
  const [statusFilter, setStatusFilter] = useState('All status');
  const [materialFilter, setMaterialFilter] = useState('All materials');

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = [...ORDERS_DATA];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(order =>
        order.orderId.toLowerCase().includes(query) ||
        order.customer.toLowerCase().includes(query) ||
        order.material.toLowerCase().includes(query) ||
        order.deliveryCity.toLowerCase().includes(query)
      );
    }

    // Apply region filter
    if (regionFilter !== 'All regions') {
      filtered = filtered.filter(order => order.region === regionFilter);
    }

    // Apply status filter
    if (statusFilter !== 'All status') {
      const statusMap: Record<string, string> = {
        'Pending': 'pending',
        'Shipped': 'shipped',
        'Delivered': 'delivered',
        'In Progress': 'in-progress',
      };
      filtered = filtered.filter(order => order.deliveryStatus === statusMap[statusFilter]);
    }

    // Apply material filter
    if (materialFilter !== 'All materials') {
      filtered = filtered.filter(order => order.material.includes(materialFilter));
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aVal: string | number = a[sortField];
      let bVal: string | number = b[sortField];

      if (sortField === 'volume') {
        aVal = a.volume;
        bVal = b.volume;
      } else if (sortField === 'orderPlaced' || sortField === 'deliveryDate') {
        aVal = new Date(a[sortField]).getTime();
        bVal = new Date(b[sortField]).getTime();
      }

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      return sortDirection === 'asc'
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    });

    return filtered;
  }, [searchQuery, regionFilter, statusFilter, materialFilter, sortField, sortDirection]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredAndSortedData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentPageData = filteredAndSortedData.slice(startIndex, endIndex);

  // Handle sort
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  // Handle selection
  const toggleSelectOrder = (orderId: string) => {
    const newSelected = new Set(selectedOrders);
    if (newSelected.has(orderId)) {
      newSelected.delete(orderId);
    } else {
      newSelected.add(orderId);
    }
    setSelectedOrders(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedOrders.size === currentPageData.length) {
      setSelectedOrders(new Set());
    } else {
      setSelectedOrders(new Set(currentPageData.map(o => o.orderId)));
    }
  };

  // Render sort icon
  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc'
      ? <CaretUp size={12} weight="bold" style={{ marginLeft: 4 }} />
      : <CaretDown size={12} weight="bold" style={{ marginLeft: 4 }} />;
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        if (!pages.includes(i)) pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push('...');
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }
    return pages;
  };

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
            activeItem="orders"
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
                title="Orders"
                subtitle="Overview delivery sources and routes for cost efficiency"
              />
            </div>

            {/* Page Content */}
            <div className="flex flex-col gap-[24px]" style={{ overflowX: 'hidden' }}>
              {/* Orders Table Section */}
              <div
                style={{
                  backgroundColor: neutral[0],
                  borderRadius: BORDER_RADIUS.lg,
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
                  icon="list"
                  title="Orders"
                  description={selectedOrders.size > 0 ? `${selectedOrders.size} order(s) selected` : undefined}
                />

                {/* Search and Filters */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                    width: '100%',
                    flexWrap: 'wrap',
                  }}
                >
                  {/* Search Input */}
                  <div
                    style={{
                      position: 'relative',
                      flex: 1,
                      maxWidth: '400px',
                      minWidth: '200px',
                    }}
                  >
                    <MagnifyingGlass
                      size={16}
                      weight="regular"
                      color={COLORS.text.secondary}
                      style={{
                        position: 'absolute',
                        left: '16px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        pointerEvents: 'none',
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Search orders by ID, customer, material..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                      style={{
                        width: '100%',
                        height: '44px',
                        paddingLeft: '44px',
                        paddingRight: '16px',
                        ...TYPOGRAPHY.bodyExtraSmallText,
                        color: COLORS.text.secondary,
                        backgroundColor: neutral[100],
                        border: `1px solid ${neutral[400]}`,
                        borderRadius: BORDER_RADIUS.md,
                        outline: 'none',
                      }}
                    />
                  </div>

                  {/* Filter Dropdowns */}
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <Dropdown
                      value={regionFilter}
                      options={[
                        { value: 'All regions', label: 'All regions' },
                        { value: 'Southeast', label: 'Southeast' },
                        { value: 'West Coast', label: 'West Coast' },
                        { value: 'Midwest', label: 'Midwest' },
                        { value: 'Southwest', label: 'Southwest' },
                        { value: 'Northeast', label: 'Northeast' },
                        { value: 'Mountain', label: 'Mountain' },
                      ]}
                      onChange={(val) => {
                        setRegionFilter(val);
                        setCurrentPage(1);
                      }}
                      variant="secondary"
                      width="145px"
                    />
                    <Dropdown
                      value={statusFilter}
                      options={[
                        { value: 'All status', label: 'All status' },
                        { value: 'Pending', label: 'Pending' },
                        { value: 'Shipped', label: 'Shipped' },
                        { value: 'Delivered', label: 'Delivered' },
                        { value: 'In Progress', label: 'In Progress' },
                      ]}
                      onChange={(val) => {
                        setStatusFilter(val);
                        setCurrentPage(1);
                      }}
                      variant="secondary"
                      width="130px"
                    />
                    <Dropdown
                      value={materialFilter}
                      options={[
                        { value: 'All materials', label: 'All materials' },
                        { value: 'HFCS', label: 'HFCS' },
                        { value: 'CO₂', label: 'CO₂' },
                        { value: 'Sugar', label: 'Sugar' },
                        { value: 'Extract', label: 'Extracts' },
                        { value: 'Acid', label: 'Acids' },
                        { value: 'Vitamin', label: 'Vitamins' },
                      ]}
                      onChange={(val) => {
                        setMaterialFilter(val);
                        setCurrentPage(1);
                      }}
                      variant="secondary"
                      width="145px"
                    />

                    {/* Clear Filters Button */}
                    <button
                      onClick={() => {
                        setRegionFilter('All regions');
                        setStatusFilter('All status');
                        setMaterialFilter('All materials');
                        setSearchQuery('');
                        setCurrentPage(1);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '36px',
                        height: '36px',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #17263D',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
                      title="Clear filters"
                    >
                      <FunnelSimple size={16} weight="regular" color="#1339A0" />
                    </button>
                  </div>
                </div>

                {/* Table Container with Horizontal Scroll */}
                <div
                  style={{
                    width: '100%',
                    overflowX: 'auto',
                    overflowY: 'visible',
                    borderRadius: '12px',
                  }}
                  className="orders-table-scroll"
                >
                  <table
                    style={{
                      width: '100%',
                      minWidth: '2200px',
                      borderCollapse: 'collapse',
                    }}
                  >
                    {/* Table Header */}
                    <thead
                      style={{
                        backgroundColor: primary[500],
                      }}
                    >
                      <tr>
                        {/* Checkbox column */}
                        <th style={{ ...headerCellStyle, width: '50px', cursor: 'pointer' }} onClick={toggleSelectAll}>
                          <div
                            style={{
                              width: '18px',
                              height: '18px',
                              border: '2px solid #F9FAFB',
                              borderRadius: '4px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: selectedOrders.size === currentPageData.length && currentPageData.length > 0 ? '#F9FAFB' : 'transparent',
                            }}
                          >
                            {selectedOrders.size === currentPageData.length && currentPageData.length > 0 && (
                              <Check size={12} weight="bold" color={primary[500]} />
                            )}
                          </div>
                        </th>
                        <th style={{ ...headerCellStyle, width: '120px' }} onClick={() => handleSort('orderId')}>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            Order ID {renderSortIcon('orderId')}
                          </div>
                        </th>
                        <th style={{ ...headerCellStyle, width: '120px' }} onClick={() => handleSort('orderPlaced')}>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            Order Placed {renderSortIcon('orderPlaced')}
                          </div>
                        </th>
                        <th style={{ ...headerCellStyle, width: '228px' }} onClick={() => handleSort('deliveryDate')}>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            Delivery Date {renderSortIcon('deliveryDate')}
                          </div>
                        </th>
                        <th style={{ ...headerCellStyle, width: '100px' }}>Creator</th>
                        <th style={{ ...headerCellStyle, width: '180px' }} onClick={() => handleSort('customer')}>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            Customer {renderSortIcon('customer')}
                          </div>
                        </th>
                        <th style={{ ...headerCellStyle, width: '150px' }}>Ship to</th>
                        <th style={{ ...headerCellStyle, width: '150px' }}>Delivery City</th>
                        <th style={{ ...headerCellStyle, width: '200px' }} onClick={() => handleSort('material')}>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            Material {renderSortIcon('material')}
                          </div>
                        </th>
                        <th style={{ ...headerCellStyle, width: '120px' }} onClick={() => handleSort('volume')}>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            Volume (Tons) {renderSortIcon('volume')}
                          </div>
                        </th>
                        <th style={{ ...headerCellStyle, width: '180px' }}>Optimized Source</th>
                        <th style={{ ...headerCellStyle, width: '120px' }}>Region</th>
                        <th style={{ ...headerCellStyle, width: '130px' }}>Status</th>
                        <th style={{ ...headerCellStyle, width: '130px' }}>Actions</th>
                      </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody>
                      {currentPageData.map((order) => (
                        <tr
                          key={order.orderId}
                          style={{
                            backgroundColor: selectedOrders.has(order.orderId) ? '#EAF1FF' : neutral[0],
                            transition: 'background-color 150ms ease',
                          }}
                          onMouseEnter={(e) => {
                            if (!selectedOrders.has(order.orderId)) {
                              e.currentTarget.style.backgroundColor = neutral[50];
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = selectedOrders.has(order.orderId) ? '#EAF1FF' : neutral[0];
                          }}
                        >
                          {/* Checkbox */}
                          <td style={{ ...dataCellStyle, width: '50px' }}>
                            <div
                              onClick={() => toggleSelectOrder(order.orderId)}
                              style={{
                                width: '18px',
                                height: '18px',
                                border: `2px solid ${selectedOrders.has(order.orderId) ? primary[500] : neutral[400]}`,
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: selectedOrders.has(order.orderId) ? primary[500] : 'transparent',
                                cursor: 'pointer',
                              }}
                            >
                              {selectedOrders.has(order.orderId) && (
                                <Check size={12} weight="bold" color="#FFFFFF" />
                              )}
                            </div>
                          </td>

                          {/* Order ID */}
                          <td style={{ ...dataCellStyle, width: '120px', fontWeight: 500 }}>{order.orderId}</td>

                          {/* Order Placed */}
                          <td style={{ ...dataCellStyle, width: '120px' }}>{order.orderPlaced}</td>

                          {/* Delivery Date - Special Column */}
                          <td style={{ ...dataCellStyle, width: '228px', padding: '0 16px' }}>
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '4px',
                                paddingTop: '9px',
                                paddingBottom: '9px',
                              }}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                                  <span
                                    style={{
                                      ...TYPOGRAPHY.bodySmallMedium,
                                      color: COLORS.text.primary,
                                    }}
                                  >
                                    {order.deliveryDate}
                                  </span>
                                  <StatusPill
                                    variant={getDeliveryStatusVariant(order.deliveryStatus)}
                                    label={getDeliveryStatusLabel(order.deliveryStatus)}
                                  />
                                </div>
                                <button
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '24px',
                                    height: '18px',
                                    padding: '2px 12px',
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                  }}
                                >
                                  <PencilLine size={12} weight="regular" color={COLORS.text.secondary} />
                                </button>
                              </div>
                              <p
                                style={{
                                  fontFamily: 'DM Sans',
                                  fontSize: '12px',
                                  lineHeight: '20px',
                                  color: '#A1A1AA',
                                  margin: 0,
                                }}
                              >
                                {order.deliveryUpdated}
                              </p>
                            </div>
                          </td>

                          {/* Creator */}
                          <td style={{ ...dataCellStyle, width: '100px' }}>{order.creator}</td>

                          {/* Customer */}
                          <td style={{ ...dataCellStyle, width: '180px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                              <span>{order.customer}</span>
                              <span
                                style={{
                                  fontSize: '12px',
                                  lineHeight: '20px',
                                  color: '#A1A1AA',
                                }}
                              >
                                {order.customerCode}
                              </span>
                            </div>
                          </td>

                          {/* Ship to */}
                          <td style={{ ...dataCellStyle, width: '150px' }}>{order.shipTo}</td>

                          {/* Delivery City */}
                          <td style={{ ...dataCellStyle, width: '150px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <span>
                                {order.deliveryCity}, {order.deliveryState}
                              </span>
                            </div>
                          </td>

                          {/* Material */}
                          <td style={{ ...dataCellStyle, width: '200px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                              <span>{order.material}</span>
                              <span
                                style={{
                                  fontSize: '12px',
                                  lineHeight: '20px',
                                  color: '#A1A1AA',
                                }}
                              >
                                {order.materialCode}
                              </span>
                            </div>
                          </td>

                          {/* Volume */}
                          <td style={{ ...dataCellStyle, width: '120px' }}>{order.volume} Tons</td>

                          {/* Optimized Source */}
                          <td style={{ ...dataCellStyle, width: '180px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              {order.sourceType === 'plant' ? (
                                <House size={14} weight="regular" color="#D345F8" />
                              ) : (
                                <BuildingOffice size={14} weight="regular" color="#1C58F7" />
                              )}
                              <span
                                style={{
                                  color: order.sourceType === 'plant' ? '#D345F8' : '#1C58F7',
                                }}
                              >
                                {order.optimizedSource}
                              </span>
                            </div>
                          </td>

                          {/* Region */}
                          <td style={{ ...dataCellStyle, width: '120px' }}>{order.region}</td>

                          {/* Status */}
                          <td style={{ ...dataCellStyle, width: '130px' }}>
                            <StatusPill variant={order.statusVariant} label={order.status} />
                          </td>

                          {/* Actions */}
                          <td style={{ ...dataCellStyle, width: '130px' }}>
                            <div
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '4px 8px',
                                backgroundColor: '#E8EDF2',
                                borderRadius: '8px',
                              }}
                            >
                              <span
                                style={{
                                  fontFamily: 'DM Sans',
                                  fontSize: '12px',
                                  lineHeight: '20px',
                                  color: '#7F8FA4',
                                }}
                              >
                                {order.actionLabel}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 0',
                  }}
                >
                  {/* Results info */}
                  <span
                    style={{
                      fontFamily: 'DM Sans',
                      fontSize: '14px',
                      color: '#7F8FA4',
                    }}
                  >
                    Showing {startIndex + 1}-{Math.min(endIndex, filteredAndSortedData.length)} of {filteredAndSortedData.length} orders
                  </span>

                  {/* Pagination controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      style={{
                        fontFamily: 'DM Sans',
                        fontSize: '14px',
                        fontWeight: 500,
                        color: currentPage === 1 ? '#C3CDD9' : '#7F8FA4',
                        background: 'none',
                        border: 'none',
                        cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                        padding: '8px 12px',
                      }}
                    >
                      Previous
                    </button>

                    {getPageNumbers().map((page, index) => (
                      typeof page === 'number' ? (
                        <button
                          key={index}
                          onClick={() => setCurrentPage(page)}
                          style={{
                            fontFamily: 'DM Sans',
                            fontSize: '14px',
                            fontWeight: 500,
                            color: currentPage === page ? '#1C58F7' : '#7F8FA4',
                            background: currentPage === page ? '#EAF1FF' : 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            minWidth: '36px',
                          }}
                        >
                          {page}
                        </button>
                      ) : (
                        <span
                          key={index}
                          style={{
                            fontFamily: 'DM Sans',
                            fontSize: '14px',
                            color: '#7F8FA4',
                            padding: '8px 4px',
                          }}
                        >
                          ...
                        </span>
                      )
                    ))}

                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      style={{
                        fontFamily: 'DM Sans',
                        fontSize: '14px',
                        fontWeight: 500,
                        color: currentPage === totalPages ? '#C3CDD9' : '#7F8FA4',
                        background: 'none',
                        border: 'none',
                        cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                        padding: '8px 12px',
                      }}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications Panel */}
      <NotificationsPanel
        isOpen={isNotificationsPanelOpen}
        onClose={() => setIsNotificationsPanelOpen(false)}
      />

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .orders-table-scroll::-webkit-scrollbar {
          height: 8px;
        }
        .orders-table-scroll::-webkit-scrollbar-track {
          background: ${neutral[100]};
          border-radius: 4px;
        }
        .orders-table-scroll::-webkit-scrollbar-thumb {
          background: ${neutral[400]};
          border-radius: 4px;
        }
        .orders-table-scroll::-webkit-scrollbar-thumb:hover {
          background: ${neutral[500]};
        }
      `}</style>
    </div>
  );
}
