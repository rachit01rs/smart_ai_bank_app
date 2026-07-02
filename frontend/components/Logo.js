// Simple inline SVG logo — a vault/spark mark for "Smart AI Bank".
export default function Logo({ className = 'logo' }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="44" height="44" rx="10" fill="#0e9594" />
      <path d="M10 20 24 10l14 10v2H10v-2z" fill="#fff" />
      <rect x="13" y="24" width="4" height="12" fill="#fff" />
      <rect x="22" y="24" width="4" height="12" fill="#fff" />
      <rect x="31" y="24" width="4" height="12" fill="#fff" />
      <rect x="10" y="37" width="28" height="3" rx="1" fill="#fff" />
      <circle cx="37" cy="12" r="6" fill="#e0a458" />
      <path
        d="M37 8.5l1 2.4 2.4 1-2.4 1-1 2.4-1-2.4-2.4-1 2.4-1 1-2.4z"
        fill="#0b2545"
      />
    </svg>
  );
}
