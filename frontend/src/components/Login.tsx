import { useState, FormEvent } from 'react';
import './Login.css';

interface LoginProps {
  onLogin: (username: string, password: string) => Promise<void>;
  onSwitchToSignup: () => void;
  error: string | null;
}

export function Login({ onLogin, onSwitchToSignup, error }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onLogin(username, password);
    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>LiveTracker</h1>
        <p className="login-subtitle">Sign in to continue</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="switch-auth">
          Don't have an account?{' '}
          <button className="link-btn" onClick={onSwitchToSignup} disabled={loading}>
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
