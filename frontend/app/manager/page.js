'use client';

// Bank manager view: branch summary + all customer accounts.
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import { api, getSession, formatNPR, formatDate } from '../../lib/api';

export default function ManagerPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [summary, setSummary] = useState(null);
  const [customers, setCustomers] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const session = getSession();
    if (!session) return router.replace('/login');
    if (session.user.role !== 'manager') return router.replace('/dashboard');
    setUser(session.user);

    Promise.all([api('manager/summary'), api('manager/customers')])
      .then(([sum, cust]) => {
        setSummary(sum);
        setCustomers(cust);
      })
      .catch((err) => setError(err.message));
  }, [router]);

  if (!user) return <div className="loading">Loading…</div>;

  return (
    <>
      <Header user={user} />
      <main className="container">
        {error && <div className="error-box">{error}</div>}

        <h2 className="section-title">Branch Overview</h2>
        <div className="stat-cards">
          <div className="card">
            <h2>Customers</h2>
            <div className="stat-value">{summary ? summary.customers : '…'}</div>
          </div>
          <div className="card">
            <h2>Total Deposits</h2>
            <div className="stat-value">
              {summary ? formatNPR(summary.total_deposits) : '…'}
            </div>
          </div>
          <div className="card">
            <h2>Transactions (June 2026)</h2>
            <div className="stat-value">{summary ? summary.transactions : '…'}</div>
          </div>
        </div>

        <div className="card">
          <h2>Customer Accounts</h2>
          {customers && (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Username</th>
                    <th>Account number</th>
                    <th>Type</th>
                    <th>Branch</th>
                    <th>KYC</th>
                    <th className="num">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c) => (
                    <tr key={c.id}>
                      <td>{c.full_name}</td>
                      <td>{c.username}</td>
                      <td>{c.account_number}</td>
                      <td>{c.account_type}</td>
                      <td>{c.branch}</td>
                      <td className="verified">
                        {c.kyc_verified_at
                          ? `✔ ${formatDate(c.kyc_verified_at)}`
                          : '—'}
                      </td>
                      <td className="num">{formatNPR(c.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p className="footer-note">
          Smart AI Bank · Training demo — all data is fake and seeded by the
          database migration.
        </p>
      </main>
    </>
  );
}
