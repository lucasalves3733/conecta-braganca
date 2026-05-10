export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="h-10 w-48 bg-slate-800/60 rounded-lg animate-pulse mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 animate-pulse">
              <div className="h-5 w-20 bg-slate-800 rounded mb-3" />
              <div className="h-6 w-3/4 bg-slate-800 rounded mb-2" />
              <div className="h-4 w-full bg-slate-800/60 rounded mb-2" />
              <div className="h-4 w-2/3 bg-slate-800/60 rounded mb-4" />
              <div className="h-10 w-full bg-slate-800/40 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
