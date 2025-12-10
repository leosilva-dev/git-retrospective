import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

export async function GET() {
  try {
    const currentYear = new Date().getFullYear();

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
            background: 'linear-gradient(135deg, #1DB954, #1ED760, #34d399)',
            fontFamily: 'Inter, sans-serif',
            textAlign: 'center',
          }}
        >
          {/* Decorative blurs */}
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
              zIndex: 10,
            }}
          >
            <h1
              style={{
                fontSize: 200,
                fontWeight: 900,
                color: 'white',
                margin: 0,
                lineHeight: 1,
                textShadow: '0 4px 30px rgba(0,0,0,0.3)',
              }}
            >
              {currentYear}
            </h1>
            <p
              style={{
                fontSize: 48,
                color: 'rgba(255,255,255,0.9)',
                margin: 0,
                marginTop: 20,
                fontWeight: 600,
                letterSpacing: '0.05em',
              }}
            >
              Seu Ano em Código
            </p>
          </div>

          <div
             style={{
               position: 'absolute',
               bottom: 40,
               fontSize: 24,
               color: 'rgba(255,255,255,0.6)',
             }}
          >
            Git Wrapped
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
