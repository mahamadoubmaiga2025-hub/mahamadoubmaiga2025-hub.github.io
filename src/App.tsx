import React from 'react';
import { AppProvider, useApp } from '@/hooks/useApp';
import AppLayout from '@/layouts/AppLayout';
import LandingPage from '@/pages/Landing';
import { LoginPage, RegisterPage, OnboardingPage } from '@/pages/Auth';
import DashboardPage from '@/pages/Dashboard';
import WalletPage from '@/pages/Wallet';
import ConvertPage from '@/pages/Convert';
import SendReceivePage from '@/pages/SendReceive';
import MobileMoneyPage from '@/pages/MobileMoney';
import MerchantPage from '@/pages/Merchant';
import TransactionsPage from '@/pages/Transactions';
import AnalyticsPage from '@/pages/Analytics';
import AfriAIPage from '@/pages/AfriAI';
import APIPage from '@/pages/APIPage';
import SecurityPage from '@/pages/Security';
import SettingsPage from '@/pages/Settings';
import TokenPage from '@/pages/Token';
import AdminPage from '@/pages/Admin';

function AppRouter() {
  const { state } = useApp();
  const { view, isAuthenticated } = state;

  // Public views
  if (view === 'landing') return <LandingPage />;
  if (view === 'login') return <LoginPage />;
  if (view === 'register') return <RegisterPage />;
  if (view === 'onboarding') return <OnboardingPage />;

  // Redirect to login if not auth
  if (!isAuthenticated) return <LoginPage />;

  const pageMap: Record<string, React.ReactNode> = {
    dashboard: <DashboardPage />,
    wallet: <WalletPage />,
    buy: <MobileMoneyPage />,
    sell: <MobileMoneyPage />,
    convert: <ConvertPage />,
    send: <SendReceivePage />,
    receive: <SendReceivePage />,
    payments: <MobileMoneyPage />,
    merchant: <MerchantPage />,
    transactions: <TransactionsPage />,
    analytics: <AnalyticsPage />,
    ai: <AfriAIPage />,
    api: <APIPage />,
    token: <TokenPage />,
    security: <SecurityPage />,
    settings: <SettingsPage />,
    admin: <AdminPage />,
  };

  return (
    <AppLayout>
      {pageMap[view] ?? <DashboardPage />}
    </AppLayout>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}
