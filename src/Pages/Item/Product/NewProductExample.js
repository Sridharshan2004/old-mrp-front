import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

const NewProductExample = () => {
    const navigate = useNavigate();
    const { productId } = useParams();
    const [activeTab, setActiveTab] = useState('general');
    const [product, setProduct] = useState({
      name: '',
      cost: '',
      code: ''
    });
    const [bom, setBOM] = useState([]);
    const [operation, setOperation] = useState([]);
  
    useEffect(() => {
      // Simulating fetching the product data from an API or database
      // and updating the form fields for editing
      if (productId) {
        // Fetch the product data by productId and update the form fields
        const fetchedProductData = {
          name: 'Product Name', // Replace with actual fetched data
          cost: 'Product Cost', // Replace with actual fetched data
          code: 'Product Code' // Replace with actual fetched data
        };
        setProduct(fetchedProductData);
      }
    }, [productId]);
  
    const handleTabChange = (tab) => {
      setActiveTab(tab);
    };
  
    const handleGeneralInfoChange = (e) => {
      const { name, value } = e.target;
      setProduct((prevProduct) => ({
        ...prevProduct,
        [name]: value
      }));
    };

    const handleBOMChange = (e, index) => {
        const { name, value } = e.target;
        setBOM((prevBOM) => {
          const updatedBOM = [...prevBOM];
          updatedBOM[index][name] = value;
          return updatedBOM;
        });
      };
    
      const handleAddMaterial = () => {
        setBOM((prevBOM) => [...prevBOM, { material: '', quantity: '' }]);
      };
    
      const handleRemoveMaterial = (index) => {
        setBOM((prevBOM) => {
          const updatedBOM = [...prevBOM];
          updatedBOM.splice(index, 1);
          return updatedBOM;
        });
      };
    
      const handleOperationChange = (e, index) => {
        const { name, value } = e.target;
        setOperation((prevOperation) => {
          const updatedOperation = [...prevOperation];
          updatedOperation[index][name] = value;
          return updatedOperation;
        });
      };
    
      const handleAddOperation = () => {
        setOperation((prevOperation) => [...prevOperation, { step: '', description: '' }]);
      };
    
      const handleRemoveOperation = (index) => {
        setOperation((prevOperation) => {
          const updatedOperation = [...prevOperation];
          updatedOperation.splice(index, 1);
          return updatedOperation;
        });
      };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      console.log(product);
  
      const id= 2;
      navigate(`/newproductexample/${id}`);
      // Perform any necessary actions, such as saving the product data to the API or database
  
      // Navigate to the appropriate page based on the productId
    //   if (productId) {
    //     navigate(`/newproductexample/new/${id}`);
    //   } else {
    //     // Replace with the appropriate route for adding a new product
    //     navigate('/newproductexample/new');
    //   }
    };
  return (
    <div>
      <h1>{productId ? 'Edit Product' : 'Add Product'}</h1>
      <ul className="nav nav-tabs">
        <li className={`nav-item ${activeTab === 'general' ? 'active' : ''}`}>
          <Link
            className="nav-link"
            to={`/newproductexample${productId ? `/${productId}` : ''}`}
            onClick={() => handleTabChange('general')}
          >
            General Information
          </Link>
        </li>
        <li className={`nav-item ${activeTab === 'bom' ? 'active' : ''}`}>
          <Link
            className="nav-link"
            to={`/newproductexample/${productId}/bom`}
            onClick={() => handleTabChange('bom')}
          >
            Product BOM
          </Link>
        </li>
        <li className={`nav-item ${activeTab === 'operation' ? 'active' : ''}`}>
          <Link
            className="nav-link"
            to={`/newproductexample/${productId}/ops`}
            onClick={() => handleTabChange('operation')}
          >
            Product Operation
          </Link>
        </li>
      </ul>

      <div className="tab-content">
        {activeTab === 'general' && (
          <form onSubmit={handleSubmit}>
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={product.name}
                onChange={handleGeneralInfoChange}
              />
            </label>
            <br />
            <label>
              Cost:
              <input
                type="text"
                name="cost"
                value={product.cost}
                onChange={handleGeneralInfoChange}
              />
            </label>
            <br />
            <label>
              Code:
              <input
                type="text"
                name="code"
                value={product.code}
                onChange={handleGeneralInfoChange}
              />
            </label>
            <br />
            <button type="submit">{productId ? 'Update' : 'Add'}</button>
          </form>
        )}

        {/* Rest of the code for BOM and Operation sections */}
        {activeTab === 'bom' && (
          <div>
            {bom.map((material, index) => (
              <div key={index}>
                <label>
                  Material:
                  <input
                    type="text"
                    name="material"
                    value={material.material}
                    onChange={(e) => handleBOMChange(e, index)}
                  />
                </label>
                <br />
                <label>
                  Quantity:
                  <input
                    type="text"
                    name="quantity"
                    value={material.quantity}
                    onChange={(e) => handleBOMChange(e, index)}
                  />
                </label>
                <br />
                <button type="button" onClick={() => handleRemoveMaterial(index)}>
                  Remove Material
                </button>
              </div>
            ))}
            <button type="button" onClick={handleAddMaterial}>
              Add Material
            </button>
          </div>
        )}

        {activeTab === 'operation' && (
          <div>
            {operation.map((step, index) => (
              <div key={index}>
                <label>
                  Step:
                  <input
                    type="text"
                    name="step"
                    value={step.step}
                    onChange={(e) => handleOperationChange(e, index)}
                  />
                </label>
                <br />
                <label>
                  Description:
                  <textarea
                    name="description"
                    value={step.description}
                    onChange={(e) => handleOperationChange(e, index)}
                  />
                </label>
                <br />
                <button type="button" onClick={() => handleRemoveOperation(index)}>
                  Remove Step
                </button>
              </div>
            ))}
            <button type="button" onClick={handleAddOperation}>
              Add Step
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default NewProductExample