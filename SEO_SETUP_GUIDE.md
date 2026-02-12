# LabourSampark - SEO Setup Guide

## Overview
This document outlines the complete SEO implementation for LabourSampark platform.

## Files Created/Updated

### 1. **app/layout.tsx** (Updated)
- Comprehensive metadata including:
  - Title and description
  - Keywords
  - OpenGraph tags for social sharing
  - Twitter Card tags
  - Manifest link for PWA
  - Google verification meta tag

### 2. **app/robots.ts** (Created)
- Dynamic robots.txt generation
- Allows/disallows for different user agents
- Sitemap reference
- Host configuration

### 3. **app/sitemap.ts** (Created)
- Dynamic XML sitemap generation
- Includes all main pages:
  - Homepage (priority 1.0)
  - All Labours page (priority 0.8)
  - All Contractors page (priority 0.8)
- Auto-updates lastModified dates

### 4. **public/robots.txt** (Created)
- Backup robots.txt file
- Ensures search engines can find rules

### 5. **public/manifest.json** (Created)
- Progressive Web App manifest
- App metadata for mobile installation
- Icon definitions
- Theme colors

### 6. **lib/seo-config.ts** (Created)
- Centralized SEO configuration
- Schema.org JSON-LD for:
  - Organization information
  - Search action
- Social media links
- Feature list

### 7. **app/components/SEOHead.tsx** (Created)
- Reusable SEO component
- Handles meta tags dynamically
- Structured data injection
- Twitter/OpenGraph tags

## Next Steps for Google Integration

### 1. **Google Search Console**
```
1. Go to https://search.google.com/search-console
2. Add your domain: laboursampark.com
3. Verify ownership using one of:
   - DNS record (recommended)
   - HTML file upload
   - HTML meta tag
4. Update the verification meta tag in layout.tsx:
   verification: {
     google: "YOUR_VERIFICATION_CODE",
   }
5. Submit sitemap.xml at /sitemap.xml
6. Monitor coverage, performance, and errors
```

### 2. **Google Analytics 4**
```
1. Create GA4 property: https://analytics.google.com
2. Get your Measurement ID (G-XXXXXXXXX)
3. Add Google Analytics Script to layout.tsx (see example below)
```

### 3. **Google Tag Manager** (Optional but recommended)
```
1. Create container: https://tagmanager.google.com
2. Get your Container ID (GTM-XXXXXX)
3. Implement GTM script in layout.tsx
```

## Implementation Examples

### Add Google Analytics to layout.tsx:
```tsx
import Script from "next/script";

// Inside RootLayout component:
<Script
  strategy="afterInteractive"
  src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXX"
/>
<Script
  id="google-analytics"
  strategy="afterInteractive"
  dangerouslySetInnerHTML={{
    __html: `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-XXXXXXXXX');
    `,
  }}
/>
```

### Add Google Tag Manager to layout.tsx:
```tsx
// Add in <head>
<Script
  id="gtm-script"
  strategy="afterInteractive"
  dangerouslySetInnerHTML={{
    __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXX');`,
  }}
/>

// Add in <body> (after opening body tag)
<noscript>
  <iframe
    src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXX"
    height="0"
    width="0"
    style={{ display: "none", visibility: "hidden" }}
  />
</noscript>
```

## SEO Checklist

### On-Page SEO ✓
- [x] Descriptive page titles
- [x] Meta descriptions
- [x] Keywords targeting
- [x] Heading hierarchy (H1, H2, H3)
- [x] Internal linking
- [x] Mobile responsiveness
- [x] Page speed optimization

### Technical SEO ✓
- [x] XML Sitemap (sitemap.ts)
- [x] Robots.txt (robots.ts)
- [x] Canonical URLs
- [x] Meta robots tags
- [x] Structured data (Schema.org)
- [x] SSL certificate (https://)
- [x] Fast page load times

### Off-Page SEO
- [ ] Google Search Console setup
- [ ] Google Analytics setup
- [ ] Backlink building
- [ ] Social media presence
- [ ] Business listings (Google My Business)
- [ ] Press releases

### Content SEO
- [ ] Keyword research
- [ ] Content optimization
- [ ] Regular content updates
- [ ] Internal linking strategy
- [ ] User engagement metrics

## URL Structure for SEO
```
https://laboursampark.com                    [Homepage]
https://laboursampark.com/labours/all        [All Labourers]
https://laboursampark.com/contractors/all    [All Contractors]
https://laboursampark.com/robots.txt         [Robots file]
https://laboursampark.com/sitemap.xml        [Sitemap]
https://laboursampark.com/manifest.json      [PWA Manifest]
```

## Important Configuration for Production

### Update in layout.tsx before going live:
1. Replace "your-google-verification-code" with actual Google Search Console code
2. Add Google Analytics ID (if using GA4)
3. Add Google Tag Manager ID (if using GTM)
4. Update URL from "laboursampark.com" to your actual domain
5. Update contact email "support@laboursampark.com"

### Update in robots.ts and public/robots.txt:
- Change "https://laboursampark.com" to your actual domain

### Update in public/manifest.json:
- Update "name", "short_name" if needed
- Ensure theme_color matches your brand

## Monitoring & Maintenance

### Monthly Tasks:
- Check Google Search Console for errors
- Review search analytics
- Monitor page speed (Core Web Vitals)
- Check for crawl errors

### Quarterly Tasks:
- Update sitemap with new pages
- Review and update content
- Build backlinks
- Analyze competitor SEO

## Additional Resources
- Google Search Central: https://developers.google.com/search
- Schema.org: https://schema.org
- OpenGraph Protocol: https://ogp.me
- Twitter Cards: https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards
