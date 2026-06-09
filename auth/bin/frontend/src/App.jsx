import React, { useMemo, useState } from 'react';
import {
  getProtectedProfile,
  getRoleArea,
  healthCheck,
  loginUser,
  registerUser,
} from './api.js';

const initialForm = {
  fullName: 'Security Tester',
  email: 'tester@example.com',
  password: 'secret123',
  role: 'CANDIDATE',
};

const roles = ['CANDIDATE', 'RECRUITER', 'ADMIN'];

function decodeToken(token) {
  if (!token) {
    return null;
  }

  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
  } catch {
    return null;
  }
}

function format(value) {
  if (value === null || value === undefined || value === '') {
    return 'No response yet';
  }

  if (typeof value === 'string') {
    return value;
  }

  return JSON.stringify(value, null, 2);
}

export default function App() {
  const [form, setForm] = useState(initialForm);
  const [token, setToken] = useState(() => localStorage.getItem('authToken') || '');
  const [lastResult, setLastResult] = useState(null);
  const [busyAction, setBusyAction] = useState('');
  const [authUser, setAuthUser] = useState(() => {
    const saved = localStorage.getItem('authUser');
    return saved ? JSON.parse(saved) : null;
  });
  const claims = useMemo(() => decodeToken(token), [token]);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function runAction(label, action) {
    setBusyAction(label);

    try {
      const result = await action();
      setLastResult({ label, ...result });

      if (result.body?.token) {
        setToken(result.body.token);
        setAuthUser({
          email: result.body.email,
          role: result.body.role,
        });
        localStorage.setItem('authToken', result.body.token);
        localStorage.setItem(
          'authUser',
          JSON.stringify({
            email: result.body.email,
            role: result.body.role,
          }),
        );
      }
    } catch (error) {
      setLastResult({
        label,
        ok: false,
        status: 'Network error',
        body: error.message,
      });
    } finally {
      setBusyAction('');
    }
  }

  function clearToken() {
    setToken('');
    setAuthUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
  }

  return (
    <main className="app-shell">
      <section className="intro-band">
        <div>
          <p className="eyebrow">Spring Security JWT demo</p>
          <h1>HirePilot Auth Security Lab</h1>
        </div>
        <div className={token ? 'status-pill active' : 'status-pill'}>
          {token ? 'Bearer token loaded' : 'No bearer token'}
        </div>
      </section>

      <section className="workspace-grid">
        <div className="panel">
          <h2>Credentials</h2>
          <p className="field-note">
            Role is used only when registering a new user. Login always uses the role saved for
            that email.
          </p>
          <label>
            Full name
            <input name="fullName" value={form.fullName} onChange={updateField} />
          </label>
          <label>
            Email
            <input name="email" type="email" value={form.email} onChange={updateField} />
          </label>
          <label>
            Password
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={updateField}
            />
          </label>
          <label>
            Role
            <select name="role" value={form.role} onChange={updateField}>
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </label>

          <div className="button-row">
            <button
              onClick={() => runAction('Health check', healthCheck)}
              disabled={Boolean(busyAction)}
            >
              Health
            </button>
            <button
              onClick={() =>
                runAction('Register', () =>
                  registerUser({
                    fullName: form.fullName,
                    email: form.email,
                    password: form.password,
                    role: form.role,
                  }),
                )
              }
              disabled={Boolean(busyAction)}
            >
              Register
            </button>
            <button
              onClick={() =>
                runAction('Login', () =>
                  loginUser({
                    email: form.email,
                    password: form.password,
                  }),
                )
              }
              disabled={Boolean(busyAction)}
            >
              Login
            </button>
          </div>
        </div>

        <div className="panel">
          <h2>Security Checks</h2>
          <div className="button-row security-actions">
            <button
              onClick={() => runAction('Protected call without token', () => getProtectedProfile(''))}
              disabled={Boolean(busyAction)}
            >
              Try locked route
            </button>
            <button
              onClick={() => runAction('Protected call with token', () => getProtectedProfile(token))}
              disabled={Boolean(busyAction) || !token}
            >
              Send bearer token
            </button>
            <button onClick={clearToken} disabled={!token || Boolean(busyAction)}>
              Clear token
            </button>
          </div>

          <div className="token-box">
            <div className="token-header">
              <span>JWT</span>
              <span>{authUser?.role || 'anonymous'}</span>
            </div>
            <code>{token || 'Login or register to store a token here.'}</code>
          </div>

          <div className="claims-grid">
            <div>
              <span>Subject</span>
              <strong>{claims?.sub || '-'}</strong>
            </div>
            <div>
              <span>Saved role</span>
              <strong>{authUser?.role || '-'}</strong>
            </div>
            <div>
              <span>Expires</span>
              <strong>{claims?.exp ? new Date(claims.exp * 1000).toLocaleString() : '-'}</strong>
            </div>
          </div>

          <div className="role-tests">
            {roles.map((role) => (
              <button
                key={role}
                onClick={() => runAction(`${role} role check`, () => getRoleArea(role, token))}
                disabled={Boolean(busyAction) || !token}
              >
                Test {role}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="response-band">
        <div>
          <p className="eyebrow">Last request</p>
          <h2>{busyAction || lastResult?.label || 'Ready'}</h2>
        </div>
        <div className={lastResult?.ok ? 'http-status ok' : 'http-status'}>
          {lastResult ? `HTTP ${lastResult.status}` : 'Idle'}
        </div>
        <pre>{format(lastResult?.body)}</pre>
      </section>
    </main>
  );
}
