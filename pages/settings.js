import { useState } from 'react';

export default function SettingsPage() {
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [saveMessage, setSaveMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    setSaveMessage('Settings saved successfully.');
  };

  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '1rem' }}>Settings</h1>
      <p style={{ color: '#555', marginBottom: '2rem' }}>
        Update your preferences and company details for invoice generation.
      </p>

          <h2 style={{ marginBottom: '0.75rem' }}>Dekha Jayega</h2>
      {/* <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
        <section style={{ padding: '1.5rem', border: '1px solid #ddd', borderRadius: '10px' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Company Name
            <input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Acme Corporation"
              style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem', borderRadius: '6px', border: '1px solid #ccc' }}
            />
          </label>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Contact Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="hello@example.com"
              style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem', borderRadius: '6px', border: '1px solid #ccc' }}
            />
          </label>
        </section>

        <section style={{ padding: '1.5rem', border: '1px solid #ddd', borderRadius: '10px' }}>
          <h2 style={{ marginBottom: '0.75rem' }}>Preferences</h2>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Default Currency
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem', borderRadius: '6px', border: '1px solid #ccc' }}
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="INR">INR</option>
            </select>
          </label>
        </section>

        <button
          type="submit"
          style={{ padding: '0.95rem 1.2rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
        >
          Save Settings
        </button>
      </form>

      {saveMessage && (
        <p style={{ marginTop: '1rem', color: '#166534', fontWeight: '600' }}>{saveMessage}</p>
      )} */}
    </main>
  );
}
