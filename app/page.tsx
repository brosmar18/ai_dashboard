import Sidebar from '../components/Sidebar';
import ChatHeader from '../components/ChatHeader';
import ChatArea from '../components/ChatArea';
import ChatInput from '../components/ChatInput';

export default function DashboardPage() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <ChatHeader />
        <ChatArea />
        <ChatInput />
      </div>
    </div>
  );
}