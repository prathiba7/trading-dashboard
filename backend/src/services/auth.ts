export interface User {
  username: string;
  token: string;
}

interface StoredUser {
  username: string;
  password: string;
}

const MOCK_USERS: StoredUser[] = [
  { username: 'admin', password: 'admin123' },
  { username: 'trader', password: 'trader123' },
  { username: 'demo', password: 'demo' }
];

const activeSessions = new Map<string, string>();

export class AuthService {
  login(username: string, password: string): User | null {
    const user = MOCK_USERS.find(u => u.username === username && u.password === password);
    
    if (!user) {
      return null;
    }

    const token = `token_${username}_${Date.now()}`;
    activeSessions.set(token, username);

    return { username, token };
  }

  signup(username: string, password: string): User | null {
    if (MOCK_USERS.find(u => u.username === username)) {
      return null;
    }

    MOCK_USERS.push({ username, password });
    
    const token = `token_${username}_${Date.now()}`;
    activeSessions.set(token, username);

    return { username, token };
  }

  validateToken(token: string): string | null {
    return activeSessions.get(token) || null;
  }

  logout(token: string): void {
    activeSessions.delete(token);
  }
}
