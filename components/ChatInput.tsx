export default function ChatInput() {
    return (
      <div className="border-t border-slate-200 bg-white p-4">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Type your message…"
            className="flex-1 border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <button className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700">Send</button>
        </div>
      </div>
    );
  }