import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Script from 'next/script';

const GoogleAds = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Устанавливаем флаг, что мы на клиенте
  }, []);

  if (!isClient) {
    return null; // Пока мы на сервере, не рендерим рекламу
  }

  return (
    <>
      <Head>
        {/* Добавление внешнего скрипта только для клиента */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4788836396603422"
          crossOrigin="anonymous"
        ></Script>
      </Head>
      {/* Рендеринг блока с рекламой */}
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-4788836396603422"
        data-ad-slot="7572544319"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
      <script>
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      </script>
    </>
  );
};

export default GoogleAds;
