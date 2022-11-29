import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";



import type { AppProps } from "next/app";
import Header from "../components/header";
import { Container } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import Head from 'next/head';
import { useEffect } from "react";


function App({
    Component,
    pageProps
}: AppProps) {
    useEffect(() => {
        import("bootstrap/dist/js/bootstrap.bundle");
    });
    return (
        <>
            <Head>
                <link rel="shortcut icon" href="/icon.png" />
                <title>AutoMarker</title>
            </Head>
            <Header />
            <ToastContainer />
            <main>

                <Component {...pageProps} />

            </main>
            
        </>
    )

}

export default App
