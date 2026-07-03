'use client';

// Customer dashboard: balance, account details, KYC, statement + AI chatbox.
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import ChatBox from '../../components/ChatBox';
import { api, getSession, formatNPR, formatDate } from '../../lib/api';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [account, setAccount] = useState(null);
  const [kyc, setKyc] = useState(null);
  const [statement, setStatement] = useState(null);
  const [otp, setOtp] = useState(null);
  const [otpBusy, setOtpBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const session = getSession();
    if (!session) return router.replace('/login');
    if (session.user.role === 'manager') return router.replace('/manager');
    setUser(session.user);

    Promise.all([api('account'), api('kyc'), api('statement'), api('otp')])
      .then(([acc, kycData, stmt, otpData]) => {
        setAccount(acc);
        setKyc(kycData);
        setStatement(stmt);
        setOtp(otpData);
      })
      .catch((err) => setError(err.message));
  }, [router]);

  async function toggleOtp() {
    setOtpBusy(true);
    setError('');
    try {
      setOtp(
        await api('otp', {
          method: 'POST',
          body: JSON.stringify({ enabled: !otp.enabled }),
        })
      );
    } catch (err) {
      setError(err.message);
    }
    setOtpBusy(false);
  }

  if (!user) return <div className="loading">Loading…</div>;

  return (
    <>
      <Header user={user} />
      <main className="container">
        {error && <div className="error-box">{error}</div>}

        <div className="grid">
          <div className="card">
            <h2>Account Balance</h2>
            {account ? (
              <>
                <div className="balance-figure">{formatNPR(account.balance)}</div>
                <div className="balance-sub">
                  Available balance · A/C …{account.account_number.slice(-4)}
                </div>
              </>
            ) : (
              <div className="loading">Loading…</div>
            )}
          </div>

          <div className="card">
            <h2>Account Details</h2>
            {account && (
              <ul className="detail-list">
                <li>
                  <span className="label">Account number</span>
                  <span className="value">{account.account_number}</span>
                </li>
                <li>
                  <span className="label">Type</span>
                  <span className="value">{account.account_type}</span>
                </li>
                <li>
                  <span className="label">Branch</span>
                  <span className="value">{account.branch}</span>
                </li>
                <li>
                  <span className="label">Opened</span>
                  <span className="value">{formatDate(account.opened_at)}</span>
                </li>
              </ul>
            )}
          </div>

          <div className="card">
            <h2>KYC Details</h2>
            {kyc && (
              <ul className="detail-list">
                <li>
                  <span className="label">Date of birth</span>
                  <span className="value">{formatDate(kyc.date_of_birth)}</span>
                </li>
                <li>
                  <span className="label">Citizenship no.</span>
                  <span className="value">{kyc.citizenship_number}</span>
                </li>
                <li>
                  <span className="label">PAN</span>
                  <span className="value">{kyc.pan_number}</span>
                </li>
                <li>
                  <span className="label">Address</span>
                  <span className="value">{kyc.address}</span>
                </li>
                <li>
                  <span className="label">Phone</span>
                  <span className="value">{kyc.phone}</span>
                </li>
                <li>
                  <span className="label">Occupation</span>
                  <span className="value">{kyc.occupation}</span>
                </li>
                <li>
                  <span className="label">Status</span>
                  <span className="value verified">
                    ✔ Verified {formatDate(kyc.verified_at)}
                  </span>
                </li>
              </ul>
            )}
          </div>

          <div className="card">
            <h2>Login OTP</h2>
            {otp && (
              <>
                <ul className="detail-list">
                  <li>
                    <span className="label">Status</span>
                    <span className={`value ${otp.enabled ? 'verified' : ''}`}>
                      {otp.enabled ? '✔ Enabled' : 'Disabled'}
                    </span>
                  </li>
                  {otp.enabled && (
                    <li>
                      <span className="label">Your OTP code</span>
                      <span className="value">
                        <code>{otp.pin}</code>
                      </span>
                    </li>
                  )}
                </ul>
                <p className="card-note">
                  {otp.enabled
                    ? 'Signing in now asks for this OTP code after your password.'
                    : 'Add a one-time PIN as a second step when you sign in.'}
                </p>
                <button className="btn" onClick={toggleOtp} disabled={otpBusy}>
                  {otpBusy
                    ? 'Saving…'
                    : otp.enabled
                      ? 'Disable OTP'
                      : 'Enable OTP'}
                </button>
              </>
            )}
          </div>
        </div>

        <div className="grid" style={{ gridTemplateColumns: '1.4fr 1fr' }}>
          <div className="card">
            <h2>Bank Statement — June 2026</h2>
            {statement && (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Description</th>
                      <th className="num">Amount</th>
                      <th className="num">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {statement.transactions.map((t, i) => (
                      <tr key={i}>
                        <td>{formatDate(t.txn_date)}</td>
                        <td>{t.description}</td>
                        <td className={`num amount-${t.type}`}>
                          {t.type === 'credit' ? '+' : '−'}
                          {formatNPR(t.amount)}
                        </td>
                        <td className="num">{formatNPR(t.balance_after)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <ChatBox />
        </div>

        <p className="footer-note">
          Smart AI Bank · Training demo — all data is fake and seeded by the
          database migration.
        </p>
      </main>
    </>
  );
}
