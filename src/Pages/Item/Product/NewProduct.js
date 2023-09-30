import React, { useCallback, useEffect, useState } from 'react'
import dataService from "../../../Service/dataService"
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify'
import Select from 'react-select';

const NewProduct = ({ handleProductId }) => {

    // const [productType, setProductType] = useState('make');
    const [productName, setProductName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [variantsCode, setVariantsCode] = useState('');
    const [measureId, setMeasureId] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [listCategory, setListCategory] = useState([]);
    const [listMeasure, setListMeasure] = useState([]);
    const [listBom, setListBom] = useState([]);
    const [listOperation, setListOperation] = useState([]);
    const [totalIngredientsCost, setTotalIngredientsCost] = useState(0);
    const [totalOperationCost, setTotalOperationCost] = useState(0);
    const [quantity, setQuantity] = useState(0);

    const { id } = useParams();
    const isEditMode = !!id;
    console.log("Mode", isEditMode);

    const showToastMessage = () => {
        toast.success('SUCCESS', {
            position: toast.POSITION.BOTTOM_RIGHT
        })
    }

    const navigate = useNavigate();

    const submitform = (event) => {
        event.preventDefault();
        const postDate = {
            productName: productName,
            price: price,
            description: description,
            variantsCode: variantsCode,
            measureId: measureId,
            categoryId: categoryId
        }
        console.log("NEW PRODUCT", postDate);
        if (isEditMode) {
            console.log("UPDATE PRODUCT", postDate);
            dataService.putexe(`product/product/${id}`, postDate)
                .then(response => {
                    console.log("SUCCESS- ADD CUSTOMER", response.data);
                    showToastMessage();
                    navigate("/items/products")
                })
                .catch(error => {
                    console.error("ERROR- ADD PRODUCT", error);
                })
        }
        else {
            dataService.postexe("product/product", postDate)
                .then(response => {
                    console.log("SUCCESS- ADD PRODUCT", response.data);
                    // const id = response.data.id;
                    showToastMessage();
                    handleProductId(response.data.id);
                    navigate(`/product/new/${response.data.id}`)
                })
                .catch(error => {
                    console.error("ERROR- ADD PRODUCT", error);
                })
        }
    }

    const initProducts = useCallback(() => {

        dataService.getexe(`product/product/${id}`)
            .then(response => {
                console.log("GET PRODUCT", response.data);
                if (response.data !== null) {
                    setProductName(response.data.productName);
                    setPrice(response.data.price);
                    setDescription(response.data.description);
                    setVariantsCode(response.data.variantsCode);
                    setMeasureId(response.data.unitOfMeasure.id);
                    setCategoryId(response.data.category.id);
                    setListBom(response.data.bom);
                    setListOperation(response.data.productOperation);
                    setQuantity(response.data.quantity);
                }
                else {

                }
            })
            .catch(error => {
                console.error("ERROR - GET PRODUCT", error);
            })


    }, [id]);

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



    useEffect(() => {
        initCategory();
        initMeasure();

    }, []);

    useEffect(() => {
        if (isEditMode) {
            initProducts();
        }
        // initCustomers();
    }, [initProducts, isEditMode]);

    useEffect(() => {

        const calculateTotalCost = () => {
            let ingredientsCost = 0;
            let operationCost = 0;

            // Calculate ingredients cost from listBom
            for (const item of listBom) {
                ingredientsCost += item.material.price * item.quantity;
            }

            // Calculate operation cost from listOperation
            for (const item of listOperation) {
                const [hours, minutes, seconds] = item.time.split(':').map(Number);
                const decimalHours = hours + (minutes / 60) + (seconds / 3600);
                const cost = decimalHours * item.cost;
                operationCost += cost;
            }
            setTotalIngredientsCost(ingredientsCost);
            setTotalOperationCost(operationCost);
        }

        calculateTotalCost();

    }, [isEditMode, listBom, listOperation])

    return (
        <div className="container-fluid m-1">
            <div className="row mt-3 mb-5 text-muted">
                <div className="col">
                    <form onSubmit={submitform}>
                        <div className="row gx-3 mb-3">
                            <div className="col-md-6 ">
                                <label className="small mb-1 " htmlFor="inputProductName">Product Name</label>
                                <input
                                    className="form-control fs-6"
                                    id="inputProductName"
                                    type="text"
                                    placeholder="Type product Name"
                                    value={productName}
                                    onChange={event => setProductName(event.target.value)}
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
                                    onChange={event => setCategoryId(event.value)}
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
                                    placeholder={"Select Category"}
                                    onChange={event => setMeasureId(event.value)}
                                />
                            </div>
                            {/* <div className="col-md-6">
                                <label className="small mb-2" htmlFor="inputContactNo"> Product</label><br></br>
                                <div className="form-check checkbox-xl form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="checkbox" id="inlineCheckbox1"
                                        value="make"
                                        checked={productType === 'make'}
                                        onChange={event => setProductType(event.target.value)}
                                    />
                                    <label className="form-check-label" htmlFor="inlineCheckbox1">I make this product</label>
                                </div>
                                <div className="form-check checkbox-xl form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="checkbox" id="inlineCheckbox2"
                                        value="buy"
                                        checked={productType === 'buy'}
                                        onChange={event => setProductType(event.target.value)}
                                    />
                                    <label className="form-check-label" htmlFor="inlineCheckbox2">I buy this product</label>
                                </div>
                            </div> */}
                        </div>
                        <table className='table table-bordered mt-4'>
                            <thead className='table-active'>
                                <tr>
                                    <td><span className='text-muted'>Variant code / SKU</span></td>
                                    <td><span className='text-muted'>Default sales price</span></td>
                                    <td><span className='text-muted'>Ingredients cost</span></td>
                                    <td><span className='text-muted'>operation cost</span></td>
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
                                                value={variantsCode}
                                                onChange={event => setVariantsCode(event.target.value)}
                                                required
                                            />
                                        </div>
                                    </td>
                                    <td >
                                        <div className="input-group">
                                            <input
                                                type="text"
                                                className="form-control c border-0 p-0"
                                                placeholder="Type sales price "
                                                value={price}
                                                onChange={event => setPrice(event.target.value)}
                                            />
                                        </div>
                                    </td>
                                    <td className='bg-secondary bg-opacity-10'>
                                        <span className='p-0'>{isEditMode ? totalIngredientsCost : '0'} INR</span>
                                    </td>
                                    <td className='bg-secondary bg-opacity-10'>
                                        <span className='p-0'>{isEditMode ? totalOperationCost : '0'} INR</span>
                                    </td>
                                    <td className='bg-secondary bg-opacity-10'>
                                        <span className='p-0'>{isEditMode ? quantity : '0'} INR</span>
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
                                                placeholder="Notes"
                                                value={description}
                                                onChange={event => setDescription(event.target.value)}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div>
                            <button className="btn btn-primary me-2" type="submit">{isEditMode ? 'Update' : 'Save'}</button>
                            <Link to="/items/products" className="btn btn-secondary ">cancel</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default NewProduct