import Install from './pages/Install/Install'
import Home from './pages/Home/Home'


export default function App() {
  return ( window.ethereum ? <Home /> : <Install /> )
}
