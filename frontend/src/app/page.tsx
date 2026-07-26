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

export default function DashboardPage() {
  const router = useRouter();
  
  const { data, isLoading } = useQuery({
    queryKey: ['hosted-zones-dashboard'],
    queryFn: () => apiGet<PaginatedResponse<HostedZone>>('/api/v1/hosted-zones?page=1&size=1'),
  });

  return (
    <AwsShell breadcrumbs={[{ text: 'Route 53', href: '/' }, { text: 'Dashboard', href: '/' }]}>
      <SpaceBetween size="l">
        <Box padding={{ top: 'm', bottom: 's' }}>
          <Header
            variant="h1"
            description="Amazon Route 53 is a highly available and scalable cloud Domain Name System (DNS) web service. It is designed to give developers and businesses an extremely reliable and cost effective way to route end users to Internet applications."
          >
            Route 53 dashboard
          </Header>
        </Box>
        
        <Grid
          gridDefinition={[
            { colspan: { default: 12, s: 6, m: 3 } },
            { colspan: { default: 12, s: 6, m: 3 } },
            { colspan: { default: 12, s: 6, m: 3 } },
            { colspan: { default: 12, s: 6, m: 3 } }
          ]}
        >
          <Container
            header={<Header variant="h2">DNS management</Header>}
            footer={
              <SpaceBetween direction="horizontal" size="xs">
                <Button variant="primary" onClick={() => router.push('/hosted-zones')}>
                  Create hosted zone
                </Button>
              </SpaceBetween>
            }
          >
            <SpaceBetween size="s">
              <Box>
                Route 53 translates domain names into IP addresses.
                <br /><br />
                Hosted zones: <Link href="/hosted-zones"><strong>{isLoading ? '...' : (data?.total || 0)}</strong></Link>
              </Box>
            </SpaceBetween>
          </Container>

          <Container
            header={<Header variant="h2">Traffic management</Header>}
            footer={
              <SpaceBetween direction="horizontal" size="xs">
                <Button disabled>Create traffic policy</Button>
              </SpaceBetween>
            }
          >
            <SpaceBetween size="s">
              <Box>
                Route traffic based on multiple criteria, such as endpoint health, geographic location, and latency.
                <br /><br />
                Traffic policies: <Link href="/traffic-policies"><strong>0</strong></Link>
              </Box>
            </SpaceBetween>
          </Container>

          <Container
            header={<Header variant="h2">Availability monitoring</Header>}
            footer={
              <SpaceBetween direction="horizontal" size="xs">
                <Button disabled>Create health check</Button>
              </SpaceBetween>
            }
          >
            <SpaceBetween size="s">
              <Box>
                Monitor the health and performance of your applications.
                <br /><br />
                Health checks: <Link href="/health-checks"><strong>0</strong></Link>
              </Box>
            </SpaceBetween>
          </Container>

          <Container
            header={<Header variant="h2">Routing control</Header>}
            footer={
              <SpaceBetween direction="horizontal" size="xs">
                <Button disabled>Create cluster</Button>
              </SpaceBetween>
            }
          >
            <SpaceBetween size="s">
              <Box>
                Use routing control to fail over traffic in case of an application failure.
                <br /><br />
                Clusters: <Link href="#"><strong>0</strong></Link>
              </Box>
            </SpaceBetween>
          </Container>
        </Grid>
      </SpaceBetween>
    </AwsShell>
  );
}
