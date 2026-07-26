'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import Form from '@cloudscape-design/components/form';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Button from '@cloudscape-design/components/button';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import FormField from '@cloudscape-design/components/form-field';
import Input from '@cloudscape-design/components/input';
import Alert from '@cloudscape-design/components/alert';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login({ username, password });
      router.push('/hosted-zones');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#0f1b2a' }}>
      <div style={{ width: '100%', maxWidth: '420px', padding: '20px' }}>
        
        {/* AWS Smile Logo Placeholder using CSS */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <svg width="64" height="64" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 80C75 80 90 65 90 65C90 65 78 72 50 72C22 72 10 65 10 65C10 65 25 80 50 80Z" fill="#FF9900"/>
            <path d="M85 55L95 65L80 75" fill="#FF9900"/>
            <text x="50" y="45" fontFamily="Arial" fontSize="28" fontWeight="bold" fill="#FFFFFF" textAnchor="middle">AWS</text>
          </svg>
        </div>

        <form onSubmit={handleSubmit}>
          <Container 
            header={<Header variant="h2">Sign in as IAM user</Header>}
            footer={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px' }}>
                <a href="#" style={{ color: '#0972d3', textDecoration: 'none', fontSize: '14px' }}>Forgot password?</a>
                <Button variant="primary" loading={isSubmitting}>Sign in</Button>
              </div>
            }
          >
            <SpaceBetween direction="vertical" size="l">
              {error && <Alert type="error" header="Sign in failed">{error}</Alert>}
              
              <FormField label="Account ID (12 digits) or account alias">
                <Input
                  value="8219-3281-9921"
                  onChange={() => {}}
                  disabled={true}
                />
              </FormField>

              <FormField label="IAM user name">
                <Input
                  value={username}
                  onChange={({ detail }) => setUsername(detail.value)}
                  placeholder="admin"
                />
              </FormField>
              
              <FormField label="Password">
                <Input
                  value={password}
                  onChange={({ detail }) => setPassword(detail.value)}
                  type="password"
                  placeholder="••••••••"
                />
              </FormField>
            </SpaceBetween>
          </Container>
        </form>
      </div>
    </div>
  );
}
