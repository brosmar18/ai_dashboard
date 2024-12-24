import Message from './Message';

export default function ChatArea() {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
      <Message user="Jane" text="Welcome to the chat!" time="10:15 AM" avatar="https://via.placeholder.com/40" />
      <Message user="You" text="Thanks Jane! This looks great." time="10:17 AM" avatar="https://via.placeholder.com/40" />
    </div>
  );
}