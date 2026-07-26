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
    <div style={{ minHeight: '100vh', backgroundColor: '#fcfcfc', fontFamily: '"Helvetica Neue", Roboto, Arial, sans-serif', color: '#16191f', position: 'relative', backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(240, 242, 245, 0.4) 0%, transparent 50%), radial-gradient(circle at 90% 80%, rgba(240, 242, 245, 0.4) 0%, transparent 50%)' }}>
      
      {/* Top Navigation Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', position: 'absolute', top: 0, left: 0, right: 0 }}>
        <div style={{ flex: 1 }}></div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <svg width="60" height="36" viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 48C75 48 90 33 90 33C90 33 78 40 50 40C22 40 10 33 10 33C10 33 25 48 50 48Z" fill="#FF9900"/>
            <path d="M85 23L95 33L80 43" fill="#FF9900"/>
            <text x="50" y="25" fontFamily="Arial, sans-serif" fontSize="28" fontWeight="bold" fill="#232F3E" textAnchor="middle">AWS</text>
          </svg>
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', gap: '20px', fontSize: '14px', fontWeight: 'bold', color: '#0073bb' }}>
          <span style={{ cursor: 'pointer' }}>Provide feedback</span>
          <span style={{ cursor: 'pointer' }}>Multi-session disabled ▼</span>
          <span style={{ cursor: 'pointer' }}>English ▼</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '80px 20px 20px 20px' }}>
        <div style={{ display: 'flex', gap: '40px', maxWidth: '1000px', width: '100%', alignItems: 'center' }}>
          
          {/* Left Column */}
          <div style={{ flex: '0 0 420px' }}>
            <div style={{ 
              backgroundColor: '#ffffff', 
              borderRadius: '12px', 
              padding: '40px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.05)',
              border: '1px solid #eaeded'
            }}>
              <h1 style={{ margin: '0 0 8px 0', fontSize: '22px', fontWeight: 'bold' }}>Sign In</h1>
              <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: '#545b64' }}>Access your AWS account by user type.</p>
              
              {error && (
                <div style={{ backgroundColor: '#fdf3f3', border: '1px solid #d13212', color: '#d13212', padding: '12px', borderRadius: '4px', marginBottom: '20px', fontSize: '14px' }}>
                  <strong style={{ display: 'block', marginBottom: '4px' }}>Sign in failed</strong>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '14px', marginBottom: '8px' }}>
                    User type (<span style={{ textDecoration: 'underline', cursor: 'pointer', color: '#545b64' }}>not sure?</span>)
                  </div>

                  <div style={{ 
                    border: '1px solid #eaeded', 
                    borderRadius: '8px', 
                    padding: '16px', 
                    marginBottom: '12px',
                    cursor: 'pointer'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                      <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid #545b64', marginRight: '12px', marginTop: '2px' }}></div>
                      <div>
                        <div style={{ fontWeight: 'bold', fontSize: '14px' }}>Root user</div>
                        <div style={{ fontSize: '12px', color: '#545b64', marginTop: '2px' }}>Account owner that performs tasks requiring unrestricted access.</div>
                      </div>
                    </div>
                  </div>

                  <div style={{ 
                    border: '2px solid #0073bb', 
                    borderRadius: '8px', 
                    padding: '15px', 
                    backgroundColor: '#f7faff',
                    cursor: 'pointer'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                      <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid #0073bb', marginRight: '12px', marginTop: '2px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <div style={{ width: '8px', height: '8px', backgroundColor: '#0073bb', borderRadius: '50%' }}></div>
                      </div>
                      <div>
                        <div style={{ fontWeight: 'bold', fontSize: '14px' }}>IAM user</div>
                        <div style={{ fontSize: '12px', color: '#545b64', marginTop: '2px' }}>User within an account that performs daily tasks.</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', fontSize: '14px', marginBottom: '6px', color: '#16191f' }}>IAM user name</label>
                  <input 
                    type="text" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '4px', border: '1px solid #879596', fontSize: '14px', outline: 'none', backgroundColor: '#ffffff', color: '#16191f' }}
                    placeholder="admin"
                  />
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', fontSize: '14px', marginBottom: '6px', color: '#16191f' }}>Password</label>
                  <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '4px', border: '1px solid #879596', fontSize: '14px', outline: 'none', backgroundColor: '#ffffff', color: '#16191f' }}
                    placeholder="••••••••"
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
                    padding: '10px', 
                    fontSize: '14px', 
                    fontWeight: 'bold',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    opacity: isSubmitting ? 0.7 : 1,
                    marginBottom: '20px'
                  }}
                >
                  {isSubmitting ? 'Signing in...' : 'Sign in'}
                </button>

                <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
                  <div style={{ flex: 1, height: '1px', backgroundColor: '#eaeded' }}></div>
                  <div style={{ padding: '0 12px', fontSize: '12px', fontWeight: 'bold', color: '#16191f' }}>OR</div>
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
                    padding: '10px', 
                    fontSize: '14px', 
                    fontWeight: 'bold',
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
            background: 'linear-gradient(135deg, #fcebfa 0%, #e8f4fe 100%)',
            borderRadius: '12px',
            padding: '60px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            minHeight: '480px'
          }}>
            {/* Background pattern elements */}
            <div style={{ position: 'absolute', right: '-20px', top: '20px', opacity: 0.1 }}>
              <svg width="200" height="200" viewBox="0 0 100 100"><path d="M50 0L93.3 25L93.3 75L50 100L6.7 75L6.7 25L50 0Z" fill="none" stroke="#000" strokeWidth="2"/></svg>
            </div>
            
            <h2 style={{ fontSize: '42px', fontWeight: 'bold', lineHeight: 1.1, marginBottom: '20px', color: '#16191f' }}>
              Everything you<br/>need for getting<br/>agents to production
            </h2>
            <p style={{ fontSize: '20px', color: '#16191f', marginBottom: '40px', lineHeight: 1.4, maxWidth: '400px' }}>
              Build, connect, and optimize AI<br/>agents. Any framework, any model,<br/>security built in from the start.
            </p>
            <div>
              <button style={{ 
                backgroundColor: 'transparent', 
                color: '#16191f', 
                border: '1px solid #16191f', 
                borderRadius: '24px', 
                padding: '12px 24px', 
                fontSize: '16px', 
                fontWeight: 'bold',
                cursor: 'pointer'
              }}>
                Start building with AgentCore
              </button>
            </div>
          </div>

        </div>
      </div>
      
      <div style={{ width: '100%', textAlign: 'center', position: 'absolute', bottom: '20px', fontSize: '11px', color: '#545b64' }}>
        © 2026 Amazon Web Services, Inc. or its affiliates. All rights reserved.
      </div>
    </div>
  );
}
