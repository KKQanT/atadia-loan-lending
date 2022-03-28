import { AppProps } from 'next/app';
import Head from 'next/head';
import { FC, useState, useEffect } from 'react';
import { ContextProvider } from '../contexts/ContextProvider';
import { AppBar } from '../components/AppBar';
import { ContentContainer } from '../components/ContentContainer';
import { Footer } from '../components/Footer';
import Notifications from '../components/Notification'
import { useRouter } from 'next/router';
import { LoadingComponent } from "../components/LoadingComponent"

require('@solana/wallet-adapter-react-ui/styles.css');
require('../styles/globals.css');

const App: FC<AppProps> = ({ Component, pageProps }) => {

    const router = useRouter();
    const [pageLoading, setPageLoading] = useState(false);
    useEffect(
      ()=>{
        const handleStart = () => { setPageLoading(true); };
        const handleComplete = () => { setPageLoading(false); };

        router.events.on('routeChangeStart', handleStart);
        router.events.on('routeChangeComplete', handleComplete);
        router.events.on('routeChangeError', handleComplete);
      }, [router]
    )

    return (
        <>
          <Head>
            <title>Atadian Loan Lending</title>
          </Head>

          <ContextProvider>
            <div className="flex flex-col h-screen">
              <Notifications />
              <AppBar/>
              <ContentContainer>
                <Component {...pageProps} />
              </ContentContainer>
              <Footer/>
            </div>
          </ContextProvider>
        </>
    );
};

export default App;
