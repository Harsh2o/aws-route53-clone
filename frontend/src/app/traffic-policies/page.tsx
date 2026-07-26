'use client';

import React from 'react';
import { AwsShell } from '@/components/aws-shell';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';

export default function TrafficPoliciesPage() {
  return (
    <AwsShell breadcrumbs={[{ text: 'Route 53', href: '/' }, { text: 'Traffic policies', href: '/traffic-policies' }]}>
      <Container
        header={<Header variant="h2">Traffic policies</Header>}
      >
        <Box textAlign="center" padding={{ top: 'xxl', bottom: 'xxl' }}>
          <Box variant="h3" padding={{ bottom: 's' }}>
            Traffic policies coming soon
          </Box>
          <Box color="text-body-secondary" padding={{ bottom: 'm' }}>
            You can create complex routing configurations using traffic policies.
          </Box>
          <Button disabled>Create traffic policy</Button>
        </Box>
      </Container>
    </AwsShell>
  );
}
