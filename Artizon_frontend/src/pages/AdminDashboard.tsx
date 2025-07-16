
import React, { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { DashboardStats } from '@/components/admin/DashboardStats';
import { SalesChart } from '@/components/admin/SalesChart';
import { CategorySalesChart } from '@/components/admin/CategorySalesChart';
import { ArtisanMap } from '@/components/admin/ArtisanMap';
import { QuickActions } from '@/components/admin/QuickActions';
import { RecentActivity } from '@/components/admin/RecentActivity';
import { SystemAlerts } from '@/components/admin/SystemAlerts';
import { PendingApprovals } from '@/components/admin/PendingApprovals';

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Dashboard Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de bord Super Admin</h1>
          <p className="text-gray-600">Vue d'ensemble complète de la plateforme Artizone</p>
        </div>

        {/* Key Statistics */}
        <DashboardStats />

        {/* System Alerts and Pending Approvals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SystemAlerts />
          <PendingApprovals />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SalesChart />
          <CategorySalesChart />
        </div>

        {/* Map and Activity Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ArtisanMap />
          <RecentActivity />
        </div>

        {/* Quick Actions */}
        <QuickActions />
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
