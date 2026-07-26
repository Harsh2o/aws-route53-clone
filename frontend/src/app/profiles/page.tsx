'use client';

import React from 'react';
import { AwsShell } from '@/components/aws-shell';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';

export default function ProfilesPage() {
  return (
    <AwsShell breadcrumbs={[{ text: 'Route 53', href: '/' }, { text: 'Profiles', href: '/profiles' }]}>
      <Container
        header={<Header variant="h2">Profiles</Header>}
      >
        <Box textAlign="center" padding={{ top: 'xxl', bottom: 'xxl' }}>
          <Box variant="h3" padding={{ bottom: 's' }}>
            Profiles coming soon
          </Box>
          <Box color="text-body-secondary" padding={{ bottom: 'm' }}>
            Manage DNS profiles for your AWS resources.
          </Box>
          <Button disabled>Create profile</Button>
        </Box>
      </Container>
    </AwsShell>
  );
}
