import CommunityStyles from './CommunityStyles';
import ChatSidebar from './ChatSidebar';
import CenterFeed from './CenterFeed';
import RightSidebar from './RightSidebar';

export default function CommunityLayout() {
  return (
    <>
      <CommunityStyles />
      <div className="min-h-screen overflow-x-hidden" style={{ backgroundColor: 'var(--off-white)' }}>
        <div className="container mx-auto px-4 sm:px-6 py-8 overflow-x-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
            <ChatSidebar />
            <CenterFeed />
            <RightSidebar />
          </div>
        </div>
      </div>
    </>
  );
}
