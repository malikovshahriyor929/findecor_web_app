import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <script src="https://telegram.org/js/telegram-web-app.js" />
      </Head>
      <body>
        <Main />       {/* Bu yerga barcha sahifa content kelyapti */}
        <NextScript /> {/* Next.js JavaScript kody */}
      </body>
    </Html>
  )
}
