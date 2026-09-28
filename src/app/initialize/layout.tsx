export default function InitializeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-nexus-bg p-4 sm:p-6 lg:p-8 font-sans">
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 subtle-grid opacity-30 mask-radial-faded" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-nexus-surface rounded-full blur-[120px] opacity-50" />
      </div>
      
      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col min-h-screen pt-8 pb-12 lg:pt-0 lg:pb-0 lg:justify-center">
        {children}
      </div>
    </div>
  );
}
