import { Metadata } from 'next';
import WrappedUserSlidePage from './ClientPage';

interface Props {
  params: Promise<{ slide: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slide } = await params;
  const { username: usernameParam, id } = await searchParams;
  
  // Se não tiver username (acesso direto sem compartilhar), título genérico
  // O Client Component vai lidar com o redirecionamento ou carregamento da sessão
  let username = typeof usernameParam === 'string' ? usernameParam : undefined;

  // Support for obfuscated username (id param)
  if (!username && typeof id === 'string') {
    try {
      username = atob(id);
    } catch (e) {
      // Ignore invalid base64
    }
  }

  const currentYear = new Date().getFullYear();
  const slideNumber = parseInt(slide, 10);

  // Use relative URL for OG image if username exists
  const ogImageUrl = username 
    ? `/api/og/${username}/${slide}` 
    : '/og-image.png'; // Fallback image if no username in URL
  
  // Slide-specific titles
  const slideTitles: Record<number, string> = {
    1: username ? `${username} fez muitos commits em ${currentYear}!` : `Veja seus commits em ${currentYear}!`,
    2: username ? `A linguagem favorita de ${username}` : `Descubra sua linguagem favorita!`,
    3: username ? `O padrão de código de ${username}` : `Qual seu padrão de código?`,
    4: username ? `O repositório favorito de ${username}` : `Descubra seu repositório favorito!`,
    5: username ? `${username} escreveu muitas linhas de código!` : `Quantas linhas você codou?`,
    6: username ? `O perfil de desenvolvedor de ${username}` : `Descubra seu perfil de dev!`,
    7: username ? `Retrospectiva Git ${currentYear} de ${username}` : `Sua Retrospectiva Git ${currentYear}`,
  };

  const title = slideTitles[slideNumber] || `Git Wrapped ${currentYear}`;
  const description = username 
    ? `Veja a retrospectiva Git de ${username}! Crie a sua também em Git Wrapped.` 
    : `Descubra sua atividade no GitHub estilo Spotify Wrapped.`;

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

export default WrappedUserSlidePage;
