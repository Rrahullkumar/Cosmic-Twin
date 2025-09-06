import { connectDB } from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { setSessionCookie } from '@/lib/session';

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    // Basic validation
    if (!name || !email || !password) {
      return Response.json({ error: 'All fields are required' }, { status: 400 });
    }

    if (password.length < 6) {
      return Response.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json({ error: 'User already exists with this email' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    const savedUser = await newUser.save();

    // Create session
    const response = Response.json(
      { 
        success: true, 
        message: 'Account created successfully',
        user: { 
          id: savedUser._id, 
          name: savedUser.name, 
          email: savedUser.email 
        }
      }, 
      { status: 201 }
    );

    setSessionCookie(response, savedUser._id);
    return response;

  } catch (error) {
    console.error('Signup error:', error);
    return Response.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
