import Home from './pages/Home/Home'
import Install from './pages/Install/Install'


export default function App() {
    if(window.ethereum) {
      return (
        <Home />
      )
    }else {
      return (
        <Install />
      )
    }
}
