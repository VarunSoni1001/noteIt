import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>noteIt - Your simple and stylish note companion! by Varun Soni</title>
        <meta
          name="description"
          content="noteIt - Your simple and stylish note companion! Elevate your note-taking experience with personalized colors, easy editing, and hassle-free removal. Securely authenticate with Firebase, and embrace a sleek dark theme option. Unleash your creativity—add titles, content, and vibrant colors to your notes effortlessly!"
        />
        <meta name="author" content="Varun Soni" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://noteit.vercel.app" />
        <meta property="og:title" content="noteIt" />
        <meta
          property="og:description"
          content="noteIt - Your simple and stylish note companion! Elevate your note-taking experience with personalized colors, easy editing, and hassle-free removal. Securely authenticate with Firebase, and embrace a sleek dark theme option. Unleash your creativity—add titles, content, and vibrant colors to your notes effortlessly!"
        />
        <meta property="og:image" content="/android-chrome-512x512.png" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://noteit.vercel.app" />
        <meta property="twitter:title" content="noteIt" />
        <meta
          property="twitter:description"
          content="noteIt - Your simple and stylish note companion! Elevate your note-taking experience with personalized colors, easy editing, and hassle-free removal. Securely authenticate with Firebase, and embrace a sleek dark theme option. Unleash your creativity—add titles, content, and vibrant colors to your notes effortlessly!"
        />
        <meta property="twitter:image" content="/android-chrome-512x512.png" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@1,900,700,500,301,701,300,501,401,901,400,2&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
