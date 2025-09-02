import localFont from 'next/font/local'

export const geist = localFont({
  src: [
    {
      path: './geist/Geist-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './geist/Geist-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: './geist/Geist-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],

  variable: '--font-geit'
});

export const poppins = localFont({
  src: [
    {
      path: './poppins/Poppins-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './poppins/Poppins-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: './poppins/Poppins-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],

  variable: '--font-poppins'
});


export const spaceGrotesk = localFont({
  src: [
    {
      path: './space-grotesk/SpaceGrotesk-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './space-grotesk/SpaceGrotesk-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: './space-grotesk/SpaceGrotesk-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],

  variable: '--font-space'
});

export const roboto = localFont({
  src: [
    {
      path: './roboto/Roboto-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './roboto/Roboto-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: './roboto/Roboto-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],

  variable: '--font-roboto-condensed'
});