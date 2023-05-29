import '@/styles/globals.css'
import { Tinos } from 'next/font/google'

const tinos = Tinos({subsets: ['latin'], weight: ['400', '700']})

export default function App({ Component, pageProps }) {
  return (
    <>
      <style jsx global>{`
        html {
          font-family: ${tinos.style.fontFamily};
        }
      `}</style>
      <Component {...pageProps} />
    </>
  )

}
