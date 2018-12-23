import React from "react";
import Document, { Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <html lang="es" dir="ltr">
        <Head>
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
          />
          <meta name="theme-color" content="#ffffff" />
          <meta
            name="description"
            content="Tejidos virtuales para el Emprendimiento, las Prácticas profesionales y la Empleabilidad."
          />
          <link rel="manifest" href="/static/manifest.json" />
          <link rel="shortcut icon" href="/static/favicon.ico" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="black-translucent"
          />
          <meta name="format-detection" content="telephone=no" />
          <meta name="apple-mobile-web-app-title" content="SEMontoya" />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/static/img/apple-touch-icon.png"
          />
          <link
            rel="mask-icon"
            href="/static/img/safari-pinned-tab.svg"
            color="#ffffff"
          />
          <meta name="msapplication-TileColor" content="#ffffff" />
          <meta
            name="msapplication-TileImage"
            content="/static/icons/icon-192x192.png"
          />
          <meta
            property="og:title"
            content="Tejidos virtuales para el Emprendimiento, las Prácticas profesionales y la Empleabilidad."
          />
          <meta property="og:locale" content="es_CO" />
          <meta property="og:type" content="website" />
          <meta property="og:image" content="icons/icon-128x128.png" />
          <meta property="og:site_name" content="Te vi EPE" />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"
          />
          <link
            rel="stylesheet"
            href="https://use.fontawesome.com/releases/v5.5.0/css/all.css"
            integrity="sha384-B4dIYHKNBt8Bc12p+WXckhzcICo0wtJAoU8YZTY5qE0Id1GSseTk6S+L3BlXeVIU"
            crossOrigin="anonymous"
          />
          <link rel="stylesheet" href="/static/css/nprogress.css" />
          <link rel="stylesheet" href="/static/css/bulma.min.css" />
          <link rel="stylesheet" href="/static/css/animate.min.css" />
          <link rel="stylesheet" href="/static/css/styles.css" />
          <link rel="stylesheet" href="/static/css/loading.css" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}

export default MyDocument;
