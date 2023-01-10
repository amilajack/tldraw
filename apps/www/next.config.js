const withPWA = require('next-pwa')
const withTM = require('next-transpile-modules')
const { withPalette } = require('@palette.dev/webpack-plugin/next')

const {
  GITHUB_ID,
  GITHUB_API_SECRET,
  NODE_ENV,
  VERCEL_GIT_COMMIT_SHA,
  GA_MEASUREMENT_ID,
  PALETTE_ASSET_KEY,
  VERCEL_ENV,
} = process.env

const isProduction = NODE_ENV === 'production'

const withPalettePlugin = withPalette({
  key: PALETTE_ASSET_KEY,
  release: VERCEL_ENV === 'production',
})

module.exports = withPalettePlugin(
  withTM(['@tldraw/tldraw', '@tldraw/core'])(
    withPWA({
      reactStrictMode: true,
      pwa: {
        disable: !isProduction,
        dest: 'public',
      },
      env: {
        NEXT_PUBLIC_COMMIT_SHA: VERCEL_GIT_COMMIT_SHA,
        GA_MEASUREMENT_ID,
        GITHUB_ID,
        GITHUB_API_SECRET,
      },
    })
  )
)
