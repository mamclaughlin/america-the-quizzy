export default function PhotoAttribution() {
  return (
    <div className="fixed bottom-4 right-4 z-50 text-xs text-warm-beige/70 bg-charcoal/20 px-3 py-2 rounded backdrop-blur-sm">
      <span>Photo by </span>
      <a 
        href="https://instagram.com/codyblue_" 
        target="_blank" 
        rel="noopener noreferrer"
        className="hover:text-warm-beige transition-colors underline"
      >
        @codyblue_
      </a>
    </div>
  );
}
