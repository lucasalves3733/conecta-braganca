export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="h-6 w-32 bg-slate-800/60 rounded animate-pulse mb-6" />
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden animate-pulse">
          <div className="h-64 sm:h-80 w-full bg-slate-800" />
          <div className="p-8">
            <div className="h-6 w-24 bg-slate-800 rounded mb-4" />
            <div className="h-10 w-3/4 bg-slate-800 rounded mb-3" />
            <div className="h-4 w-full bg-slate-800/60 rounded mb-2" />
            <div className="h-4 w-2/3 bg-slate-800/60 rounded mb-6" />
            <div className="h-20 w-full bg-slate-800/40 rounded mb-6" />
            <div className="grid grid-cols-2 gap-3">
              <div className="h-12 bg-slate-800 rounded-xl" />
              <div className="h-12 bg-slate-800 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
