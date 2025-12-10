import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { GitHubAPI } from '@/lib/github';

export const runtime = 'edge';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string; slide: string }> }
) {
  try {
    const { username, slide: slideParam } = await params;
    const slideNumber = parseInt(slideParam, 10);
    
    const session = await auth();
    const token = session?.accessToken || process.env.GITHUB_TOKEN;
    
    const isOwnProfile = session?.username ? username.toLowerCase() === session.username?.toLowerCase() : false;
    const api = new GitHubAPI(username, token, isOwnProfile);
    const stats = await api.getStats();

    const currentYear = new Date().getFullYear();

    const slideContent = getSlideContent(slideNumber, stats, currentYear);

    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: slideContent.background,
            fontFamily: 'Inter, sans-serif',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: -100,
              right: -100,
              width: 400,
              height: 400,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
              filter: 'blur(60px)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: -100,
              left: -100,
              width: 300,
              height: 300,
              borderRadius: '50%',
              background: 'rgba(0,0,0,0.2)',
              filter: 'blur(60px)',
            }}
          />
          
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '40px',
              zIndex: 10,
            }}
          >
            {slideContent.subtitle && (
              <p
                style={{
                  fontSize: 28,
                  color: 'rgba(255,255,255,0.8)',
                  margin: 0,
                  marginBottom: 20,
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em',
                }}
              >
                {slideContent.subtitle}
              </p>
            )}
            <h1
              style={{
                fontSize: slideContent.titleSize || 120,
                fontWeight: 900,
                color: 'white',
                margin: 0,
                lineHeight: 1.1,
                textShadow: '0 4px 30px rgba(0,0,0,0.3)',
              }}
            >
              {slideContent.title}
            </h1>
            {slideContent.description && (
              <p
                style={{
                  fontSize: 36,
                  color: 'rgba(255,255,255,0.9)',
                  margin: 0,
                  marginTop: 24,
                }}
              >
                {slideContent.description}
              </p>
            )}
          </div>

          <div
            style={{
              position: 'absolute',
              bottom: 40,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <p
              style={{
                fontSize: 24,
                color: 'rgba(255,255,255,0.6)',
                margin: 0,
              }}
            >
              Git Wrapped {currentYear}
            </p>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('Error generating OG image:', error);
    return new Response('Error generating image', { status: 500 });
  }
}

interface SlideContent {
  title: string;
  subtitle?: string;
  description?: string;
  titleSize?: number;
  background: string;
}

function getSlideContent(slideNumber: number, stats: any, year: number): SlideContent {
  const backgrounds = [
    'linear-gradient(135deg, #1DB954, #1ED760, #34d399)',
    'linear-gradient(135deg, #9333ea, #7c3aed, #c026d3)',
    'linear-gradient(135deg, #1DB954, #14b8a6, #06b6d4)',
    'linear-gradient(135deg, #db2777, #f43f5e, #f97316)',
    'linear-gradient(135deg, #2563eb, #4f46e5, #9333ea)',
    'linear-gradient(135deg, #1DB954, #10b981, #0d9488)',
    'linear-gradient(135deg, #f97316, #ec4899, #9333ea)',
    'linear-gradient(135deg, #9333ea, #1DB954, #06b6d4)',
  ];

  const topLanguage = Object.keys(stats.topLanguages)[0] || 'Code';
  const topRepo = stats.topRepos[0]?.name.split('/')[1] || 'GitHub';

  switch (slideNumber) {
    case 1:
      return {
        title: stats.totalCommits.toLocaleString('pt-BR'),
        subtitle: 'Você fez',
        description: `commits em ${year}`,
        titleSize: 180,
        background: backgrounds[1],
      };
    case 2:
      return {
        title: topLanguage,
        subtitle: 'Sua linguagem favorita',
        description: `em ${stats.totalRepos} repositórios`,
        titleSize: 100,
        background: backgrounds[2],
      };
    case 3:
      return {
        title: stats.codingPattern,
        subtitle: 'Seu padrão de código',
        titleSize: 80,
        background: backgrounds[3],
      };
    case 4:
      return {
        title: topRepo,
        subtitle: 'Repositório favorito',
        description: `${stats.topRepos[0]?.commits || 0} commits`,
        titleSize: 80,
        background: backgrounds[4],
      };
    case 5:
      return {
        title: `+${stats.linesAdded.toLocaleString('pt-BR')}`,
        subtitle: 'Linhas de código',
        description: `-${stats.linesDeleted.toLocaleString('pt-BR')} removidas`,
        titleSize: 140,
        background: backgrounds[5],
      };
    case 6:
      return {
        title: stats.developerProfile,
        subtitle: 'Seu perfil de desenvolvedor',
        titleSize: 70,
        background: backgrounds[6],
      };
    case 7:
      return {
        title: `${year} Wrapped`,
        subtitle: 'Seu ano em código',
        description: `${stats.totalCommits.toLocaleString('pt-BR')} commits • ${stats.totalRepos} repos`,
        titleSize: 100,
        background: backgrounds[7],
      };
    default:
      return {
        title: `Git Wrapped ${year}`,
        subtitle: 'Seu ano em código',
        titleSize: 100,
        background: backgrounds[0],
      };
  }
}
