import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';

function DynamicMetaTags({ pageTitle, pageDescription }) {
  useEffect(() => {
    updateMetaTags();
  }, [pageTitle, pageDescription]);

  const updateMetaTags = () => {
    const metaTags = [
      { name: 'description', content: pageDescription },
      { property: 'og:title', content: pageTitle },
      { property: 'og:description', content: pageDescription },
      // Add more meta tags as needed
    ];

    const head = document.head;
    const existingTags = head.querySelectorAll('meta');

    existingTags.forEach((tag) => {
      if (tag.getAttribute('name') || tag.getAttribute('property')) {
        head.removeChild(tag);
      }
    });

    metaTags.forEach((tag) => {
      const metaTag = document.createElement('meta');
      Object.entries(tag).forEach(([key, value]) => {
        metaTag.setAttribute(key, value);
      });
      head.appendChild(metaTag);
    });
  };

  return (
    <Helmet>
      <title>{pageTitle}</title>
    </Helmet>
  );
}

export default DynamicMetaTags;
