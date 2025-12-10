import { Metadata } from 'next';

interface Props {
  params: Promise<{ username: string; slide: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username, slide } = await params;
  const currentYear = new Date().getFullYear();
  const slideNumber = parseInt(slide, 10);

  // Base URL for the app
  const baseUrl = process.env.NEXTAUTH_URL || 'https://git-wrapped.vercel.app';
  
  // Generate OG image URL
  const ogImageUrl = `${baseUrl}/api/og/${username}/${slide}`;
  
  // Slide-specific titles
  const slideTitles: Record<number, string> = {
    1: `${username} fez muitos commits em ${currentYear}!`,
    2: `A linguagem favorita de ${username}`,
    3: `O padrão de código de ${username}`,
    4: `O repositório favorito de ${username}`,
    5: `${username} escreveu muitas linhas de código!`,
    6: `O perfil de desenvolvedor de ${username}`,
    7: `Retrospectiva Git ${currentYear} de ${username}`,
  };

  const title = slideTitles[slideNumber] || `Git Wrapped ${currentYear} - ${username}`;
  const description = `Veja a retrospectiva Git de ${username}! Crie a sua também em Git Wrapped.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: 'website',
      siteName: 'Git Wrapped',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export { default } from './page-client';
