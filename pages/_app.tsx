import '../styles/globals.css'

type Props = {
  Component: React.FunctionComponent,
  pageProps: Record<string, unknown>
}

export default function App({ Component, pageProps }: Props) {
  return <Component {...pageProps} />
}
