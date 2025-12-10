import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { GitHubAPI } from '@/lib/github';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.accessToken) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in with GitHub.' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const username = searchParams.get('username') || session.username;

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required.' },
        { status: 400 }
      );
    }

    const isOwnProfile = username.toLowerCase() === session.username?.toLowerCase();

    const api = new GitHubAPI(username, session.accessToken, isOwnProfile);
    const stats = await api.getStats();

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching GitHub stats:', error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch GitHub stats' },
      { status: 500 }
    );
  }
}
