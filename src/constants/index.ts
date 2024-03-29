const env = import.meta.env

export const ENV: Record<string, string> = {
  nodeEnv: env.VITE_NODE_APP || 'development',
  locale: env.REACT_APP_I18N_LOCALE || 'en',
  baseUrlApi: env.VITE_API_URL || 'https://api-community.skyglab.tech/',
  websiteUrl: env.VITE_WEBSITE_URL || 'https://apartment-nest-fe.vercel.app/',
  recaptchaApiKey: env.VITE_RECAPTCHA_API_KEY || '6LdP4FIpAAAAAJH8bOtwC8JcHGEUjmE0135n2671'
}
