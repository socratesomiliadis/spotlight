import { PropsWithChildren } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { PageMeta } from '../types';

interface Props extends PropsWithChildren {
  meta?: PageMeta;
}

import { acidGrotesk } from '@/pages/_app';

export default function Layout({ children, meta: pageMeta }: Props) {
  return (
    <>
      <div className={`${acidGrotesk.className} layout-wrapper`}>
        {children}
      </div>
    </>
  );
}
