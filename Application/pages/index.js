import dynamic from 'next/dynamic';
import { Provider as StyletronProvider, DebugEngine } from "styletron-react";
import { styletron } from '../styletron'

const debug =
  process.env.NODE_ENV === "production" ? void 0 : new DebugEngine();


const App = dynamic(() => import('../components/AppShell'), {
  ssr: false,
});

export default function Index() {
  return (
    <StyletronProvider value={styletron} debug={debug} debugAfterHydration>
        <App />
    </StyletronProvider>
    )
}
