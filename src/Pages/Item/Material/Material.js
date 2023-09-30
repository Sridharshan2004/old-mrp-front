import React, { useCallback, useEffect, useState } from 'react'
import dataService from "../../../Service/dataService"
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify'
import Select from 'react-select';

const Material = () => {

  const [materialName, setMaterialName] = useState('');
  const [variantCode, setvariantCode] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [measureId, setMeasureId] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [listCategory, setListCategory] = useState([]);
  const [listMeasure, setListMeasure] = useState([]);
  const [listSupplier, setListSupplier] = useState([]);
  const [quantity, setQuantity] = useState(0);
  const [committed, setCommitted] = useState(0);
  const [expected, setExpected] = useState(0);

  const { materialId } = useParams();
  const isEditMode = !!materialId;

  const showToastMessage = () => {
    toast.success('SUCCESS', {
      position: toast.POSITION.BOTTOM_RIGHT
    })
  }

  const navigate = useNavigate();

  const submitform = (event) => {
    event.preventDefault();
    const postDate = {
      materialName: materialName,
      variantCode: variantCode,
      price: price,
      description: description,
      categoryId: categoryId,
      measureId: measureId,
      supplierId: supplierId,
      committed: committed,
      expected:expected,
      quanity: quantity

    }

    if (isEditMode) {
      console.log("UPDATE MATERIAL", postDate);
      dataService.putexe(`material/material/${materialId}`, postDate)
        .then(response => {
          console.log("SUCCESS- UPDATE MATERIAL", response.data);
          showToastMessage();
          navigate("/items/materials")
        })
        .catch(error => {
          console.error("ERROR- UPDATE MATERIAL", error);
        })
    }
    else {
      console.log("NEW MATERIAL", postDate);
      dataService.postexe("material/material", postDate)
        .then(response => {
          console.log("SUCCESS- ADD MATERIAL", response.data);
          showToastMessage();
          navigate("/items/materials")
        })
        .catch(error => {
          console.error("ERROR- ADD MATERIAL", error);
        })
    }
  }

  const initCategory = () => {
    const arr = [];
    dataService.getexe(`category/category`)
      .then(response => {
        console.log("SUCCESS- GET CATEGORY", response.data);
        let result = response.data.list;
        result.map((opt) => {
          return arr.push({ value: opt.id, label: opt.categoryName })
        })
        setListCategory(arr)
      })
      .catch(error => {
        console.error("ERROR- GET CATEGORY", error);
      })
  }

  const initMeasure = () => {
    const arr = [];
    dataService.getexe(`unit/unit`)
      .then(response => {
        console.log("SUCCESS- GET MEASURE", response.data);
        let result = response.data.list;
        result.map((opt) => {
          return arr.push({ value: opt.id, label: opt.name })
        })
        setListMeasure(arr)
      })
      .catch(error => {
        console.error("ERROR- GET MEASURE", error);
      })
  }

  const initSupplier = () => {
    const arr = [];
    dataService.getexe(`supplier/supplier`)
      .then(response => {
        console.log("SUCCESS- GET SUPPLIER", response.data);
        let result = response.data.list;
        result.map((opt) => {
          return arr.push({ value: opt.id, label: opt.supplierName })
        })
        setListSupplier(arr)
      })
      .catch(error => {
        console.error("ERROR- GET SUPPLIER", error);
      })
  }

  useEffect(() => {
    initCategory();
    initMeasure();
    initSupplier();
  }, []);

  const initMaterials = useCallback(() => {
        
    dataService.getexe(`material/material/${materialId}`)
    .then(response => {
        console.log("GET MATERIAL", response.data);
        if (response.data !== null) {
            
            setMaterialName(response.data.materialName);
            setCategoryId(response.data.category.id);
            setMeasureId(response.data.unitOfMeasure.id);
            setSupplierId(response.data.supplier.id);
            setvariantCode(response.data.variantCode);
            setPrice(response.data.price);
            setDescription(response.data.description);
            setQuantity(response.data.quanity);
            setCommitted(response.data.committed);
            setExpected(response.data.expected);
            
        }
        else {
            
        }
    })
    .catch(error => {
        console.error("ERROR - GET MATERIAL", error);
    })


},[materialId]);

useEffect(() => {
if (isEditMode) {
  initMaterials();
}
// initCustomers();
},[initMaterials,isEditMode] );

const handleChangeCategory = (selectedOption) => {
  setCategoryId(selectedOption ? selectedOption.value : null);
}
const handleChangeMeasure = (selectedOption) => {
  setMeasureId(selectedOption ? selectedOption.value : null);
}
const handleChangeSupplier = (selectedOption) => {
  setSupplierId(selectedOption ? selectedOption.value : null);
}

  return (
    <div className="container-fluid m-1">
      <div><h6>Add New Material</h6></div>

      <div className="row mb-5 text-muted">

        <div className="col">
          <form onSubmit={submitform}>
            <div className="row gx-3 mb-3">
              <div className="col-md-6 ">
                <label className="small mb-1 " htmlFor="imputMaterialName">Material Name</label>
                <input
                  className="form-control fs-6"
                  id="imputMaterialName"
                  type="text"
                  placeholder="Type Material Name"
                  value={materialName}
                  onChange={event => setMaterialName(event.target.value)}
                  required
                >
                </input>
              </div>
              <div className="col-md-6">
                <label className="small mb-1" htmlFor="inputCategory">Category</label>
                <Select
                  className='basic-single'
                  value={listCategory.find((option) => option.value === categoryId)}
                  options={listCategory}      
                  filterOption={(option, searchText) =>
                    option.label.toLowerCase().includes(searchText.toLowerCase())}
                  placeholder={"Select Category"}
                  onChange={handleChangeCategory}
                />
              </div>
            </div>
            <div className="row gx-3 mb-3">
              <div className="col-md-6">
                <label className="small mb-1" htmlFor="inputMeasure">Units of measure</label>
                <Select
                  className='basic-single'
                  value={listMeasure.find((option) => option.value === measureId)}
                  options={listMeasure}
                  filterOption={(option, searchText) =>
                    option.label.toLowerCase().includes(searchText.toLowerCase())}
                  placeholder={"Select measure"}
                  onChange={handleChangeMeasure}
                />
              </div>
              <div className="col-md-6">
                <label className="small mb-1" htmlFor="inputSupplier">Default Supplier</label>
                <Select
                  className='basic-single'
                  value={listSupplier.find((option) => option.value === supplierId)}
                  options={listSupplier}
                  filterOption={(option, searchText) =>
                    option.label.toLowerCase().includes(searchText.toLowerCase())}
                  placeholder={"Select supplier"}
                  onChange={handleChangeSupplier}
                />
              </div>
            </div>
            <table className='table table-bordered mt-4'>
              <thead className='table-active'>
                <tr>
                  <td><span className='text-muted'>Variant code / SKU</span></td>
                  <td><span className='text-muted'>Default purchase price</span></td>
                  <td><span className='text-muted'>In stock</span></td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td >
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control border-0 p-0"
                        placeholder="Eg: P-1, M-1"
                        value={variantCode}
                        onChange={event => setvariantCode(event.target.value)}
                      />
                    </div>
                  </td>
                  <td >
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control border-0 p-0"
                        placeholder="Type purchase price "
                        value={price}
                        onChange={event => setPrice(event.target.value)}
                      />
                    </div>
                  </td>
                  <td className='bg-secondary bg-opacity-10'>
                    
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control border-0 p-0"
                        placeholder="Type purchase price "
                        value={quantity}
                        onChange={event => setQuantity(event.target.value)}
                        readOnly
                        style={{backgroundColor:"#f0f1f2"}}
                      />
                      {/* <i className="fa fa-circle-exclamation"></i> */}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <table className='table table-bordered mt-4'>
              <thead className='table-active'>
                <tr>
                  <td><span className='text-muted'>Additional info</span></td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td >
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control border-0"
                        placeholder="Type comment here"
                        value={description}
                        onChange={event => setDescription(event.target.value)}
                      />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <div>
              <button className="btn btn-primary me-2" type="submit">{isEditMode ?'Update':'Save'}</button>
              <Link to="/items/materials" className="btn btn-secondary ">cancel</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Material