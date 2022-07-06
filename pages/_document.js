/* eslint-disable react/jsx-no-undef */
import Document, { Head, Html, Main, NextScript } from "next/dist/pages/_document";

class MyDocument extends Document {
render() {
    return (
        <Html lang="en">
        <Head>
            {/* <link rel="preload" href="/fonts/Roboto-Bold.ttf" as="font" crossOrigin="anonymous"></link> */}
            <link rel="preload" href="/fonts/Roboto-Medium.ttf" as="font" crossOrigin="anonymous"></link>
            <link rel="preload" href="/fonts/Roboto-Regular.ttf" as="font" crossOrigin="anonymous"></link>

        </Head>
        <body>
            <Main></Main>
            <NextScript />
        </body>
    </Html>
    );
};
};

export default MyDocument;
  
           
        