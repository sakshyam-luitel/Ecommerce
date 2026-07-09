import './Product.css'
import ProductHeader from './ProductHeader.tsx'
import { useState } from 'react'
import axios from 'axios'

function Product(){
    const [product , setProduct] = useState<string>('')
    axios.get('http://127.0.0.1:8000/')
    
    return(
    <>
        <ProductHeader/>
        <div className="main">
      <div className="products-grid js-products-grid">

      </div>
    </div>
    </>
    )
}

export default Product