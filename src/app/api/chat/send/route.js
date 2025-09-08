import { getCurrentUser } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import Message from '@/models/Message';

export async function POST(request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return Response.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { message } = await request.json();
    
    if (!message?.trim()) {
      return Response.json({ error: 'Message cannot be empty' }, { status: 400 });
    }

    await connectDB();

    // Save message to database
    const newMessage = await Message.create({
      content: message.trim(),
      sender: user._id,
      senderName: user.name,
      chatType: 'global'
    });

    return Response.json({ 
      success: true, 
      message: {
        id: newMessage._id.toString(),
        content: newMessage.content,
        sender: { id: user._id.toString(), name: user.name },
        timestamp: newMessage.createdAt,
        isCurrentUser: true
      }
    });

  } catch (error) {
    console.error('Send message error:', error);
    return Response.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
