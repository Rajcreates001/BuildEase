export default function GlassCard({ children, className = '', onClick, style }) {
  return (
    <div
      className={`glass-card rounded-xl ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
      style={style}
    >
      {children}
    </div>
  );
}
