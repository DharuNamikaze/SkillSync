import './App.css'
import { HashRouter,Routes,Route } from 'react-router-dom'
import { Landing } from './Pages/Landing'
import { Home } from './Pages/Home'

function App() {

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Landing/>}/>
        <Route path="/home" element={<Home/>}/>

      </Routes>
    </HashRouter>
  )
}

export default App