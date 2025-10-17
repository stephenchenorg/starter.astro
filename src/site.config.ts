export default {
  name: '新的 Astro 網站',
  description: '新的 Astro 描述',

  apiBaseUrl: import.meta.env.API_BASE_URL.replace(/\/$/, ''),
  ga4TrackingId: import.meta.env.GA4_TRACKING_ID,
  gtmId: import.meta.env.GTM_ID,
  lineTagId: import.meta.env.LINE_TAG_ID,
  clarityId: import.meta.env.CLARITY_ID,
  fbPixelId: import.meta.env.FB_PIXEL_ID,
}
