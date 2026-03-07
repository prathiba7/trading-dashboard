import { useState, FormEvent } from 'react';
import './Login.css';

interface SignupProps {
  onSignup: (username: string, password: string) => Promise<void>;
  onSwitchToLogin: () => void;
  error: string | null;
}

export function Signup({ onSignup, onSwitchToLogin, error }: SignupProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (username.length < 3) {
      setValidationError('Username must be at least 3 characters');
      return;
    }

    if (password.length < 4) {
      setValidationError('Password must be at least 4 characters');
      return;
    }

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    setLoading(true);
    await onSignup(username, password);
    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Trading Dashboard</h1>
        <p className="login-subtitle">Create your account</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Username (min 3 characters)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <input
              type="password"
              placeholder="Password (min 4 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {(error || validationError) && (
            <div className="error-message">{error || validationError}</div>
          )}

          <button type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="switch-auth">
          Already have an account?{' '}
          <button className="link-btn" onClick={onSwitchToLogin} disabled={loading}>
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
