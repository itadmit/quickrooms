export default function Logo({ className = "", textClassName = "" }: { className?: string; textClassName?: string }) {
  return (
    <h1 
      className={`text-2xl font-pacifico text-gray-900 whitespace-nowrap overflow-visible ${className} ${textClassName}`}
      style={{ letterSpacing: '2px', lineHeight: 1.5 }}
    >
      Quick Rooms
    </h1>
  );
}
