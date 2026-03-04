export default function GuideSkeletonLoader() {
  return (
    <div className="min-h-screen bg-background animate-fade-in">
      {/* Header skeleton */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border px-4 md:px-8 py-3 flex items-center justify-between">
        <div className="h-6 w-28 bg-muted rounded animate-pulse" />
        <div className="h-8 w-24 bg-muted rounded-lg animate-pulse" />
      </div>

      <div className="pt-16">
        {/* Hero skeleton */}
        <section className="py-12 md:py-24 px-4 md:px-8">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1 w-full space-y-4">
              <div className="h-10 w-4/5 bg-muted rounded animate-pulse" />
              <div className="h-10 w-3/5 bg-muted rounded animate-pulse" />
              <div className="h-5 w-full max-w-xl bg-muted rounded animate-pulse mt-4" />
              <div className="h-5 w-3/4 max-w-xl bg-muted rounded animate-pulse" />
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <div className="h-12 w-40 bg-primary/20 rounded-lg animate-pulse" />
                <div className="h-12 w-44 bg-secondary/20 rounded-lg animate-pulse" />
              </div>
            </div>
            <div className="hidden md:block w-44 h-44 rounded-full bg-muted animate-pulse" />
          </div>
        </section>

        {/* Story skeleton */}
        <section className="bg-card py-14 px-4 md:px-8">
          <div className="max-w-3xl mx-auto space-y-3">
            <div className="h-5 w-full bg-muted rounded animate-pulse" />
            <div className="h-5 w-5/6 bg-muted rounded animate-pulse" />
            <div className="h-5 w-4/6 bg-muted rounded animate-pulse" />
            <div className="h-4 w-48 bg-muted rounded animate-pulse mt-4" />
          </div>
        </section>

        {/* Cards skeleton */}
        <section className="py-14 px-4 md:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="h-8 w-64 bg-muted rounded animate-pulse mx-auto mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card rounded-xl p-6 shadow-sm space-y-3">
                  <div className="h-4 w-24 bg-primary/20 rounded animate-pulse" />
                  <div className="h-4 w-full bg-muted rounded animate-pulse" />
                  <div className="h-4 w-4/5 bg-muted rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why section skeleton */}
        <section className="bg-background py-10 md:py-14 px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="h-8 w-72 bg-muted rounded animate-pulse mx-auto mb-10" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card rounded-xl p-6 shadow-sm space-y-3">
                  <div className="w-8 h-8 rounded-full bg-secondary/10 animate-pulse" />
                  <div className="h-4 w-full bg-muted rounded animate-pulse" />
                  <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
