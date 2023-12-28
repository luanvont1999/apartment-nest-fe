const env = import.meta.env

export const ENV: Record<string, string> = {
  nodeEnv: env.VITE_NODE_APP || 'development',
  baseUrlApi: env.VITE_APP_PROXY || 'https://api-community.skyglab.tech',
  locale: env.REACT_APP_I18N_LOCALE || 'en',
  websiteUrl: 'https://apartment-nest-fe.vercel.app'
}
