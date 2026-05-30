import { useEffect, useState } from 'react';

function get_(x) {
  return x.replace(/<\/?[^>]+(>|$)/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toLowerCase();
}

let types = [
  <th>SR NO.</th>,
  <th>CN DATE</th>,
  <th>CN NO.</th>,
  <th>FROM</th>,
  <th>DESTINATION</th>,
  <th>HSN/SAC CODE</th>,
  <th>TRANSPORT</th>,
  <th>SENDER</th>,
  <th>RECEIVER</th>,
  <th>NO. OF PKG</th>,
  <th>FREIGHT AMOUNT</th>,
  <th>TOTAL AMOUNT</th>,
  <th>SR NO.</th>,
  <th>CN DATE</th>,
  <th>CN NO.</th>,
  <th>FROM</th>,
  <th>DESTINATION</th>,
  <th>HSN/SAC CODE</th>,
  <th>TRANSPORT</th>,
  <th>NO. OF PKG</th>,
  <th>FREIGHT AMOUNT</th>,
  <th>TOTAL AMOUNT</th>,
  <th>SR NO.</th>,
  <th>CN DATE</th>,
  <th>CN NO.</th>,
  <th>FROM</th>,
  <th>DESTINATION</th>,
  <th>HSN/SAC CODE</th>,
  <th>TRANSPORT</th>,
  <th>INVOICE NO.</th>,
  <th>MATERIAL DESCRIPTION</th>,
  <th>VEHICLE NO.</th>,
  <th>NO. OF PKG</th>,
  <th>WEIGHT</th>,
  <th>FREIGHT AMOUNT</th>,
  <th>TOTAL AMOUNT</th>,
];

export default function SettingsPage() {
  // const [data, setData] = useState({});

  // useEffect(() => {
  //   const sData = localStorage.getItem("sData");
  //   if (sData) {
  //     setData(JSON.parse(sData));
  //   }
  // }, []);

  // const handleChange = (e) => {
  //   setData({ ...data, [e.target.name]: +e.target.value });
  // };

  // const save = (e) => {
  //   e.preventDefault();
  //   localStorage.setItem("sData", JSON.stringify(data));
  // }

  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '1rem' }}>Settings</h1>
      <p style={{ color: '#555', marginBottom: '2rem' }}>
        Update your preferences and company details for invoice generation.
      </p>

      <h2 style={{ marginBottom: '0.75rem' }}>Column Widths</h2>
      <form onSubmit={save} style={{ display: 'grid', gap: '1rem' }}>
        {types.map(t =>
          <section style={{ padding: '1.5rem', border: '1px solid #ddd', borderRadius: '10px' }}>
            <h2 style={{ marginBottom: '0.75rem' }}>Preferences</h2>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
              {t.props.children}
            </label>
            <input
              type="number"
              name={get_(t.props.children)}
              value={data[get_(t.props.children)]}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem', borderRadius: '6px', border: '1px solid #ccc' }}
            />
          </section>
        )}

        <button
          type="submit"
          style={{ padding: '0.95rem 1.2rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
        >
          Save Settings
        </button>
      </form>
    </main>
  );
}
