import React, { useCallback, useEffect, useState } from 'react'
import dataService from "../../Service/dataService"
import { useNavigate, useParams, Link } from 'react-router-dom';
import Select from 'react-select';

const NewSalesOrder = () => {

    const [customerId, setCustomerId] = useState('');
    const [deliveryDate, setDeliveryDate] = useState('');
    const [createdDate, setCreatedDate] = useState('');
    const [name, setName] = useState('');
    const [status, setStatus] = useState('');
    const [comments, setComments] = useState('');

    // const [quanitity, setQuanitity] = useState('');
    // const [price, setPrice] = useState('');
    // const [salesMaterialId, setSalesMaterialId] = useState('');
    const [totalProductUnits, setTotalProductUnits] = useState(0);
    const [totalProductCost, setTotalProductCost] = useState(0);
    const [locationId, setLocationId] = useState('');

    const [listProduct, setListProduct] = useState([]);
    const [listCustomer, setListCustomer] = useState([]);
    const [listLocation, setListLocation] = useState([]);

    const [salesOrderProduct, setSalesOrderProduct] = useState([
        { product: '', quantity: 1, price: 0, product_availability: 0, ingredient_availability: 3, production_status: 3,product_expected_date: null,ingredient_expected_date:null },
    ]);

    const [salesOrderModalVisible, setSalesOrderModalVisible] = useState(false);
    const [salesOrderMessageModalVisible, setSalesOrderMessageModalVisible] = useState(false);
    const [selectedRowIndex, setSelectedRowIndex] = useState(false);

    const [productId, setProductId] = useState('');
    const [createdDateMO, setCreatedDateMO] = useState('');
    const [productionDeadline, setProductionDeadline] = useState('');
    const [plannedQuantity, setPlannedQuantity] = useState(1);
    // const [listProduct, setListProduct] = useState([]);
    const [manufacturingOrder, setManufacturingOrder] = useState('');
    const [stock, setStock] = useState('');
    const [listProductBOM, setListProductBOM] = useState([]);
    const [listProductOperation, setListProductOperation] = useState([]);

    const navigate = useNavigate();

    const { salesId } = useParams();
    const isEditMode = !!salesId;

    // OPTION

    const options = [
        { value: 0, label: 'NOT STARTED' },
        { value: 1, label: 'WORK IN PROGESS' },
        { value: 2, label: 'DONE' }
    ]

    // FORMAT DATE

    const formatDate = (data) => {
        const date = new Date(data);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        return formattedDate
    }

    // SUMBIT FORM

    const submitform = (event) => {
        event.preventDefault();

        const updateSalesOrderProduct = salesOrderProduct.filter(
            (item) => item.product !== ''
        );

        const postDate = {
            customerId: customerId,
            deliveryDate: deliveryDate,
            createdDate: createdDate,
            name: name,
            status: status,
            locationId: locationId,
            comments: comments,
            orderProducts: updateSalesOrderProduct.map((item) => {
                return {
                    id: item.id,
                    productId: item.product.id,
                    quantity: item.quantity,
                    price: item.price, 
                    product_availability: item.product_availability,
                    product_expected_date: item.product_expected_date,
                    ingredient_availability: item.ingredient_availability,
                    ingredient_expected_date: item.ingredient_expected_date,
                    production_status: item.production_status,
                }
            })
        }
        if (isEditMode) {

            console.log("UPDATE SALES ORDER", postDate);

            dataService.putexe(`salesorders/salesorders/${salesId}`, postDate)
                .then(response => {
                    console.log("SUCCESS- UPDATE SALES ORDER", response.data);
                    navigate("/sell")
                })
                .catch(error => {
                    console.error("ERROR- UPDATE SALES ORDER", error);
                })
        }
        else {
            console.log("NEW SALES ORDER", postDate);
            dataService.postexe("salesorders/salesorders", postDate)
                .then(response => {
                    console.log("SUCCESS- ADD SALES ORDER", response.data)
                    navigate("/sell")
                })
                .catch(error => {
                    console.error("ERROR- ADD SALES ORDER", error);
                })
        }
    }

    // GET CUSTOMER

    const initCustomer = () => {
        const arr = [];
        dataService.getexe(`customer/customer`)
            .then(response => {
                console.log("SUCCESS- GET CUSTOMER", response.data);
                let result = response.data.list;
                result.map((opt) => {
                    return arr.push({ value: opt.id, label: opt.customerName })
                })
                setListCustomer(arr)
            })
            .catch(error => {
                console.error("ERROR- GET CUSTOMER", error);
            })
    }

    // GET LOCATION

    const initLocation = () => {
        const arr = [];
        dataService.getexe(`location/location`)
            .then(response => {
                console.log("SUCCESS- GET LOCATION", response.data);
                let result = response.data.list;
                result.map((opt) => {
                    return arr.push({ value: opt.id, label: opt.locationName })
                })
                setListLocation(arr)
            })
            .catch(error => {
                console.error("ERROR- GET LOCATION", error);
            })
    }

    //   GET PRODUCT

    const initProduct = () => {
        const arr = [];
        dataService.getexe(`product/product`)
            .then(response => {
                console.log("SUCCESS- GET PRODUCT", response.data);
                let result = response.data;
                result.map((opt) => {
                    return arr.push({ value: opt.id, label: opt.productName })
                })
                setListProduct(arr)
            })
            .catch(error => {
                console.error("ERROR- GET PRODUCT", error);
            })
    }

    //   GET PRODUCT

    const initProductGetByID = (id) => {
        return dataService.getexe(`product/product/${id}`)
            .then(response => {
                console.log("SUCCESS- GET PRODUCT", response.data);
                return response.data
            })
            .catch(error => {
                console.error("ERROR- GET PRODUCT", error);
            })
    }

    // GET SALES ORDER

    const initSalesOrder = useCallback(() => {

        dataService.getexe(`salesorders/salesorders/${salesId}`)
            .then(response => {
                console.log("GET MANUFACTURING ORDER BY ID", response.data);
                if (response.data !== null) {
                    setName(response.data.name);
                    setCustomerId(response.data.customer.id);
                    setStatus(response.data.status);
                    setLocationId(response.data.location.id);
                    setCreatedDate(formatDate(response.data.createdDate));
                    setDeliveryDate(formatDate(response.data.deliveryDate));
                    setComments(response.data.comments);
                    setSalesOrderProduct(response.data.salesOrderProduct);
                }
                else {

                }
            })
            .catch(error => {
                console.error("ERROR - GET SALES ORDER", error);
            })


    }, [salesId]);

    // useEffect

    useEffect(() => {
        initCustomer();
        initLocation();
        initProduct();
    }, []);

    useEffect(() => {

        // Calculate Product Total Cost & Unit
        const calculateProductTotal = (data) => {
            let totalCost = 0;
            let totalUnit = 0;
            data.forEach((item) => {
                const productCost = parseFloat(item.quantity) * parseFloat(item.price);
                const productUnit = parseFloat(item.quantity);
                totalCost += productCost;
                totalUnit += productUnit

            });
            setTotalProductCost(totalCost);
            setTotalProductUnits(totalUnit)
        };

        calculateProductTotal(salesOrderProduct);

    }, [salesOrderProduct])


    useEffect(() => {
        if (isEditMode) {
            initSalesOrder();
        }
    }, [initSalesOrder, isEditMode]);


    // ADD SALES ORDER ROW

    const addSalesOrderRow = () => {
        setSalesOrderProduct([...salesOrderProduct, { product: '', quantity: 1, price: 0 }]);
    };

    // Calculate product availability based on stock and quantity
    const calculateProductAvailability = (stockQuantity, orderQuantity) => {
        return stockQuantity >= orderQuantity ? 1 : 0;
    };

    // Calculate required ingredients and their availability
    const calculateRequiredIngredients = (bomIngredients, orderQuantity) => {
        console.log("Ing",bomIngredients,orderQuantity);
        return bomIngredients.map(ingredient => {
            return {
                material: ingredient.material,
                requiredQuantity: ingredient.quantity * orderQuantity
            };
        });
    };

    // Calculate ingredient availability based on required ingredients
    const calculateIngredientAvailability = (requiredIngredients) => {
        console.log("requiredIngredients",requiredIngredients);
        const allIngredientsAvailable = requiredIngredients.every(ingredient => {
            console.log(ingredient.material.quanity, ingredient.requiredQuantity);
            console.log(ingredient.material.quanity >= ingredient.requiredQuantity);
            return ingredient.material.quanity >= ingredient.requiredQuantity;
        });
        console.log("requiredIngredients-all",allIngredientsAvailable);
        return allIngredientsAvailable ? 1 : 0;
    };

    //  HANDLE CHANGE

    const handleSalesOrderRowChange = async (index, field, value) => {
        console.log(index, field, value);
        if (field === 'product') {
            const productData = await initProductGetByID(value.id);
            console.log(productData);
            const updatedRows = [...salesOrderProduct];
            updatedRows[index].price = productData.price;

            const productAvailability = calculateProductAvailability(productData.quantity, updatedRows[index].quantity);
            updatedRows[index].product_availability = productAvailability;

            if(productAvailability === 1){
                updatedRows[index].ingredient_availability = 3;
                updatedRows[index].production_status = 3;
            }
            else {
                const requiredIngredients = calculateRequiredIngredients(productData.bom, updatedRows[index].quantity);
                const ingredientAvailability = calculateIngredientAvailability(requiredIngredients);
                updatedRows[index].ingredient_availability = ingredientAvailability;
                updatedRows[index].production_status = 4;
            }
            console.log("productAvailability",updatedRows[index].product_availability);
            console.log("ingredientAvailability",updatedRows[index].ingredient_availability);
            console.log("ProductionStatus",updatedRows[index].production_status);

            setSalesOrderProduct(updatedRows);
        }
        else if (field === 'quantity') {

            const updatedRows = [...salesOrderProduct];
            const productid = updatedRows[index].product.id;
            const productData = await initProductGetByID(productid);
            console.log(productData);

            updatedRows[index].quantity = value;

            const productAvailability = calculateProductAvailability(productData.quantity, updatedRows[index].quantity);
            updatedRows[index].product_availability = productAvailability;

            if(productAvailability === 1){
                updatedRows[index].ingredient_availability = 3;
                updatedRows[index].production_status = 3;
            }
            else {
                const requiredIngredients = calculateRequiredIngredients(productData.bom, updatedRows[index].quantity);
                const ingredientAvailability = calculateIngredientAvailability(requiredIngredients);
                updatedRows[index].ingredient_availability = ingredientAvailability;
                updatedRows[index].production_status = 4;
            }
            
            console.log("productAvailability",updatedRows[index].product_availability);
            console.log("ingredientAvailability",updatedRows[index].ingredient_availability);
            console.log("ProductionStatus",updatedRows[index].production_status);
        }
        const updatedRows = [...salesOrderProduct];
        updatedRows[index][field] = value;
        setSalesOrderProduct(updatedRows);
    };

    const handleDeleteRow = async (index) => {
        const updatedRows = [...salesOrderProduct];
        const deletedRow = updatedRows.splice(index, 1)[0]; // Remove the row at the specified index
        setSalesOrderProduct(updatedRows);
        if (isEditMode && deletedRow.id) {
            console.log(deletedRow.id);
            const deleteProductData = await deleteform(deletedRow.id);
            console.log(deleteProductData)
        }
    }

    const handleChangeCustomer = (selectedOption) => {
        console.log("selectedOption", selectedOption)
        setCustomerId(selectedOption ? selectedOption.value : null);

    }

    const handleChangeLocation = (selectedOption) => {
        console.log("selectedOption", selectedOption)
        setLocationId(selectedOption ? selectedOption.value : null);

    }

    const handleChangeStatus = (selectedOption) => {
        console.log("selectedOption", selectedOption)
        setStatus(selectedOption ? selectedOption.value : null);

    }

    // DELETE CONTENT

    const deleteform = (id) => {
        return dataService.deleteexe(`salesorderproduct/salesorderproduct/${id}`)
            .then(response => {
                console.log("SUCCESS- DELETED SALES ORDER DATA", response.data);
                return response.data;
            })
            .catch(error => {
                console.error("ERROR- DELETED SALES ORDER DATA", error);
            })
    }

        // TIME IN TO SECOND

        const timeToDecimalSeconds = (data) => {
            const [hours, minutes, seconds] = data.split(':').map(Number);
            const totalSecond = hours * 3600 + minutes * 60 + seconds;
            return totalSecond;
        }

           // PRODUCT BOM

           const initProductBOM = useCallback((id) => {

            dataService.getexe(`bom/product/${id}/bom`)
                .then(response => {
                    console.log("SUCCESS - GET PRODUCT BOM DATA", response.data);
                    if (response.data !== '') {
    
                        const modifidArray = response.data.map(item => {
                            const availabilityStatus =
                                ((item.quantity * plannedQuantity) <= item.material.quanity) ? 1: 0;
    
                            return {
                                cost: item.material.price,
                                notes: '',
                                material: item.material,
                                total_actual_quantity: "",
                                planned_quantity_per_unit: item.quantity,
                                ingredient_availability: availabilityStatus,
    
                            }
                        })
                        setListProductBOM(modifidArray)
                    }
                    else {
                        setListProductBOM([]);
                    }
                })
                .catch(error => {
                    console.error("ERROR- GET PRODUCT BOM DATA", error);
                })
        }, [plannedQuantity])
    
        // PRODUCT OPERATION
    
        const initProductOperation = useCallback((id) => {
    
            dataService.getexe(`productoperation/product/${id}/productoperation`)
                .then(response => {
                    console.log("SUCCESS- GET PRODUCT OPERATION", response.data);
    
                    if (response.data !== '') {
                        const modifidArray = response.data.map(item => {
                            return {
                                operation: item.operation,
                                resource: item.resource,
                                user: null,
                                status: 0,
                                cost_per_hour: item.cost,
                                total_actual_time: "",
                                total_actual_cost: "",
                                planned_cost_per_unit: (item.cost * (timeToDecimalSeconds(item.time) / 3600)),
                                planned_time_per_unit: item.time,
    
                            }
                        })
                        setListProductOperation(modifidArray);
                    }
                    else {
                        setListProductOperation([]);
                    }
                })
                .catch(error => {
                    console.error("ERROR- GET PRODUCT OPERATION", error);
                })
        }, []);

    const initProductGet = (id) => {

        dataService.getexe(`product/product/${id}`)
            .then(response => {
                console.log("PRODUCT DATA", response.data);
                if (response.data !== "") {
                    console.log(response.data.quantity);
                    setStock(response.data.quantity)
                }
                else {
                    setStock(0)
                }
            })
            .catch(error => {
                console.error("ERROR", error);
            })
    }

        // UPDATE PRODUCT BOM

        const updateProductBOM = useCallback((qty) => {

            const updateBOM = listProductBOM.map(item => {
    
                const availabilityStatus =
                    ((item.planned_quantity_per_unit * qty) <= item.material.quanity) ? 1 : 0 ;
    
                return {
                    ...item,
                    ingredient_availability: availabilityStatus,
                }
            })
            console.log(updateBOM);
            setListProductBOM(updateBOM);
    
        }, [listProductBOM])

    const initDate = () => {
        const currentDate = new Date();

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(currentDate.getDate() + 7);

        const formattedTodayDate = currentDate.toISOString().slice(0, 10);
        const formattedSevenDaysAgo = sevenDaysAgo.toISOString().slice(0, 10);
        setProductionDeadline(formattedSevenDaysAgo);
        setCreatedDateMO(formattedTodayDate)
    }

    // const handleDelete = useCallback((item) => {
    //     console.log("Delete", item);
    //     console.log("Delete", item.id);
    //     setProductId(item.id);
    //     initProduct();
    //     initProductGet(item.id);
    //     initProductBOM(item.id);
    //     initProductOperation(item.id);
    // }, [initProductBOM,initProductOperation])

    const ItemSetRowData = (item, index) => {
        setSelectedRowIndex(index);
        setProductId(item.product.id)
        initProduct();
        initProductGet(item.product.id);
        initProductBOM(item.product.id);
        initProductOperation(item.product.id);
        initDate();
        console.log(item)
    }

    const handleMakeButtonClick = (item,index) => {
        if (isEditMode) {
            // Open the MO form
            // Your logic here for handling the MO form
            ItemSetRowData(item,index);
            setSalesOrderModalVisible(true);
        } else {
            // Show the pop-up message
            // Your logic here for showing the pop-up message
            setSalesOrderMessageModalVisible(true)
        }
    };

    const handleChangeProduct = (selectedOption) => {
        console.log("selectedOption", selectedOption)
        setProductId(selectedOption ? selectedOption.value : null);
    }

    const handleChangePlannedQuantity = (selectedOption) => {
        setPlannedQuantity(selectedOption ? selectedOption.target.value : null)
        updateProductBOM(selectedOption.target.value);
    }

    const SalesMessage = () => {

        return (
            <>
                <div className="modal-backdrop show"></div>
                <div className=" modal " style={{ display: 'block' }} tabIndex="-1" role="dialog" >
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content border-0">
                            <div className="modal-body p-0">
                                <div className="card border-0 p-sm-3 p-2 justify-content-center">
                                    <div className="card-header pb-0 bg-white border-0 ">
                                        <div className="row justify-content-end mb-3">
                                            <button type="button" className='btn btn-close' onClick={() => setSalesOrderMessageModalVisible(false)}></button>
                                        </div>
                                        <p className="font-weight-bold mb-2"> Please submit the form and then create a MO.</p>
                                    </div>
                                    <div className="card-body px-sm-4 mb-2 pt-1 pb-0">
                                        <div className="row justify-content-end no-gutters">
                                            <div className="col-auto">
                                                <button type="button" className="btn btn-light text-muted" onClick={() => setSalesOrderMessageModalVisible(false)}>Cancel</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    const manufacturingOrderContent = () => {

        const submitform = (event) => {
            event.preventDefault();
            const postDate = {
                productId: productId,
                status: 0,
                plannedQuantity: plannedQuantity,
                createdDate: createdDateMO,
                manufacturingOrder: manufacturingOrder,
                productionDeadline: productionDeadline,
                is_linked_to_sales_order: false,
                manufacturingOrderIngredientRequests: listProductBOM.map(item => {
                    return {
                        id: item.id,
                        cost: item.cost,
                        notes: item.notes,
                        material_id: item.material.id,
                        total_actual_quantity: item.total_actual_quantity,
                        planned_quantity_per_unit: item.planned_quantity_per_unit,
                        ingredient_availability: item.ingredient_availability,
                    };
                }),
                manufacturingOrderOperationRequests: listProductOperation.map(item => {
                    return {
                        id: item.id,
                        status: item.status,
                        cost_per_hour: item.cost_per_hour,
                        total_actual_time: item.total_actual_time,
                        total_actual_cost: item.total_actual_cost,
                        planned_cost_per_unit: item.planned_cost_per_unit,
                        planned_time_per_unit: item.planned_time_per_unit,
                        resource_id: item.resource.id,
                        operation_id: item.operation.id,
                        user_id: (item.user === null) ? null : item.user.id,
                    }
                })
            }
            console.log("NEW MANUFACTURING ORDER", postDate);
            dataService.postexe("manufacturingorder/manufacturingorder", postDate)
                .then(response => {
                    console.log("SUCCESS- ADD MANUFACTURING ORDER", response.data);

                    setSalesOrderModalVisible(false);
                    setListProductBOM([]);
                    setListProductOperation([]); 
                    setPlannedQuantity(1);
                    handleSalesOrderRowChange(selectedRowIndex, 'product_availability', 2)
                    handleSalesOrderRowChange(selectedRowIndex, 'product_expected_date',productionDeadline)
                    handleSalesOrderRowChange(selectedRowIndex, 'production_status',5)
                    handleSalesOrderRowChange(selectedRowIndex, 'ingredient_availability',4)
                })
                .catch(error => {
                    console.error("ERROR- ADD MANUFACTURING ORDER", error);
                })
        }

        return (
            <>
                <div className="modal-backdrop show"></div>
                <div className=" modal " style={{ display: 'block' }} tabIndex="-1" role="dialog" >
                    <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                        <div className="modal-content border-0">
                            <div className="modal-body p-0">
                                <div className="card border-0 p-sm-3 p-2 justify-content-center">
                                    <form onSubmit={submitform}>
                                        <div className="card-header pb-0 bg-white border-0 ">
                                            <div className="d-flex justify-content-between mb-3">
                                                <div><h5 className="modal-title">New Manufacturing Order</h5></div>
                                                <div><button type="button" className='btn btn-close' onClick={() => setSalesOrderModalVisible(false) > setListProductBOM([])> setListProductOperation([]) > setPlannedQuantity(1)} ></button></div>
                                            </div>
                                            <div className="col">
                                                <div className="row gx-3 mb-3">
                                                    <div className="col-md-6 ">
                                                        <label className="small mb-1 " htmlFor="imputMaterialName">Produc</label>

                                                        <input
                                                            className="form-control fs-6"
                                                            id="imputMaterialName"
                                                            type="text"
                                                            placeholder="Type cost per hour"
                                                            value={listProduct.find((option) => option.value === productId)?.label || ''}
                                                            onChange={handleChangeProduct}
                                                            readOnly
                                                            disabled
                                                        >
                                                        </input>
                                                    </div>
                                                </div>
                                                <div className="row gx-3 mb-3">

                                                    <div className="col-md-6 ">
                                                        <label className="small mb-1 " htmlFor="imputMaterialName">Quantity</label>
                                                        <input
                                                            className="form-control fs-6"
                                                            id="imputMaterialName"
                                                            type="text"
                                                            placeholder="Type cost per hour"
                                                            value={plannedQuantity}
                                                            // onChange={event => setPlannedQuantity(event.target.value)}
                                                            onChange={handleChangePlannedQuantity}
                                                        >
                                                        </input>
                                                    </div>
                                                    <div className="col-md-6 ">
                                                        <label className="small mb-1" htmlFor="inputCategory">Stock</label><br />
                                                        <input
                                                            className="form-control fs-6"
                                                            id="imputMaterialName"
                                                            type="text"
                                                            placeholder="Type cost per hour"
                                                            value={stock}
                                                            onChange={event => setStock(event.target.value)}
                                                            readOnly
                                                            disabled
                                                        >
                                                        </input>
                                                    </div>
                                                </div>
                                                <div className="row gx-3 mb-3">
                                                    <div className="col-md-6 ">
                                                        <label className="small mb-1 " htmlFor="imputMaterialName">Manufacturing Order#</label>
                                                        <input
                                                            className="form-control fs-6"
                                                            id="imputMaterialName"
                                                            type="text"
                                                            placeholder="MO-1 #"
                                                            onChange={event => setManufacturingOrder(event.target.value)}
                                                            required
                                                        >
                                                        </input>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-body px-sm-4 mb-2 pt-1 pb-0">
                                            <div className="row justify-content-end no-gutters">
                                                <div className="col-auto">
                                                    <button type="button" className="btn btn-light text-muted" onClick={() => setSalesOrderModalVisible(false) > setListProductBOM([])> setListProductOperation([]) > setPlannedQuantity(1)}>Cancel</button>
                                                </div>
                                                <div className="col-auto">
                                                    <button type="submit" className="btn btn-primary px-4" >save</button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
    

    return (
        <div className="container-fluid m-1">
            <div><h6>Create Sales order</h6></div>
            <div className="row mb-5 text-muted">
                <div className="col">
                    <form onSubmit={submitform}>
                        <div className="row gx-3 mb-3">
                            <div className="col-md-6 ">
                                <label className="small mb-1 " htmlFor="inputContactNo">Customer Name</label>
                                <Select
                                    className='basic-single'
                                    value={listCustomer.find((option) => option.value === customerId)}
                                    options={listCustomer}
                                    filterOption={(option, searchText) =>
                                        option.label.toLowerCase().includes(searchText.toLowerCase())}
                                    placeholder={"Select customer"}
                                    onChange={handleChangeCustomer}
                                />
                            </div>
                            <div className="col-md-6">
                                <div className="row gx-3 mb-3">
                                    <div className="col-md-6">
                                        <label className="small mb-1" htmlFor="inputContactNo">Delivery deadline</label>
                                        <input
                                            className="form-control fs-6"
                                            id="inputContactNo"
                                            type="date"
                                            value={deliveryDate}
                                            onChange={event => setDeliveryDate(event.target.value)}
                                        >
                                        </input>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="small mb-1" htmlFor="inputContactNo">Created date</label>
                                        <input
                                            className="form-control fs-6"
                                            id="inputContactNo"
                                            type="date"
                                            value={createdDate}
                                            onChange={event => setCreatedDate(event.target.value)}
                                        >
                                        </input>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className="row gx-3 mb-3">
                            <div className="col-md-6">
                                <label className="small mb-1" htmlFor="inputContactNo">Sales Order #</label>
                                <input
                                    className="form-control fs-6"
                                    id="inputContactNo"
                                    type="text"
                                    placeholder="SO-1"
                                    value={name}
                                    onChange={event => setName(event.target.value)}
                                >
                                </input>
                            </div>
                            <div className="col-md-6">
                                <div className="row gx-3 mb-3">
                                    <div className="col-md-6">
                                        <label className="small mb-1" htmlFor="inputContactNo">Ship From</label>
                                        <Select
                                            className='basic-single'
                                            value={listLocation.find((option) => option.value === locationId)}
                                            options={listLocation}
                                            filterOption={(option, searchText) =>
                                                option.label.toLowerCase().includes(searchText.toLowerCase())}
                                            placeholder={"Select Location"}
                                            onChange={handleChangeLocation}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="small mb-1" htmlFor="inputContactNo">Status</label>
                                        <Select
                                            className='basic-single'
                                            value={options.find((option) => option.value === status)}
                                            options={options}
                                            filterOption={(option, searchText) =>
                                                option.label.toLowerCase().includes(searchText.toLowerCase())}
                                            placeholder={"Select status"}
                                            onChange={handleChangeStatus}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <table className='table table-bordered mt-4'>
                            <thead className='table-active'>
                                <tr>
                                    <td><span className='text-muted'>Item</span></td>
                                    <td><span className='text-muted'>Quantity</span></td>
                                    <td><span className='text-muted'>Price per uint</span></td>
                                    <td><span className='text-muted'>Total price</span></td>
                                    <td><span className='text-muted'>Sales items</span></td>
                                    <td><span className='text-muted'>Ingredients</span></td>
                                    <td><span className='text-muted'>Production</span></td>
                                    <td><span className='text-muted'></span></td>
                                </tr>
                            </thead>
                            <tbody>
                                {salesOrderProduct.map((item, index) => (
                                    <tr key={index}>

                                        <td className='p-0'>
                                            <Select
                                                styles={{
                                                    control: provided => ({
                                                        ...provided,
                                                        border: 'none', // Remove the border
                                                        boxShadow: 'none',// Remove the box shadow
                                                    }),
                                                    indicatorSeparator: provided => ({
                                                        ...provided,
                                                        display: 'none', // Hide the indicator separator
                                                    }),
                                                    dropdownIndicator: provided => ({
                                                        ...provided,
                                                        display: 'none', // Hide the dropdown indicator
                                                    }),
                                                }}
                                                className='basic-single'
                                                value={listProduct.find((option) => option.value === (item.product === null ? 0 : item.product.id))}
                                                options={listProduct}
                                                filterOption={(option, searchText) =>
                                                    option.label.toLowerCase().includes(searchText.toLowerCase())}
                                                placeholder={"Select Item"}
                                                onChange={e => handleSalesOrderRowChange(index, 'product', { ...item.product, id: e.value })}
                                            />
                                        </td>

                                        <td>
                                            <input
                                                type='text'
                                                value={item.quantity}
                                                onChange={e => handleSalesOrderRowChange(index, 'quantity', e.target.value)}
                                            />
                                        </td>

                                        <td>
                                            <input
                                                type='text'
                                                value={item.price}
                                                onChange={e => handleSalesOrderRowChange(index, 'price', e.target.value)}
                                            />
                                        </td>

                                        <td>
                                            <span className='p-0'>{item.price * item.quantity}</span>
                                        </td>

                                        <td className={`${item.product !== '' ? (item.product_availability === 2 ? 'bg-warning' :
                                                                                    item.product_availability === 1 ? 'bg-success' : 'bg-danger') : ''} text-white`}>
                                            <span className='p-0'>{item.product !== '' ? (item.product_availability === 2 ? <pre className="small text-dark text-wrap m-0" style={{width:'6rem',fontFamily:'poppins'}}>EXPECTED {formatDate(item.product_expected_date)}</pre>:item.product_availability === 1 ? 'IN STOCK' : 'Not Available') : ''}</span>
                                        </td>

                                        <td className={`${item.product !== '' && item.ingredient_availability  !== 3 ? (item.ingredient_availability === 4 ? 'bg-warning':item.ingredient_availability === 1 ? 'bg-success' : 'bg-danger') : ''} text-white`}>
                                            <span className='p-0'>{item.product !== '' ? (item.ingredient_availability === 4? '':item.ingredient_availability === 1 ? 'IN STOCK' : 'Not Available') : ''}</span>
                                        </td>

                                        {/* <td className={`${item.product !== '' && item.production_status  !== 3 ? (item.production_status === 4 ? '' : item.production_status === 3 ? '':'bg-danger') : ''} text-white`}>
                                            <span className='p-0'>{item.product !== '' ? (item.production_status === 1 ? 'IN STOCK' : 
                                                item.production_status === 4 ? 
                                                    <button type="button" className="btn btn-sm text-primary  p-0">
                                                        <i className='fa fa-square-plus'></i> Make
                                                    </button>:'') : ''}</span>
                                        </td> */}

                                        <td className={`${item.product === ''? '':
                                                            item.production_status === 0 ? 'bg-danger':
                                                            item.production_status === 1 ? 'bg-warning':
                                                            item.production_status === 2 ? 'bg-success':
                                                            item.production_status === 3 ? '':
                                                            item.production_status === 4 ? '':
                                                            item.production_status === 5 ? 'bg-warning': ''} text-white`}>
                                            <span className='p-0'>
                                                    {item.product === ''? '':
                                                        item.production_status === 0 ? 'NOT STARTED':
                                                        item.production_status === 1 ? 'WORK IN PROGESS':
                                                        item.production_status === 2 ? 'PRODUCTION FINISHED':
                                                        item.production_status === 3 ? '':
                                                        item.production_status === 4 ? (
                                                            <button type="button" className="btn btn-sm text-primary  p-0" onClick={() => handleMakeButtonClick(item,index)}>
                                                                    <i className='fa fa-square-plus'></i> Make
                                                            </button>
                                                        ):
                                                        item.production_status === 5 ? <pre className="small text-dark text-wrap m-0" style={{width:'6rem',fontFamily:'poppins'}}>EXPECTED {formatDate(item.product_expected_date)}</pre>:''}
                                            </span>

                                        </td>

                                        <td>
                                            <button className="btn btn-sm text-secondary p-0" onClick={() => handleDeleteRow(index)}><i className='fa fa-trash'></i></button>
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button className="btn btn-sm btn-secondary opacity-75" type="button" onClick={addSalesOrderRow}>+ Add Row</button>

                        <div className='row'>
                            <div className='col-sm-7'></div>
                            <div className='col-sm-5'>
                                <hr className='border-3' />
                                <table className='table'>
                                    <tbody>
                                        <tr>
                                            <td>Total Units</td>
                                            <td className='text-end'>{totalProductUnits.toFixed(2)}</td>
                                        </tr>
                                        <tr>
                                            <td>Total Cost</td>
                                            <td className='text-end'>{totalProductCost.toFixed(2)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

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
                                                placeholder="Eg: Type comment here"
                                                value={comments}
                                                onChange={event => setComments(event.target.value)}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div>
                            <button className="btn btn-primary me-2" type="submit">{isEditMode ? 'Update' : 'Save'}</button>
                            <Link to="/sell" className="btn btn-secondary ">cancel</Link>
                        </div>
                    </form>
                </div>
            </div>
            {salesOrderModalVisible && manufacturingOrderContent()}
            {salesOrderMessageModalVisible && SalesMessage()}
        </div>
    )
}

export default NewSalesOrder