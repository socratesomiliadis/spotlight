import { Html, Head, Main, NextScript } from "next/document";
import { helveticaNeue } from "./_app";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className={`${helveticaNeue.variable} font-helvetica antialiased`}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
