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
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', backgroundColor: '#ffffff', paddingTop: '40px' }}>
      
      {/* Authentic AWS Smile Logo */}
      <div style={{ marginBottom: '24px' }}>
        <svg width="60" height="36" viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 48C75 48 90 33 90 33C90 33 78 40 50 40C22 40 10 33 10 33C10 33 25 48 50 48Z" fill="#FF9900"/>
          <path d="M85 23L95 33L80 43" fill="#FF9900"/>
          <text x="50" y="25" fontFamily="Arial, sans-serif" fontSize="28" fontWeight="bold" fill="#232F3E" textAnchor="middle">AWS</text>
        </svg>
      </div>

      <div style={{ width: '100%', maxWidth: '380px' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ 
            backgroundColor: '#ffffff', 
            border: '1px solid #d5dbdb', 
            borderRadius: '8px', 
            padding: '32px 24px',
            boxShadow: '0 1px 1px 0 rgba(0,28,36,.3), 1px 1px 1px 0 rgba(0,28,36,.15), -1px 1px 1px 0 rgba(0,28,36,.15)'
          }}>
            <h1 style={{ margin: '0 0 24px 0', fontSize: '24px', fontWeight: '400', color: '#0f1b2a', fontFamily: '"Helvetica Neue", Roboto, Arial, sans-serif' }}>
              Sign in
            </h1>

            {error && (
              <div style={{ marginBottom: '20px' }}>
                <Alert type="error" header="There was a problem">{error}</Alert>
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '12px' }}>
                <input type="radio" id="root" name="user_type" style={{ marginTop: '4px', marginRight: '8px' }} disabled />
                <div>
                  <label htmlFor="root" style={{ display: 'block', fontWeight: 'bold', color: '#0f1b2a', marginBottom: '2px', fontSize: '14px' }}>Root user</label>
                  <span style={{ color: '#545b64', fontSize: '12px' }}>Account owner that performs tasks requiring unrestricted access.</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <input type="radio" id="iam" name="user_type" defaultChecked style={{ marginTop: '4px', marginRight: '8px' }} />
                <div>
                  <label htmlFor="iam" style={{ display: 'block', fontWeight: 'bold', color: '#0f1b2a', marginBottom: '2px', fontSize: '14px' }}>IAM user</label>
                  <span style={{ color: '#545b64', fontSize: '12px' }}>User within an account that performs daily tasks.</span>
                </div>
              </div>
            </div>

            <SpaceBetween direction="vertical" size="m">
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', color: '#0f1b2a', marginBottom: '4px', fontSize: '14px' }}>
                  Account ID (12 digits) or account alias
                </label>
                <Input value="8219-3281-9921" onChange={() => {}} disabled={true} />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 'bold', color: '#0f1b2a', marginBottom: '4px', fontSize: '14px' }}>
                  IAM user name
                </label>
                <Input value={username} onChange={({ detail }) => setUsername(detail.value)} placeholder="admin" />
              </div>
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <label style={{ fontWeight: 'bold', color: '#0f1b2a', fontSize: '14px' }}>Password</label>
                  <a href="#" style={{ color: '#0073bb', textDecoration: 'none', fontSize: '12px' }}>Forgot password?</a>
                </div>
                <Input value={password} onChange={({ detail }) => setPassword(detail.value)} type="password" placeholder="••••••••" />
              </div>
            </SpaceBetween>

            <div style={{ marginTop: '32px' }}>
              <Button variant="primary" loading={isSubmitting} fullWidth>Sign in</Button>
            </div>
          </div>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '12px', color: '#545b64' }}>
          <p style={{ margin: '0 0 12px 0' }}>New to AWS?</p>
          <Button>Create a new AWS account</Button>
        </div>
      </div>
    </div>
  );
}
