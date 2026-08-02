/** Kettukilpailutuksen logomerkki: pelkistetty kettu. */
export default function FoxMark({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden>
      <path d="M4 6 L14 16 L26 16 L36 6 L34 20 C34 30 28 36 20 36 C12 36 6 30 6 20 Z" fill="#E8691B" />
      <path d="M4 6 L14 16 L10 20 Z" fill="#0A0807" />
      <path d="M36 6 L26 16 L30 20 Z" fill="#0A0807" />
      <path d="M20 36 C16 36 12 33 11 28 L16 24 L20 30 L24 24 L29 28 C28 33 24 36 20 36 Z" fill="#F7F1E8" />
      <circle cx="15" cy="22" r="2" fill="#0A0807" />
      <circle cx="25" cy="22" r="2" fill="#0A0807" />
      <path d="M20 30 L18 27 L22 27 Z" fill="#0A0807" />
    </svg>
  );
}
