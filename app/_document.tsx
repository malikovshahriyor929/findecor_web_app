import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <script defer src="https://telegram.org/js/telegram-web-app.js?59">
        </script>
        <script
          async
          src="https://telegram.org/js/telegram-widget.js?22"
          data-telegram-login="Findecor"
          data-size="medium"
          data-onauth="onTelegramAuth(user)"
          data-request-access="write"
        />
      </Head>
      <body>
        <Main />       {/* Bu yerga barcha sahifa content kelyapti */}
        <NextScript /> {/* Next.js JavaScript kody */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              function onTelegramAuth(user) {
                alert('Logged in as ' + user.first_name + ' ' + user.last_name + ' (' + user.id + (user.username ? ', @' + user.username : '') + ')');
              }
            `,
          }}
        />
      </body>
    </Html>
  )
}
