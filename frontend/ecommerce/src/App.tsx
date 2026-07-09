import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login/Login.tsx'
import Register from './pages/Register/Register.tsx'
import Product from './pages/Product/Product.tsx'

function App() {
  return (
    <>
      <Routes>
        <Route element={<Login />} path='/' />
        <Route element = {<Register/>} path = 'register'></Route>
        <Route element = {<Product />} path = 'product'></Route>
      </Routes>
    </>
  )
}

export default App