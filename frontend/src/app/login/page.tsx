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
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8f8f8', 
      fontFamily: '"Helvetica Neue", Roboto, Arial, sans-serif', 
      color: '#16191f', 
      position: 'relative',
      /* Subtle isometric cube background using SVG pattern */
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='104' viewBox='0 0 60 104' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 17.32L60 34.64v34.64L30 86.6L0 69.28V34.64L30 17.32zM30 23.1L5 37.53v28.87L30 80.83l25-14.43V37.53L30 23.1z' fill='%23000000' fill-opacity='0.02' fill-rule='evenodd'/%3E%3Cpath d='M30 52l25-14.43M30 52L5 37.53M30 52v28.83' stroke='%23000000' stroke-opacity='0.02' stroke-width='1'/%3E%3C/svg%3E")`
    }}>
      
      {/* Top Navigation Bar */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '16px 40px', fontSize: '13px', fontWeight: '700', color: '#0073bb', gap: '24px' }}>
        <span style={{ cursor: 'pointer' }}>Provide feedback</span>
        <span style={{ cursor: 'pointer' }}>Multi-session disabled ▼</span>
        <span style={{ cursor: 'pointer' }}>English ▼</span>
      </div>

      {/* Centered Logo */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px', marginBottom: '30px' }}>
        <svg width="60" height="36" viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 48C75 48 90 33 90 33C90 33 78 40 50 40C22 40 10 33 10 33C10 33 25 48 50 48Z" fill="#FF9900"/>
          <path d="M85 23L95 33L80 43" fill="#FF9900"/>
          <text x="50" y="25" fontFamily="Arial, sans-serif" fontSize="28" fontWeight="bold" fill="#232F3E" textAnchor="middle">aws</text>
        </svg>
      </div>

      {/* Main Content Area */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', gap: '20px', maxWidth: '880px', width: '100%' }}>
          
          {/* Left Column: Form */}
          <div style={{ flex: '0 0 380px' }}>
            <div style={{ 
              backgroundColor: '#ffffff', 
              borderRadius: '8px', 
              padding: '32px',
              border: '1px solid #d5dbdb',
              boxShadow: '0 1px 1px 0 rgba(0,28,36,.3), 1px 1px 1px 0 rgba(0,28,36,.15), -1px 1px 1px 0 rgba(0,28,36,.15)'
            }}>
              <h1 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: '700', color: '#16191f' }}>Sign In</h1>
              <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: '#16191f' }}>Access your AWS account by user type.</p>
              
              {error && (
                <div style={{ backgroundColor: '#fdf3f3', border: '1px solid #d13212', color: '#d13212', padding: '12px', borderRadius: '4px', marginBottom: '20px', fontSize: '13px' }}>
                  <strong style={{ display: 'block', marginBottom: '4px' }}>Sign in failed</strong>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '13px', marginBottom: '8px', color: '#16191f' }}>
                    User type (<span style={{ textDecoration: 'underline', cursor: 'pointer', color: '#545b64' }}>not sure?</span>)
                  </div>

                  {/* Root User (Unselected) */}
                  <div style={{ 
                    border: '1px solid #d5dbdb', 
                    borderRadius: '8px', 
                    padding: '12px 16px', 
                    marginBottom: '8px',
                    backgroundColor: '#ffffff',
                    cursor: 'pointer'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                      <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid #545b64', marginRight: '12px', marginTop: '2px' }}></div>
                      <div>
                        <div style={{ fontWeight: '400', fontSize: '13px', color: '#16191f' }}>Root user</div>
                        <div style={{ fontSize: '12px', color: '#545b64', marginTop: '2px', lineHeight: '1.4' }}>Account owner that performs tasks requiring unrestricted access.</div>
                      </div>
                    </div>
                  </div>

                  {/* IAM User (Selected) */}
                  <div style={{ 
                    border: '2px solid #0073bb', 
                    borderRadius: '8px', 
                    padding: '13px 16px', 
                    cursor: 'pointer',
                    backgroundColor: '#f2f8fd'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                      <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid #0073bb', marginRight: '12px', marginTop: '2px', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
                        <div style={{ width: '8px', height: '8px', backgroundColor: '#0073bb', borderRadius: '50%' }}></div>
                      </div>
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '13px', color: '#16191f' }}>IAM user</div>
                        <div style={{ fontSize: '12px', color: '#545b64', marginTop: '2px', lineHeight: '1.4' }}>User within an account that performs daily tasks.</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontWeight: '700', fontSize: '13px', marginBottom: '6px', color: '#16191f' }}>IAM user name</label>
                  <input 
                    type="text" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #879596', fontSize: '13px', outline: 'none', backgroundColor: '#ffffff', color: '#16191f' }}
                    placeholder="admin"
                  />
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label style={{ fontWeight: '700', fontSize: '13px', color: '#16191f' }}>Password</label>
                    <a href="#" style={{ color: '#0073bb', textDecoration: 'none', fontSize: '12px' }}>Forgot password?</a>
                  </div>
                  <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #879596', fontSize: '13px', outline: 'none', backgroundColor: '#ffffff', color: '#16191f' }}
                    placeholder="admin123"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  style={{ 
                    width: '100%', 
                    backgroundColor: '#ff9900', 
                    color: '#16191f', 
                    border: '1px solid #ff9900', 
                    borderRadius: '24px', 
                    padding: '8px', 
                    fontSize: '13px', 
                    fontWeight: '700',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    opacity: isSubmitting ? 0.7 : 1,
                    marginBottom: '16px'
                  }}
                >
                  {isSubmitting ? 'Signing in...' : 'Sign in'}
                </button>

                <div style={{ display: 'flex', alignItems: 'center', margin: '16px 0' }}>
                  <div style={{ flex: 1, height: '1px', backgroundColor: '#eaeded' }}></div>
                  <div style={{ padding: '0 12px', fontSize: '12px', fontWeight: '700', color: '#16191f' }}>OR</div>
                  <div style={{ flex: 1, height: '1px', backgroundColor: '#eaeded' }}></div>
                </div>

                <button 
                  type="button"
                  style={{ 
                    width: '100%', 
                    backgroundColor: '#ffffff', 
                    color: '#0073bb', 
                    border: '1px solid #0073bb', 
                    borderRadius: '24px', 
                    padding: '8px', 
                    fontSize: '13px', 
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  New to AWS? Sign up
                </button>
              </form>
            </div>

            <div style={{ fontSize: '11px', color: '#545b64', textAlign: 'center', marginTop: '16px', lineHeight: '1.4' }}>
              By continuing, you agree to <a href="#" style={{ color: '#0073bb', textDecoration: 'underline' }}>AWS Customer Agreement</a> or<br/>
              other agreement for AWS services, and the <a href="#" style={{ color: '#0073bb', textDecoration: 'underline' }}>Privacy Notice</a>.<br/>
              This site uses essential cookies. See our <a href="#" style={{ color: '#0073bb', textDecoration: 'underline' }}>Cookie Notice</a> for<br/>
              more information.
            </div>
          </div>

          {/* Right Side: Marketing Banner */}
          <div style={{ 
            flex: '1 1 0', 
            background: 'linear-gradient(135deg, #f4d9f9 0%, #e2e8f7 50%, #d4ebfd 100%)',
            padding: '48px 40px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            height: '460px' // Align perfectly with left box
          }}>
            {/* Background vector graphics from screenshot */}
            <div style={{ position: 'absolute', right: '-40px', top: '20px', opacity: 0.15 }}>
              <svg width="240" height="240" viewBox="0 0 100 100">
                <path d="M50 5L90 28.094v46.188L50 97.376 10 74.282V28.094L50 5z" fill="none" stroke="#0073bb" strokeWidth="2.5"/>
              </svg>
            </div>
            <div style={{ position: 'absolute', right: '20px', top: '50px', opacity: 0.15 }}>
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#0073bb" strokeWidth="2">
                <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z"/>
              </svg>
            </div>
            
            <h2 style={{ fontSize: '36px', fontWeight: '800', lineHeight: 1.15, marginBottom: '20px', color: '#16191f', zIndex: 1 }}>
              Everything you<br/>need for getting<br/>agents to production
            </h2>
            <p style={{ fontSize: '16px', color: '#16191f', marginBottom: '32px', lineHeight: 1.5, maxWidth: '300px', zIndex: 1 }}>
              Build, connect, and optimize AI<br/>agents. Any framework, any model,<br/>security built in from the start.
            </p>
            <div style={{ zIndex: 1 }}>
              <button style={{ 
                backgroundColor: '#f8f8f8', 
                color: '#16191f', 
                border: '1px solid #7c6cfc', 
                borderRadius: '24px', 
                padding: '10px 24px', 
                fontSize: '14px', 
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 2px 5px rgba(124,108,252,0.2)'
              }}>
                Start building with AgentCore
              </button>
            </div>
          </div>

        </div>
      </div>
      
      {/* Footer Copyright */}
      <div style={{ width: '100%', textAlign: 'center', position: 'absolute', bottom: '16px', fontSize: '11px', color: '#545b64' }}>
        © 2026 Amazon Web Services, Inc. or its affiliates. All rights reserved.
      </div>
    </div>
  );
}
