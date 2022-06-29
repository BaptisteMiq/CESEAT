import dynamic from 'next/dynamic';
import { Provider as StyletronProvider, DebugEngine } from "styletron-react";
import { styletron } from '../styletron'
import 'mapbox-gl/dist/mapbox-gl.css';

const debug =
  process.env.NODE_ENV === "production" ? void 0 : new DebugEngine();


const App = dynamic(() => import('../components/AppShell'), {
  ssr: false,
});

export default function Index() {
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [subscription, setSubscription] = useState(null)
  const [registration, setRegistration] = useState(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && window.workbox !== undefined) {
      // run only in browser
      navigator.serviceWorker.ready.then(reg => {
        reg.pushManager.getSubscription().then(sub => {
          if (sub && !(sub.expirationTime && Date.now() > sub.expirationTime - 5 * 60 * 1000)) {
            setSubscription(sub)
            setIsSubscribed(true)
          }
        })
        setRegistration(reg)
      })
    }
  }, [])
  return (
    <StyletronProvider value={styletron} debug={debug} debugAfterHydration>
        <App />
    </StyletronProvider>
    )
}
