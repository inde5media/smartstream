import type { Platform, PlatformConfig } from '@/types';

export const PLATFORMS: Record<Platform, PlatformConfig> = {
  tv5monde: {
    id: 'tv5monde',
    name: 'TV5Monde',
    scheme: 'tv5monde://',
    webFallback: 'https://www.tv5monde.com',
    appStoreId: 'xxxxxxxxxxxx', // TODO: Get actual app store ID
    color: '#0066CC',
    icon: '/platforms/tv5monde.svg',
  },
  netflix: {
    id: 'netflix',
    name: 'Netflix',
    scheme: 'nflx://',
    webFallback: 'https://www.netflix.com',
    appStoreId: '363590051',
    color: '#E50914',
    icon: '/platforms/netflix.svg',
  },
  hbo: {
    id: 'hbo',
    name: 'Max',
    scheme: 'hbomax://',
    webFallback: 'https://www.max.com',
    appStoreId: '1497977514',
    color: '#5822B4',
    icon: '/platforms/hbo.svg',
  },
  disney: {
    id: 'disney',
    name: 'Disney+',
    scheme: 'disneyplus://',
    webFallback: 'https://www.disneyplus.com',
    appStoreId: '1446075923',
    color: '#113CCF',
    icon: '/platforms/disney.svg',
  },
  prime: {
    id: 'prime',
    name: 'Prime Video',
    scheme: 'aiv://',
    webFallback: 'https://www.amazon.com/gp/video',
    appStoreId: '545519333',
    color: '#00A8E1',
    icon: '/platforms/prime.svg',
  },
  apple: {
    id: 'apple',
    name: 'Apple TV+',
    scheme: 'videos://',
    webFallback: 'https://tv.apple.com',
    appStoreId: '1174078549',
    color: '#000000',
    icon: '/platforms/apple.svg',
  },
  hulu: {
    id: 'hulu',
    name: 'Hulu',
    scheme: 'hulu://',
    webFallback: 'https://www.hulu.com',
    appStoreId: '376510438',
    color: '#1CE783',
    icon: '/platforms/hulu.svg',
  },
};

export const PLATFORM_LIST = Object.values(PLATFORMS);

export function getPlatformConfig(platformId: string): PlatformConfig | undefined {
  return PLATFORMS[platformId as Platform];
}

export function getPlatformColor(platformId: string): string {
  return getPlatformConfig(platformId)?.color ?? '#666666';
}

export function getPlatformName(platformId: string): string {
  return getPlatformConfig(platformId)?.name ?? platformId;
}
