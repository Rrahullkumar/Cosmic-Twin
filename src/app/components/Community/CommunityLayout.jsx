import { getCurrentUser } from '@/lib/auth';
import CommunityStyles from './CommunityStyles';
import ChatSidebar from './ChatSidebar';
import CenterFeed from './CenterFeed';
import RightSidebar from './RightSidebar';

export default async function CommunityLayout() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/auth/login');
  }

  return (
    <>
      <CommunityStyles />
      <div className="h-screen overflow-hidden flex" style={{ backgroundColor: 'var(--off-white)' }}>
        <ChatSidebar user={user} />
        <CenterFeed />
        <RightSidebar />
      </div>
    </>
  );
}
