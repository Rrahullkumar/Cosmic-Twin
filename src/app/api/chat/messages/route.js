import { getCurrentUser } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import Message from '@/models/Message';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return Response.json({ error: 'Not authenticated' }, { status: 401 });
    }

    await connectDB();

    // Get last 50 messages from global chat
    const messages = await Message.find({ chatType: 'global' })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('sender', 'name')
      .lean();

    // Filter out messages with null senders and reverse to show oldest first
    const formattedMessages = messages
      .reverse()
      .filter(msg => msg.sender !== null) // Add this filter
      .map(msg => ({
        id: msg._id.toString(),
        content: msg.content,
        sender: {
          id: msg.sender._id.toString(),
          name: msg.sender.name
        },
        timestamp: msg.createdAt,
        isCurrentUser: msg.sender._id.toString() === user._id.toString()
      }));

    return Response.json({ success: true, messages: formattedMessages });

  } catch (error) {
    console.error('Error fetching messages:', error);
    return Response.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}
