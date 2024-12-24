export default function Sidebar() {
    return (
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-slate-200 border-r border-slate-700">
        <div className="h-16 flex items-center justify-center border-b border-slate-700">
          <span className="text-xl font-semibold tracking-wide text-emerald-400">AI Chat</span>
        </div>
        <nav className="flex-1 overflow-y-auto p-4">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Channels</h2>
          <ul className="space-y-2">
            {['General', 'Development', 'Design', 'Random'].map((channel) => (
              <li key={channel}>
                <a href="#" className="flex items-center px-3 py-2 rounded-md hover:bg-slate-800 hover:text-emerald-300">
                  <span className="font-medium"># {channel}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center space-x-3">
            <img src="https://via.placeholder.com/40" className="h-10 w-10 rounded-full" alt="User Avatar" />
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-100">You</p>
              <p className="text-xs text-slate-400">Online</p>
            </div>
          </div>
        </div>
      </aside>
    );
  }