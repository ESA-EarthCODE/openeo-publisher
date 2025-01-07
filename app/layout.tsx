import {AppRouterCacheProvider} from "@mui/material-nextjs/v13-appRouter";
import {Roboto} from 'next/font/google';
import theme from "./theme";
import {ThemeProvider} from "@mui/material/styles";
import {NavBar} from "@/components/NavBar";
import {Toasts} from "@/components/Toasts";

import '@/styles/global.css';
import {Metadata} from "next";

const roboto = Roboto({
    weight: ['300', '400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-roboto',
});


export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className='p-0 m-0'>
        <body className={`${roboto.className} p-0 m-0` }>
        <AppRouterCacheProvider>
            <ThemeProvider theme={theme}>
                <NavBar></NavBar>
                <div className='p-10'>
                    {children}
                </div>
                <Toasts />
            </ThemeProvider>
        </AppRouterCacheProvider>
        </body>
        </html>
    );
}
