'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import AppLayout, { AppLayoutProps } from '@cloudscape-design/components/app-layout';
import TopNavigation from '@cloudscape-design/components/top-navigation';
import SideNavigation from '@cloudscape-design/components/side-navigation';
import { useAuth } from '@/contexts/auth-context';
import BreadcrumbGroup, { BreadcrumbGroupProps } from '@cloudscape-design/components/breadcrumb-group';

interface AwsShellProps {
  children: React.ReactNode;
  breadcrumbs?: BreadcrumbGroupProps.Item[] | React.ReactNode;
  tools?: AppLayoutProps['tools'];
  toolsOpen?: boolean;
  onToolsChange?: (event: { detail: { open: boolean } }) => void;
}

export function AwsShell({ 
  children, 
  breadcrumbs, 
  tools,
  toolsOpen,
  onToolsChange 
}: AwsShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleSignOut = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <>
      <div id="top-nav" className="awsui-dark-mode">
        <TopNavigation
          identity={{
            href: '/',
            title: 'Route 53',
            logo: {
              src: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg',
              alt: 'AWS'
            }
          }}
          utilities={[
            {
              type: 'menu-dropdown',
              text: user?.username || 'Guest',
              iconName: 'user-profile',
              onItemClick: (e) => {
                if (e.detail.id === 'signout') {
                  handleSignOut();
                }
              },
              items: user
                ? [
                    { id: 'profile', text: 'Profile' },
                    { id: 'signout', text: 'Sign out' },
                  ]
                : [{ id: 'signin', text: 'Sign in', href: '/login' }],
            },
          ]}
          i18nStrings={{
            searchIconAriaLabel: 'Search',
            searchDismissIconAriaLabel: 'Close search',
            overflowMenuTriggerText: 'More',
          }}
        />
      </div>
      <AppLayout
        headerSelector="#top-nav"
        breadcrumbs={Array.isArray(breadcrumbs) ? <BreadcrumbGroup items={breadcrumbs as BreadcrumbGroupProps.Item[]} /> : breadcrumbs}
        navigation={
          <SideNavigation
            activeHref={pathname}
            onFollow={(e) => {
              if (!e.detail.external) {
                e.preventDefault();
                router.push(e.detail.href);
              }
            }}
            items={[
              { type: 'link', text: 'Dashboard', href: '/' },
              { type: 'link', text: 'Hosted zones', href: '/hosted-zones' },
              { type: 'link', text: 'Health checks', href: '/health-checks' },
              {
                type: 'section',
                text: 'Traffic management',
                items: [
                  { type: 'link', text: 'Traffic policies', href: '/traffic-policies' },
                ],
              },
              {
                type: 'section',
                text: 'Routing control',
                items: [
                  { type: 'link', text: 'Application recovery', href: '#' },
                ],
              },
              {
                type: 'section',
                text: 'Resolver',
                items: [
                  { type: 'link', text: 'VPCs and inbound endpoints', href: '/resolver' },
                  { type: 'link', text: 'Outbound endpoints', href: '#' },
                  { type: 'link', text: 'Rules', href: '#' },
                  { type: 'link', text: 'DNS Firewall', href: '#' },
                ],
              },
              {
                type: 'section',
                text: 'Domains',
                items: [
                  { type: 'link', text: 'Registered domains', href: '#' },
                  { type: 'link', text: 'Pending requests', href: '#' },
                  { type: 'link', text: 'Transfer in', href: '#' },
                ],
              },
              { type: 'link', text: 'Profiles', href: '/profiles' },
            ]}
            header={{ href: '/', text: 'Route 53' }}
          />
        }
        tools={tools}
        toolsOpen={toolsOpen}
        toolsHide={true}
        onToolsChange={onToolsChange}
        content={children}
      />
    </>
  );
}
