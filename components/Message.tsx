interface MessageProps {
    user: string;
    text: string;
    time: string;
    avatar: string;
  }
  
  export default function Message({ user, text, time, avatar }: MessageProps) {
    return (
      <div className="flex items-start space-x-3">
        <img src={avatar} className="h-8 w-8 rounded-full" alt="User Avatar" />
        <div>
          <div className="flex items-baseline space-x-2">
            <span className="font-medium text-slate-900">{user}</span>
            <span className="text-xs text-slate-400">{time}</span>
          </div>
          <p className="text-slate-700">{text}</p>
        </div>
      </div>
    );
  }