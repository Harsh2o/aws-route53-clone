'use client';

import React from 'react';
import { AwsShell } from '@/components/aws-shell';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Button from '@cloudscape-design/components/button';
import Link from '@cloudscape-design/components/link';
import Grid from '@cloudscape-design/components/grid';
import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/api';
import { HostedZone, PaginatedResponse } from '@/types/api';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { useEffect } from 'react';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const { data, isLoading: isDataLoading } = useQuery({
    queryKey: ['hosted-zones-dashboard'],
    queryFn: () => apiGet<PaginatedResponse<HostedZone>>('/api/v1/hosted-zones?page=1&size=1'),
    enabled: !!user,
  });

  if (loading || !user) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#0f1b2a', color: '#fff' }}>
        Loading...
      </div>
    );
  }

  return (
    <AwsShell breadcrumbs={[{ text: 'Route 53', href: '/' }, { text: 'Dashboard', href: '/' }]}>
      <SpaceBetween size="xl">
        <Box padding={{ top: 'm' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Header variant="h1">Route 53 Dashboard</Header>
          </div>
        </Box>
        
        <Grid
          gridDefinition={[
            { colspan: { default: 12, s: 6, m: 3 } },
            { colspan: { default: 12, s: 6, m: 3 } },
            { colspan: { default: 12, s: 6, m: 3 } },
            { colspan: { default: 12, s: 6, m: 3 } }
          ]}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0 16px' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', fontWeight: 'bold' }}>DNS management</h3>
            <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: '#aab7b8', flex: 1 }}>
              A hosted zone tells Route 53 how to respond to DNS queries for a domain such as example.com.
              <br /><br />
              Hosted zones: <strong>{isDataLoading ? '...' : (data?.total || 0)}</strong>
            </p>
            <Button onClick={() => router.push('/hosted-zones')}>Create hosted zone</Button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0 16px' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', fontWeight: 'bold' }}>Availability monitoring</h3>
            <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: '#aab7b8', flex: 1 }}>
              Health checks monitor your applications and web resources, and direct DNS queries to healthy resources.
            </p>
            <Button disabled>Create health check</Button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0 16px' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', fontWeight: 'bold' }}>Traffic management</h3>
            <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: '#aab7b8', flex: 1 }}>
              A visual tool that lets you easily create policies for multiple endpoints in complex configurations.
            </p>
            <Button disabled>Create policy</Button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0 16px' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', fontWeight: 'bold' }}>Domain registration</h3>
            <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: '#aab7b8', flex: 1 }}>
              A domain is the name, such as example.com, that your users use to access your application.
            </p>
            <Button disabled>Register domain</Button>
          </div>
        </Grid>

        <Container header={<Header variant="h2">Register domain</Header>}>
          <SpaceBetween size="m">
            <div>
              Find and register an available domain, or <Link href="#">transfer your existing domains</Link> to Route 53.
            </div>
            
            <div style={{ border: '1px solid #414d5c', borderRadius: '8px', padding: '0', display: 'flex', overflow: 'hidden' }}>
              <input 
                type="text" 
                placeholder="example.com" 
                style={{ flex: 1, padding: '12px 16px', background: 'transparent', border: 'none', color: '#fff', fontSize: '14px', outline: 'none' }}
              />
            </div>
            
            <div style={{ fontSize: '12px', color: '#aab7b8', lineHeight: '1.4' }}>
              Each label (each part between dots) can be up to 63 characters long and must start with a-z or 0-9. Maximum length: 255 characters, including dots. Valid characters: a-z, 0-9, and - (hyphen)
            </div>
            
            <div>
              <Button disabled>Check</Button>
            </div>
          </SpaceBetween>
        </Container>

        <Container 
          header={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Header variant="h2">Notifications</Header>
              <Button iconName="refresh" variant="icon" />
            </div>
          }
        >
          <SpaceBetween size="l">
            <div style={{ display: 'flex', border: '1px solid #414d5c', borderRadius: '8px', padding: '6px 12px', alignItems: 'center' }}>
              <svg width="14" height="14" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px', color: '#aab7b8' }}>
                <path d="M10.435 9.385l3.87 3.869-1.05 1.05-3.87-3.87A5.5 5.5 0 1111.5 5.5a5.47 5.47 0 01-1.065 3.885zM5.5 10A4.5 4.5 0 105.5 1a4.5 4.5 0 000 9z" fill="currentColor"/>
              </svg>
              <input 
                type="text" 
                placeholder="Find notifications" 
                style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', outline: 'none', fontSize: '14px' }} 
              />
            </div>
            
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #414d5c' }}>
                  <th style={{ padding: '8px 0', color: '#aab7b8', fontWeight: 'bold' }}>Resource</th>
                  <th style={{ padding: '8px 0', color: '#aab7b8', fontWeight: 'bold' }}>Status</th>
                  <th style={{ padding: '8px 0', color: '#aab7b8', fontWeight: 'bold' }}>Last update</th>
                </tr>
              </thead>
              <tbody>
                {/* Empty state implicitly shown by no rows */}
              </tbody>
            </table>
          </SpaceBetween>
        </Container>
      </SpaceBetween>
    </AwsShell>
  );
}
