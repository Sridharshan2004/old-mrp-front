import React, { useCallback, useEffect, useState } from 'react'
import dataService from "../../Service/dataService"
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify'
import Select from 'react-select';

const ManufacturingOrder = () => {

    const [notes, setNotes] = useState('');
    const [status, setstatus] = useState(1);
    const [productId, setProductId] = useState('');
    // const [userId, setUserId] = useState('');
    const [createdDate, setCreatedDate] = useState('');
    const [actualQuantity, setActualQuantity] = useState('');
    const [plannedQuantity, setPlannedQuantity] = useState(1);
    const [totalMaterialCost, setTotalMaterialCost] = useState(0);
    const [totalOperationCost, setTotalOperationCost] = useState(0);
    const [manufacturingOrder, setManufacturingOrder] = useState('');
    const [productionDeadline, setProductionDeadline] = useState('');

    const [listProduct, setListProduct] = useState([]);
    const [listUser, setListUser] = useState([]);
    const [listProductBOM, setListProductBOM] = useState([]);
    const [listProductOperation, setListProductOperation] = useState([]);

    const [order, setOrder] = useState('');
    const [stock, setStock] = useState('');
    const [quantity, setQuantity] = useState(1);
    // const [isLoading, setIsLoading] = useState(true);
    const [materialId, setMaterialId] = useState('');
    const [supplierId, setSupplierId] = useState('');
    const [createdtime, setCreatedtime] = useState('');
    const [expectedtime, setExpectedtime] = useState('');
    const [listSupplier, setListSupplier] = useState([]);
    const [listMaterial, setListMaterial] = useState([]);
    // const [materialStock, setMaterialStock] = useState([]);
    const [purchaseMaterial, setpurchaseMaterial] = useState([]);
    const [purchaseOrderModalVisible, setPurchaseOrderModalVisible] = useState(false);
    const [purchaseOrderMessageModalVisible, setPurchaseOrderMessageModalVisible] = useState(false);
    const [selectedRowIndex, setSelectedRowIndex] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { manufacturingOrderId } = useParams();
    const isEditMode = !!manufacturingOrderId;

    // SUCCESS MESSAGE NOTIFICATION

    const showToastMessage = () => {
        toast.success('SUCCESS', {
            position: toast.POSITION.BOTTOM_RIGHT
        })
    }

    // OPTION

    const option = [
        { value: 1, label: 'NOT STARTED' },
        { value: 2, label: 'WORK IN PROGESS' },
        { value: 3, label: 'DONE' }
    ]

    // OPERATION OPTION
    const operationOption = [
        { value: 0, label: 'NOT STARTED' },
        { value: 1, label: 'WORK IN PROGESS' },
        { value: 2, label: 'DONE' }
    ]

    // SET EXPECTED ARRIVAL DATE AND CREATED DATE

    const initDate2 = () => {
        const currentDate = new Date();

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(currentDate.getDate() + 7);

        const formattedTodayDate = currentDate.toISOString().slice(0, 10);
        const formattedSevenDaysAgo = sevenDaysAgo.toISOString().slice(0, 10);
        setProductionDeadline(formattedSevenDaysAgo);
        setCreatedDate(formattedTodayDate);
    }

    // FORMAT DATE

    const formatDate = (data) => {
        const date = new Date(data);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        return formattedDate
    }

    // GET PRODUCT

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

    // GET USER

    const initUser = () => {
        const arr = [];
        dataService.getexe(`user/user`)
            .then(response => {
                console.log("SUCCESS- GET USER", response.data.list);
                let result = response.data.list;
                result.map((opt) => {
                    return arr.push({ value: opt.id, label: opt.name })
                })
                setListUser(arr)
            })
            .catch(error => {
                console.error("ERROR- GET USER", error);
            })
    }

    // TIME IN TO SECOND

    const timeToDecimalSeconds = (data) => {
        const [hours, minutes, seconds] = data.split(':').map(Number);
        const totalSecond = hours * 3600 + minutes * 60 + seconds;
        return totalSecond;
    }

    // Calculate Operation Time

    const calculateOperationTime = (time) => {
        const timeInSeconds = timeToDecimalSeconds(time);
        const updatedTimeInSeconds = timeInSeconds * plannedQuantity;
        const hours = Math.floor(updatedTimeInSeconds / 3600);
        const minutes = Math.floor((updatedTimeInSeconds - hours * 3600) / 60);
        const seconds = updatedTimeInSeconds - hours * 3600 - minutes * 60;
        const updatedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        return updatedTime;
    }

    // Function to fetch associated Purchase Orders for a material
    const fetchPurchaseOrders = async (materialId) => {
        try {
            const response = await dataService.getexe(`purchaseOrders/${materialId}`);
            console.log("FETCH PURCHASE ORDERS", response.data);
            return response.data; // Assuming the response contains an array of Purchase Orders
        } catch (error) {
            console.error("ERROR - FETCH PURCHASE ORDERS", error);
            return [];
        }
    };

    // PRODUCT BOM

    const initProductBOM = useCallback((id) => {

        dataService.getexe(`bom/product/${id}/bom`)
            .then(response => {
                console.log("SUCCESS - GET PRODUCT BOM DATA", response.data);
                if (response.data !== '') {

                    const modifidArray = response.data.map(async (item) => {
                        // const availabilityStatus =
                        //     ((item.quantity * plannedQuantity) <= item.material.quanity) ? 1 : 0;

                        let availabilityStatus = 1;
                        let ingredient_expected_date = null;

                        console.log(item.material.quanity, item.material.allocate, item.material.expected, item.material.expected_allocate);
                        // Check if (item.quantity * plannedQuantity) is less than or equal to item.material.quanity
                        if ((item.quantity * plannedQuantity) <= item.material.quanity - item.material.allocate) {
                            availabilityStatus = 3;
                            // Check if (item.quantity * plannedQuantity) is less than or equal to item.material.Excepted
                        } else if ((item.quantity * plannedQuantity) <= (item.material.quanity - item.material.allocate) + (item.material.expected - item.material.expected_allocate)) {
                            availabilityStatus = 2;

                            // Fetch associated Purchase Orders for this material
                            const purchaseOrders = await fetchPurchaseOrders(item.material.id);

                            // Calculate the earliest expected date from the Purchase Orders
                            if (purchaseOrders.length > 0) {
                                const earliestDate = Math.min(...purchaseOrders.map(po => po.expected_date));
                                ingredient_expected_date = earliestDate;
                            }
                            else {
                                ingredient_expected_date = "2023-08-24";
                            }

                        }

                        return {
                            cost: item.material.price,
                            notes: '',
                            material: item.material,
                            total_actual_quantity: "",
                            planned_quantity_per_unit: item.quantity,
                            ingredient_availability: availabilityStatus,
                            ingredient_expected_date: ingredient_expected_date

                        }
                    })
                    Promise.all(modifidArray).then(resultArray => {
                        setListProductBOM(resultArray);
                    })

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
                    // const modifidArray = response.data.map(item => {
                    //     return {
                    //         operation: item.operation,
                    //         resource: item.resource,
                    //         user: null,
                    //         status: 0,
                    //         cost_per_hour: item.cost,
                    //         total_actual_time: "",
                    //         total_actual_cost: "",
                    //         planned_cost_per_unit: (item.cost * (timeToDecimalSeconds(item.time) / 3600)),
                    //         planned_time_per_unit: item.time,

                    //     }
                    // })
                    // setListProductOperation(modifidArray);
                    let rank = 1; // Initialize rank

                    const modifiedArray = response.data.map((item) => {
                        const modifiedItem = {
                            operation: item.operation,
                            resource: item.resource,
                            user: null,
                            status: 0,
                            cost_per_hour: item.cost,
                            total_actual_time: '',
                            total_actual_cost: '',
                            planned_cost_per_unit: item.cost * (timeToDecimalSeconds(item.time) / 3600),
                            planned_time_per_unit: item.time,
                            rank: rank, // Assign rank
                        };

                        rank++; // Increment rank for the next item
                        return modifiedItem;
                    });

                    setListProductOperation(modifiedArray);
                }
                else {
                    setListProductOperation([]);
                }
            })
            .catch(error => {
                console.error("ERROR- GET PRODUCT OPERATION", error);
            })
    }, []);

    // UPDATE PRODUCT BOM

    const updateProductBOM = useCallback((qty) => {

        console.log("UpdateProductBom");

        const updateBOM = listProductBOM.map(async (item) => {



            let availabilityStatus = 1;
            let ingredient_expected_date = null;

            // Check if (item.quantity * plannedQuantity) is less than or equal to item.material.quanity
            if ((item.planned_quantity_per_unit * qty) <= item.material.quanity - item.material.allocate) {
                availabilityStatus = 3;
                // Check if (item.quantity * plannedQuantity) is less than or equal to item.material.Excepted
            } else if ((item.planned_quantity_per_unit * qty) <= (item.material.quanity - item.material.allocate) + (item.material.expected - item.material.expected_allocate)) {
                availabilityStatus = 2;
                // Fetch associated Purchase Orders for this material
                const purchaseOrders = await fetchPurchaseOrders(item.material.id);

                // Calculate the earliest expected date from the Purchase Orders
                if (purchaseOrders.length > 0) {
                    const earliestDate = Math.min(...purchaseOrders.map(po => po.expected_date));
                    ingredient_expected_date = earliestDate;
                }
                else {
                    ingredient_expected_date = "2023-08-24";
                }
            }

            return {
                ...item,
                ingredient_availability: availabilityStatus,
                ingredient_expected_date: ingredient_expected_date,
            }
        })

        Promise.all(updateBOM).then(resultArray => {
            setListProductBOM(resultArray);
        })

        // setListProductBOM(updateBOM);

    }, [listProductBOM])

    // HANDLE CHANGE

    const handleInputChangeBOM = (index, attribute, value) => {
        console.log(index, attribute, value);
        const updatedList = [...listProductBOM];
        updatedList[index][attribute] = value;
        setListProductBOM(updatedList);

    };

    const handleInputChangeOperation = (index, attribute, value) => {
        console.log(index, attribute, value);
        const updatedList = [...listProductOperation];
        updatedList[index][attribute] = value;
        setListProductOperation(updatedList);
        console.log(listProductOperation);
    };

    const handleChangeProduct = (selectedOption) => {
        setProductId(selectedOption ? selectedOption.value : null);
        initProductBOM(selectedOption.value);
        initProductOperation(selectedOption.value);
    }

    const handleChangePlannedQuantity = (selectedOption) => {
        setPlannedQuantity(selectedOption ? selectedOption.target.value : null)
        updateProductBOM(selectedOption.target.value);
    }

    const handleChangeStatus = (selectedOption) => {
        setstatus(selectedOption ? selectedOption.value : null);
    }

    // FORM SUBMIT

    const navigate = useNavigate();

    const submitform = (event) => {
        event.preventDefault();
        const postDate = {
            productId: productId,
            status: status,
            plannedQuantity: plannedQuantity,
            createdDate: createdDate,
            manufacturingOrder: manufacturingOrder,
            productionDeadline: productionDeadline,
            is_linked_to_sales_order: false,
            notes: notes,
            manufacturingOrderIngredientRequests: listProductBOM.map(item => {
                return {
                    id: item.id,
                    cost: item.cost,
                    notes: item.notes,
                    material_id: item.material.id,
                    total_actual_quantity: item.total_actual_quantity,
                    planned_quantity_per_unit: item.planned_quantity_per_unit,
                    ingredient_availability: item.ingredient_availability,
                    ingredient_expected_date: item.ingredient_expected_date,
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
                    rank: item.rank,
                }
            })
        }

        if (isEditMode) {

            console.log("UPDATE MANUFACTURING ORDER", postDate);

            dataService.putexe(`manufacturingorder/manufacturingorder/${manufacturingOrderId}`, postDate)
                .then(response => {
                    console.log("SUCCESS- UPDATE MANUFACTURING ORDER", response.data);
                    showToastMessage();
                    navigate("/manufacturingorders")
                })
                .catch(error => {
                    console.error("ERROR- UPDATE MANUFACTURING ORDER", error);
                })
        }
        else {

            console.log("NEW MANUFACTURING ORDER", postDate);

            dataService.postexe("manufacturingorder/manufacturingorder", postDate)
                .then(response => {
                    console.log("SUCCESS- ADD MANUFACTURING ORDER", response.data);
                    showToastMessage();
                    navigate("/manufacturingorders")
                })
                .catch(error => {
                    console.error("ERROR- ADD MANUFACTURING ORDER", error);
                })
        }
    }

    // Function to check ingredient availability and update the status
    const checkIngredientAvailability = useCallback(async (ingredients, qty) => {
        console.log(ingredients);
        try {
            const updatedIngredients = [];
            for (const ingredient of ingredients) {
                const { planned_quantity_per_unit, material, ingredient_availability, expected_qty } = ingredient;
                let update_ingredient_availability = 1;
                let ingredient_expected_date = null;

                if (ingredient_availability === 3) {

                    console.log("BEFORE INGREDIENT AVAILABILITY STATUS: IN_STOCK");
                    console.log("BEFORE INGREDIENT AVAILABILITY STATUS:", ingredient_availability);

                    if (planned_quantity_per_unit * qty <= material.quanity) {

                        update_ingredient_availability = 3;
                        ingredient_expected_date = null;

                        console.log("AFTER INGREDIENT AVAILABILITY STATUS:", update_ingredient_availability);
                        console.log("AFTER INGREDIENT AVAILABILITY STATUS EXCEPTED DATE:", ingredient_expected_date);

                    }
                    else if (planned_quantity_per_unit * qty <= material.quanity + (material.expected - material.allocate_expected)) {

                        update_ingredient_availability = 2;
                        const purchaseOrders = await fetchPurchaseOrders(material.id);

                        if (purchaseOrders.length > 0) {
                            const earliestDate = Math.min(...purchaseOrders.map(po => po.expected_date));
                            ingredient_expected_date = earliestDate;
                        }
                        else {
                            ingredient_expected_date = "2023-08-24";
                        }

                        console.log("AFTER INGREDIENT AVAILABILITY STATUS:", update_ingredient_availability);
                        console.log("AFTER INGREDIENT AVAILABILITY STATUS EXCEPTED DATE:", ingredient_expected_date);

                    }
                    else {

                        update_ingredient_availability = 1;
                        ingredient_expected_date = null;

                        console.log("AFTER INGREDIENT AVAILABILITY STATUS:", update_ingredient_availability);
                        console.log("AFTER INGREDIENT AVAILABILITY STATUS EXCEPTED DATE:", ingredient_expected_date);
                    }

                }
                else if (ingredient_availability === 2) {
                    console.log("BEFORE INGREDIENT AVAILABILITY STATUS: EXCEPTED");
                    console.log("BEFORE INGREDIENT AVAILABILITY STATUS:", ingredient_availability);

                    // if (planned_quantity_per_unit * qty <= material.quanity - material.allocate) {
                    console.log(material.quanity, material.allocate, material.expected, material.expected_allocate);
                    if (expected_qty <= (material.quanity - material.allocate)) {
                        update_ingredient_availability = 3;
                        ingredient_expected_date = null;

                        console.log("AFTER INGREDIENT AVAILABILITY STATUS:", update_ingredient_availability);
                        console.log("AFTER INGREDIENT AVAILABILITY STATUS EXCEPTED DATE:", ingredient_expected_date);
                    }
                    else if (expected_qty <= material.expected_allocate) {
                        update_ingredient_availability = 2;
                        const purchaseOrders = await fetchPurchaseOrders(material.id);

                        if (purchaseOrders.length > 0) {
                            const earliestDate = Math.min(...purchaseOrders.map(po => po.expected_date));
                            ingredient_expected_date = earliestDate;
                        }
                        else {
                            ingredient_expected_date = "2023-08-24";
                        }

                        console.log("AFTER INGREDIENT AVAILABILITY STATUS:", update_ingredient_availability);
                        console.log("AFTER INGREDIENT AVAILABILITY STATUS EXCEPTED DATE:", ingredient_expected_date);
                    }
                    else {
                        update_ingredient_availability = 1;
                        ingredient_expected_date = null;

                        console.log("AFTER INGREDIENT AVAILABILITY STATUS:", update_ingredient_availability);
                        console.log("AFTER INGREDIENT AVAILABILITY STATUS EXCEPTED DATE:", ingredient_expected_date);
                    }

                }
                else {
                    console.log("BEFORE INGREDIENT AVAILABILITY STATUS: NOT AVAILABLE");
                    console.log("BEFORE INGREDIENT AVAILABILITY STATUS:", ingredient_availability);

                    if (planned_quantity_per_unit * qty <= material.quanity - material.allocate) {
                        update_ingredient_availability = 3;
                        ingredient_expected_date = null;

                        console.log("AFTER INGREDIENT AVAILABILITY STATUS:", update_ingredient_availability);
                        console.log("AFTER INGREDIENT AVAILABILITY STATUS EXCEPTED DATE:", ingredient_expected_date);
                    }
                    else if (planned_quantity_per_unit * qty <= (material.quanity - material.allocate) + (material.expected - material.expected_allocate)) {
                        update_ingredient_availability = 2;
                        const purchaseOrders = await fetchPurchaseOrders(material.id);

                        if (purchaseOrders.length > 0) {
                            const earliestDate = Math.min(...purchaseOrders.map(po => po.expected_date));
                            ingredient_expected_date = earliestDate;
                        }
                        else {
                            ingredient_expected_date = "2023-08-24";
                        }

                        console.log("AFTER INGREDIENT AVAILABILITY STATUS:", update_ingredient_availability);
                        console.log("AFTER INGREDIENT AVAILABILITY STATUS EXCEPTED DATE:", ingredient_expected_date);
                    }
                    else {
                        update_ingredient_availability = 1;
                        ingredient_expected_date = null;

                        console.log("AFTER INGREDIENT AVAILABILITY STATUS:", update_ingredient_availability);
                        console.log("AFTER INGREDIENT AVAILABILITY STATUS EXCEPTED DATE:", ingredient_expected_date);
                    }
                }

                updatedIngredients.push({
                    id: ingredient.id,
                    ingredient_availability: update_ingredient_availability,
                    ingredient_expected_date,
                })
            }

            const updatePromises = updatedIngredients.map(ingredient =>
                updateIngredientAvailability(ingredient.id, ingredient.ingredient_availability, ingredient.ingredient_expected_date)
            );

            const updatedIngredientsData = await Promise.all(updatePromises);

            return updatedIngredientsData;
        }
        catch (error) {
            console.error('Error updating ingredient availability:', error);
            // Handle the error as needed
            return null;
        }
    }, []);

    const updateIngredientAvailability = async (ingredientId, ingredient_availability, ingredient_expected_date) => {
        try {

            console.log("UPDATE INGREDIENT AVAILABILITY STATUS & EXCEPTED DATE:");

            const response = await dataService.putexe(`manufacturingorderingredient/manufacturingorderingredient/status/${ingredientId}`, { ingredient_availability: ingredient_availability, ingredient_expected_date: ingredient_expected_date });
            return response.data;

        } catch (error) {
            console.error(`Error updating ingredient with ID ${ingredientId}:`, error);
            return null;
        }
    };

    // GET MANUFACTURING ORDER

    const initManufacturingOrder = useCallback(async () => {
        setIsLoading(true)

        try {
            const response = await dataService.getexe(`manufacturingorder/manufacturingorder/${manufacturingOrderId}`)
            console.log("GET MANUFACTURING ORDER BY ID", response.data);
            if (response.data !== null) {
                if (response.data.status !== 3) {
                    const ingredient_availability = await checkIngredientAvailability(response.data.manufacturingOrderIngredients, response.data.plannedQuantity);
                    if (ingredient_availability) {
                        setListProductBOM(ingredient_availability);
                    }
                    else {
                        setListProductBOM(response.data.manufacturingOrderIngredients)
                    }
                }
                else {
                    setListProductBOM(response.data.manufacturingOrderIngredients);
                }
                setManufacturingOrder(response.data.manufacturingOrder)
                setProductionDeadline(formatDate(response.data.productionDeadline));
                setCreatedDate(formatDate(response.data.createdDate));
                setProductId(response.data.product.id);
                setstatus(response.data.status);
                setListProductOperation(response.data.manufacturingOrderOperations);
                setNotes(response.data.notes);
                setPlannedQuantity(response.data.plannedQuantity);
                setIsLoading(false);
            }
            else {

            }
        }
        catch (error) {
            console.error("ERROR - GET MATERIAL", error);
        }


    }, [manufacturingOrderId, checkIngredientAvailability]);

    // USE EFFECT

    useEffect(() => {
        initProduct();
        initUser();
        initDate2();
    }, []);

    useEffect(() => {

        // Calculate Material Total Cost 
        const calculateMaterialTotalCost = (data) => {
            let totalCost = 0;
            data.forEach((item) => {
                const materialCost = (item.material.price * item.planned_quantity_per_unit) * plannedQuantity;
                totalCost += materialCost;
            });
            setTotalMaterialCost(totalCost);
        };

        // Calculate Operation Total Cost
        const calculateOperationTotalCost = (data) => {
            let totalCost = 0;
            data.forEach((item) => {
                const operationCost = item.planned_cost_per_unit * plannedQuantity
                totalCost += operationCost
            });
            setTotalOperationCost(totalCost);
        };

        calculateMaterialTotalCost(listProductBOM)
        calculateOperationTotalCost(listProductOperation);

    }, [listProductBOM, listProductOperation, plannedQuantity])

    useEffect(() => {
        if (isEditMode) {
            initManufacturingOrder();
        }
    }, [initManufacturingOrder, isEditMode]);

    // GET SUPPLIER
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
    // GET MATERIAL
    const initMaterial = () => {
        const arr = [];
        dataService.getexe(`material/material`)
            .then(response => {
                console.log("SUCCESS- GET MATERIAL ", response.data);
                let result = response.data;
                result.map((opt) => {
                    return arr.push({ value: opt.id, label: opt.materialName })
                })
                setListMaterial(arr)
            })
            .catch(error => {
                console.error("ERROR- GET MATERIAL", error);
            })
    }
    const initMaterialGet = (id) => {

        dataService.getexe(`material/material/${id}`)
            .then(response => {
                console.log("MATERIAL DATA", response.data);
                if (response.data !== "") {
                    setStock(response.data.quanity)
                    const modifidArray = {
                        materialId: response.data.id,
                        quanity: 1,
                        cost: response.data.price
                    };
                    console.log("Modified Array PO", modifidArray);
                    setpurchaseMaterial(prevArray => [...prevArray, modifidArray]);
                }
                else {
                    setStock(0)
                }
            })
            .catch(error => {
                console.error("ERROR", error);
            })
    }

    // SET EXPECTED TIME

    const initDate = () => {
        const currentDate = new Date();

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(currentDate.getDate() + 7);

        const formattedTodayDate = currentDate.toISOString().slice(0, 10);
        const formattedSevenDaysAgo = sevenDaysAgo.toISOString().slice(0, 10);
        setExpectedtime(formattedSevenDaysAgo);
        setCreatedtime(formattedTodayDate)
    }

    const ItemSetRowData = (item, index) => {
        setMaterialId(item.material.id);
        setSupplierId(item.material.supplier.id);
        initMaterial();
        initSupplier();
        initMaterialGet(item.material.id);
        initDate();
        setSelectedRowIndex(index);
    }

    // HANDLE PO CHANGE
    const handleChangeSupplier = (selectedOption) => {
        console.log("selectedOption", selectedOption)
        setSupplierId(selectedOption ? selectedOption.value : null);

    }
    const handleChangeMaterial = (selectedOption) => {
        console.log("selectedOption", selectedOption)
        setMaterialId(selectedOption ? selectedOption.value : null);
    }

    // CREATE NEW PO

    const purchaseOrderContent = () => {

        const submitform = (event) => {
            event.preventDefault();
            const postDate = {
                order: order,
                createdtime: createdtime,
                expectedtime: expectedtime,
                notes: null,
                supplierId: supplierId,
                locationId: 1,
                status: 0,
                purchaseMaterial: purchaseMaterial.map((item) => {
                    return {
                        materialId: item.materialId,
                        quanity: quantity,
                        cost: item.cost
                    }
                })
            }
            console.log("NEW PURCHASE ORDER", postDate);
            dataService.postexe("purchaseorder/purchaseorder", postDate)
                .then(response => {
                    console.log("SUCCESS- ADD PURCHASE", response.data);
                    setPurchaseOrderModalVisible(false);
                    setpurchaseMaterial([]);
                    setQuantity(1);
                    handleInputChangeBOM(selectedRowIndex, 'ingredient_expected_date', response.data.expectedtime);
                    handleInputChangeBOM(selectedRowIndex, 'ingredient_availability', 2);

                })
                .catch(error => {
                    console.error("ERROR- ADD PURCHASE", error);
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
                                                <div><h5 className="modal-title">New Purchase Order</h5></div>
                                                <div><button type="button" className='btn btn-close' onClick={() => setPurchaseOrderModalVisible(false) > setpurchaseMaterial([]) > setQuantity(1)}></button></div>
                                            </div>
                                            <div className="col">
                                                <div className="row gx-3 mb-3">
                                                    <div className="col-md-6 ">
                                                        <label className="small mb-1 " htmlFor="imputMaterialName">Material</label>

                                                        <input
                                                            className="form-control fs-6"
                                                            id="imputMaterialName"
                                                            type="text"
                                                            placeholder="Type cost per hour"
                                                            value={listMaterial.find((option) => option.value === materialId)?.label || ''}
                                                            onChange={handleChangeMaterial}
                                                            readOnly
                                                            disabled
                                                        >
                                                        </input>
                                                    </div>
                                                    <div className="col-md-6">
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
                                                        <label className="small mb-1 " htmlFor="imputMaterialName">Quantity</label>
                                                        <input
                                                            className="form-control fs-6"
                                                            id="imputMaterialName"
                                                            type="text"
                                                            placeholder="Type cost per hour"
                                                            value={quantity}
                                                            onChange={event => setQuantity(event.target.value)}
                                                        >
                                                        </input>
                                                    </div>
                                                </div>
                                                <div className="row gx-3 mb-3">
                                                    <div className="col-md-6 ">
                                                        <label className="small mb-1 " htmlFor="imputMaterialName">Supplier</label>
                                                        <Select
                                                            className='basic-single'
                                                            value={listSupplier.find((option) => option.value === supplierId)}
                                                            options={listSupplier}
                                                            filterOption={(option, searchText) =>
                                                                option.label.toLowerCase().includes(searchText.toLowerCase())}
                                                            placeholder={"Select operation"}
                                                            onChange={handleChangeSupplier}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="row gx-3 mb-3">
                                                    <div className="col-md-6 ">
                                                        <label className="small mb-1 " htmlFor="imputMaterialName">Purchase Order#</label>
                                                        <input
                                                            className="form-control fs-6"
                                                            id="imputMaterialName"
                                                            type="text"
                                                            placeholder="PO-1 #"
                                                            onChange={event => setOrder(event.target.value)}
                                                            required
                                                        >
                                                        </input>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="small mb-1" htmlFor="inputCategory">Expected arrival</label>
                                                        <input
                                                            className="form-control fs-6"
                                                            id="imputMaterialName"
                                                            type="date"
                                                            placeholder="Type time"
                                                            value={expectedtime}
                                                            onChange={event => setExpectedtime(event.target.value)}
                                                        // onChange={event => handleChangeExpectedTime(selectedRowIndex, event)}
                                                        >
                                                        </input>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-body px-sm-4 mb-2 pt-1 pb-0">
                                            <div className="row justify-content-end no-gutters">
                                                <div className="col-auto">
                                                    <button type="button" className="btn btn-light text-muted" onClick={() => setPurchaseOrderModalVisible(false) > setpurchaseMaterial([]) > setQuantity(1)} >Cancel</button>
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

    const PurchaseMessage = () => {

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
                                            <button type="button" className='btn btn-close' onClick={() => setPurchaseOrderMessageModalVisible(false)}></button>
                                        </div>
                                        <p className="font-weight-bold mb-2"> Please submit the form and then create a PO.</p>
                                    </div>
                                    <div className="card-body px-sm-4 mb-2 pt-1 pb-0">
                                        <div className="row justify-content-end no-gutters">
                                            <div className="col-auto">
                                                <button type="button" className="btn btn-light text-muted" onClick={() => setPurchaseOrderMessageModalVisible(false)}>Cancel</button>
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

    return (
        <div className="container-fluid m-1">
            {isLoading ? (<p>Loading...</p>) : (<>
                <div><h6>Add New Manufacturing Order</h6></div>
                <div className="row mb-5 text-muted">
                    <div className="col">
                        <form onSubmit={submitform}>
                            <div className="row gx-3 mb-3">
                                <div className="col-md-6 ">
                                    <label className="small mb-1 " htmlFor="imputMaterialName">Manufacturing order#</label>
                                    <input
                                        className="form-control fs-6"
                                        id="imputMaterialName"
                                        type="text"
                                        placeholder="Mo-1 Name"
                                        value={manufacturingOrder}
                                        onChange={event => setManufacturingOrder(event.target.value)}
                                    >
                                    </input>
                                </div>
                                <div className="col-md-6">

                                    <div className="row gx-3 mb-3">
                                        <div className="col-md-6">
                                            <label className="small mb-1" htmlFor="inputMeasure">Production deadline </label>
                                            <input
                                                className="form-control fs-6"
                                                id="imputMaterialName"
                                                type="date"
                                                placeholder="Mo-1 Name"
                                                value={productionDeadline}
                                                onChange={event => setProductionDeadline(event.target.value)}
                                            >
                                            </input>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="small mb-1" htmlFor="inputSupplier">Created date</label>
                                            <input
                                                className="form-control fs-6"
                                                id="imputMaterialName"
                                                type="date"
                                                placeholder="Mo-1 Name"
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
                                    <label className="small mb-1" htmlFor="inputMeasure">Product</label>
                                    <Select
                                        className='basic-single'
                                        value={listProduct.find((option) => option.value === productId)}
                                        options={listProduct}
                                        filterOption={(option, searchText) =>
                                            option.label.toLowerCase().includes(searchText.toLowerCase())}
                                        placeholder={"Select product"}
                                        onChange={handleChangeProduct}
                                    />
                                </div>
                                <div className='col-md-6'>
                                    <div className="row gx-3 mb-3">
                                        <div className="col-md-6">
                                            <label className="small mb-1" htmlFor="inputMeasure">Status</label>
                                            <Select
                                                className='basic-single'
                                                options={option}
                                                value={option.find((option) => option.value === status)}
                                                filterOption={(option, searchText) =>
                                                    option.label.toLowerCase().includes(searchText.toLowerCase())}
                                                placeholder={"Select"}
                                                onChange={handleChangeStatus}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="small mb-1" htmlFor="inputSupplier">Total Cost</label>
                                            <p className='fw-bold fs-5 m-1'> {((totalOperationCost + totalMaterialCost)).toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row gx-3 mb-3">
                                <div className="col-md-6">

                                    <div className="row gx-3 mb-3">
                                        <div className="col-md-6">
                                            <label className="small mb-1" htmlFor="inputMeasure">Planned quantity </label>
                                            <input
                                                className="form-control fs-6"
                                                id="imputMaterialName"
                                                type="number"
                                                placeholder="Mo-1 Name"
                                                value={plannedQuantity}
                                                // onChange={event => { setPlannedQuantity(event.target.value); updateProductBOM()}}
                                                onChange={handleChangePlannedQuantity}
                                            >
                                            </input>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="small mb-1" htmlFor="inputSupplier">Actual quantity</label>
                                            <input
                                                className="form-control fs-6"
                                                id="imputMaterialName"
                                                type="number"
                                                placeholder=""
                                                value={actualQuantity}
                                                onChange={event => setActualQuantity(event.target.value)}
                                            >
                                            </input>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h5>Ingredients</h5>
                                <table className='table table-bordered mt-4'>
                                    <thead className='table-active'>
                                        <tr>
                                            <td><span className='text-muted'>Item</span></td>
                                            <td><span className='text-muted'>Notes</span></td>
                                            <td><span className='text-muted'>Planned/actual qty</span></td>
                                            <td><span className='text-muted'>Cost</span></td>
                                            <td><span className='text-muted'>Availability</span></td>
                                            <td><span className='text-muted'></span></td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listProductBOM && listProductBOM.length > 0 ? (
                                            listProductBOM.map((item, index) => {

                                                return (
                                                    <tr key={index}>

                                                        <td ><span className='p-0'>{item.material.materialName}</span></td>

                                                        <td>
                                                            <input
                                                                type='text'
                                                                value={item.notes}
                                                                onChange={e => handleInputChangeBOM(index, 'notes', e.target.value)}
                                                            />
                                                        </td>

                                                        <td><span className='p-0'>{item.planned_quantity_per_unit * plannedQuantity}</span></td>

                                                        <td><span className='p-0'>{plannedQuantity * item.planned_quantity_per_unit * item.cost}</span></td>

                                                        <td className={`${item.ingredient_availability === 4 ? 'bg-success' : item.ingredient_availability === 3 ? 'bg-success' : item.ingredient_availability === 2 ? 'bg-warning bg-opacity-75' : 'bg-danger bg-opacity-75'} text-white`} >
                                                            <span className='p-0'>{item.ingredient_availability === 4 ? 'PROCESSED' : item.ingredient_availability === 3 ? 'IN STOCK' : item.ingredient_availability === 2 ? (
                                                                <pre className="small text-dark text-wrap m-0" style={{ width: '6rem', fontFamily: 'poppins' }}>EXPECTED {formatDate(item.ingredient_expected_date)}</pre>
                                                            ) : 'NOT AVAILABLE'}</span>
                                                        </td>


                                                        <td>
                                                            {isEditMode ? (

                                                                <button type="button" className="btn btn-sm text-primary  p-0" onClick={() => ItemSetRowData(item, index) > setPurchaseOrderModalVisible(true)}>
                                                                    <i className='fa fa-square-plus'></i> Buy
                                                                </button>
                                                            ) : (

                                                                <button type="button" className="btn btn-sm text-primary  p-0" onClick={() => setPurchaseOrderMessageModalVisible(true)}>
                                                                    <i className='fa fa-square-plus'></i> Buy
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        ) : (<tr><td colSpan={6}>No data</td></tr>)}
                                    </tbody>
                                </table>
                            </div>

                            <div>
                                <h5>Operations</h5>
                                <table className='table table-bordered mt-4'>
                                    <thead className='table-active'>
                                        <tr>
                                            <td><span className='text-muted'>Operation step</span></td>
                                            <td><span className='text-muted'>Resource</span></td>
                                            <td><span className='text-muted'>User</span></td>
                                            <td><span className='text-muted'>Planned/actual time</span></td>
                                            <td><span className='text-muted'>Cost</span></td>
                                            <td><span className='text-muted'>Status</span></td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listProductOperation && listProductOperation.length > 0 ? (
                                            listProductOperation.map((item, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>{item.operation.operationName}</td>

                                                        <td>{item.resource.resourceName}</td>

                                                        <td>
                                                            <Select
                                                                className='basic-single'
                                                                value={listUser.find((option) => option.value === (item.user === null ? 0 : item.user.id))}
                                                                options={listUser}
                                                                filterOption={(option, searchText) =>
                                                                    option.label.toLowerCase().includes(searchText.toLowerCase())}
                                                                placeholder={"Select user"}
                                                                onChange={e => handleInputChangeOperation(index, 'user', { ...item.user, id: e.value })}
                                                            />
                                                        </td>

                                                        <td>{calculateOperationTime(item.planned_time_per_unit)}</td>

                                                        <td>{item.planned_cost_per_unit * plannedQuantity}</td>

                                                        <td>
                                                            <Select
                                                                className='basic-single'
                                                                options={operationOption}
                                                                value={operationOption.find((option) => option.value === (item.status === null ? 0 : item.status))}
                                                                filterOption={(option, searchText) =>
                                                                    option.label.toLowerCase().includes(searchText.toLowerCase())}
                                                                placeholder={"Select"}
                                                                onChange={e => handleInputChangeOperation(index, 'status', e.value)}
                                                            />
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        ) : (<tr><td colSpan={5}>No data</td></tr>)}
                                    </tbody>
                                </table>
                            </div>

                            <div>
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
                                                        placeholder="Eg: Notes"
                                                        value={notes}
                                                        onChange={event => setNotes(event.target.value)}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div>
                                {/* <button className="btn btn-primary me-2" type="submit">Save</button> */}
                                <button className="btn btn-primary me-2" type="submit">{isEditMode ? 'Update' : 'Save'}</button>
                                <Link to="/manufacturingOrders" className="btn btn-secondary ">cancel</Link>
                            </div>

                        </form>
                    </div>
                </div>
                {purchaseOrderModalVisible && purchaseOrderContent()}
                {purchaseOrderMessageModalVisible && PurchaseMessage()}
            </>)}
        </div>
    )
}

export default ManufacturingOrder