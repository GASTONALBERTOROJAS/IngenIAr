import { getRequestConfig } from 'next-intl/server';
import { cookies, headers } from 'next/headers';

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const headersStore = await headers();
  
  const locale = cookieStore.get('locale')?.value || 
                 (headersStore.get('x-locale') ?? 'es');

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});