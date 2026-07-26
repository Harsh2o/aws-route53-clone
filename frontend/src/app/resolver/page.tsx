'use client';

import React from 'react';
import { AwsShell } from '@/components/aws-shell';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';

export default function ResolverPage() {
  return (
    <AwsShell breadcrumbs={[{ text: 'Route 53', href: '/' }, { text: 'Resolver', href: '/resolver' }]}>
      <Container
        header={<Header variant="h2">Resolver</Header>}
      >
        <Box textAlign="center" padding={{ top: 'xxl', bottom: 'xxl' }}>
          <Box variant="h3" padding={{ bottom: 's' }}>
            Resolver coming soon
          </Box>
          <Box color="text-body-secondary" padding={{ bottom: 'm' }}>
            Configure inbound and outbound endpoints to resolve DNS queries between your VPCs and your network.
          </Box>
          <Button disabled>Configure endpoints</Button>
        </Box>
      </Container>
    </AwsShell>
  );
}
