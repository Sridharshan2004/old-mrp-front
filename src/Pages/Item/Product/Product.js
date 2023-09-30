import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import ProductContent from './ProductContent';

const Product = () => {
  const location = useLocation();
  const [productId, setproductId] = useState(null);


  const handleProductId = (id) => {
    console.log("ID: ", id)
    setproductId(id);
  }

  useEffect(() => {
    const pathSegments = location.pathname.split('/');
    const pathProductId = pathSegments[pathSegments.length - 1];
    console.log("pathProductId", pathProductId)
    if (!isNaN(pathProductId)) {
      setproductId(parseInt(pathProductId));
    }
  }, [location.pathname]);

  return (
    <div>
      <div className="row m-0 " style={{ background: "#F0F8FF" }}>
        <div className='col-12 col-md-12 col-sm-12'>
          <div className="row">
            <ul 
              id="myTab" 
              role="tablist" 
              className="nav nav-tabs nav-pills flex-column flex-sm-row text-center border-0 rounded-nav" 
              style={{ background: "#F0F8FF" }}
            >
              <li className="nav-item flex-sm-fill">
                <Link
                  to={productId ? `new/${productId}` : "new"}
                  role="tab"
                  className={`nav-link border-0 text-uppercase font-weight-bold ${location.pathname === "/product/new" ? 'active' : ''}`}
                  data-toggle="tab"
                  aria-controls="home"
                  aria-selected="true"
                >
                  General info
                </Link>
              </li>
              <li className="nav-item flex-sm-fill">
                <Link
                  to={`pa/${location.pathname.split("/")[3]}/bom`}
                  className={`nav-link border-0 text-uppercase font-weight-bold ${!location.pathname.split("/")[3] ?'disabled':''} ${location.pathname.endsWith('/bom') ? 'active' : ''}`}
                  data-toggle="tab"
                  role="tab"
                  aria-controls="home"
                  aria-selected="true"
                  disabled={!location.pathname.split("/")[3]}
                >
                  Product recipe / BOM
                </Link>
              </li>
              <li className="nav-item flex-sm-fill">
                <Link
                  to={`pa/${location.pathname.split("/")[3]}/ops`}
                  className={`nav-link border-0 text-uppercase font-weight-bold ${!location.pathname.split("/")[3] ?'disabled':''} ${location.pathname.endsWith('/ops') ? 'active' : ''}   `}
                  data-toggle="tab"
                  role="tab"
                  aria-controls="home"
                  aria-selected="true"
                  // disabled={!location.pathname.split("/")[3]}
                >
                  Production Operations
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className='col d-none d-xxl-block'></div>
      </div>

      <div className="row">
        <ProductContent productId={productId} handleProductId={handleProductId} />
      </div>


    </div>
  )
}

export default Product