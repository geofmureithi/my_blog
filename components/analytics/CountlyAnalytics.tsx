import Script from 'next/script'

import siteMetadata from '@/data/siteMetadata'

const CountlyScript = () => {
  return (
    <>
      <Script
        strategy="lazyOnload"
        onLoad={() => window.Countly.init()}
        src={`https://cdnjs.cloudflare.com/ajax/libs/countly-sdk-web/20.4.0/countly.min.js`}
      />

      <Script strategy="lazyOnload" id="countly-script">
        {`
            //some default pre init
            var Countly = Countly || {};
            Countly.q = Countly.q || [];

            //provide countly initialization parameters
            Countly.app_key = '${siteMetadata.analytics.countlyAppKey}';
            Countly.url = '${siteMetadata.analytics.countlySiteUrl}';

            Countly.q.push(['track_sessions']);
            Countly.q.push(['track_pageview']);
            Countly.q.push(['track_clicks']);
            Countly.q.push(['track_scrolls']);
            Countly.q.push(['track_links']);
            Countly.q.push(['collect_from_forms']);

            
        `}
      </Script>
    </>
  )
}

export default CountlyScript

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const logEvent = (action, category, label, value) => {
  // window.gtag?.('event', action, {
  //   event_category: category,
  //   event_label: label,
  //   value: value,
  // })
}
