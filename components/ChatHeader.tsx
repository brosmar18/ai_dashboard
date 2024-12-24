export default function ChatHeader() {
    return (
      <div className="border-b border-slate-200 bg-white p-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-medium text-slate-900"># General</h1>
          <p className="text-sm text-slate-500">Company-wide announcements and general discussions</p>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search…"
            className="border border-slate-300 rounded-md pl-10 pr-3 py-2 text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 placeholder-slate-400"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="M21 21l-4.35-4.35"></path>
            </svg>
          </div>
        </div>
      </div>
    );
  }