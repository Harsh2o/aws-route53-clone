'use client';

import React from 'react';
import { AwsShell } from '@/components/aws-shell';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';

export default function HealthChecksPage() {
  return (
    <AwsShell breadcrumbs={[{ text: 'Route 53', href: '/' }, { text: 'Health checks', href: '/health-checks' }]}>
      <Container
        header={<Header variant="h2">Health checks</Header>}
      >
        <Box textAlign="center" padding={{ top: 'xxl', bottom: 'xxl' }}>
          <Box variant="h3" padding={{ bottom: 's' }}>
            Health checks coming soon
          </Box>
          <Box color="text-body-secondary" padding={{ bottom: 'm' }}>
            Monitor the health and performance of your web applications, web servers, and other resources.
          </Box>
          <Button disabled>Create health check</Button>
        </Box>
      </Container>
    </AwsShell>
  );
}
