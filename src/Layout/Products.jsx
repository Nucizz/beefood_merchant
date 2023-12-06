import { useState, useEffect } from 'react'
import { ChangePhoto, LongTextField, TextField } from '../Class/Component'
import { addProduct, changeProductAvailbility, deleteProduct, updateProduct } from '../Javascript/ProductHandler'
import { validatePrice } from '../Javascript/Global'
import BeeFood from '../Assets/Beefood Icon White.png'

export default function ProductsLayout({merchanRef}) {
    const [searchQuery, setSearchQuery] = useState("")
    const [filteredProducts, setFilteredProducts] = useState([])

    useEffect(() => {
        const filtered = merchanRef.product.filter((product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        setFilteredProducts(filtered)
    }, [searchQuery, merchanRef.product])

    return (
        <div className="w-full gap-4 flex flex-col">
            
            <ProductLayoutHeader merchanRef={merchanRef} searchQueryRef={searchQuery} setSearchQueryRef={setSearchQuery} />

            <ProductList productListRef={filteredProducts} merchanRefId={merchanRef.id} />

        </div>
    )
}

function ProductLayoutHeader({merchanRef, searchQueryRef, setSearchQueryRef}) {
    const [addProductOverlay, setAddProductOverlay] = useState(false)

    return(
        <div className='w-full flex flex-col lg:flex-row lg:items-center lg:justify-between'>
            <h1 className="w-fit text-3xl font-bold leading-none tracking-tight text-gray-900 md:text-4xl">Products</h1>
            
            <div className='lg:w-2/3 xl:w-1/2 flex flex-row gap-5 items-center justify-between'>
                <TextField label="Search For Products" name="search" value={searchQueryRef} onChange={(e) => setSearchQueryRef(e.target.value)} />
                <button className="w-72 bf-bg-color md:h-9 h-8 rounded-md font-medium text-white mt-5" type="button" onClick={() => setAddProductOverlay(true)}>Add New Product</button>
            </div>

            {addProductOverlay ? <AddProduct setAddProductOverlayRef={setAddProductOverlay} merchanRef={merchanRef} /> : <></>}
            
        </div>
    )
}

function ProductList({productListRef, merchanRefId}) {
    const [sortBy, setSortBy] = useState('totalSale');
    const [sortProduct, setSortProduct] = useState('desc');
    const [selectedProduct, setSelectedProduct] = useState(null);

    const handleSort = (criteria) => {
        if (criteria === sortBy) {
        setSortProduct((prevProduct) => (prevProduct === 'asc' ? 'desc' : 'asc'));
        } else {
        setSortBy(criteria);
        setSortProduct('asc');
        }
    }

    const sortedProductListRef = productListRef
    ? [...productListRef].sort((a, b) => {
        const productA = sortBy === 'price' ? parseFloat(a[sortBy]) : a[sortBy];
        const productB = sortBy === 'price' ? parseFloat(b[sortBy]) : b[sortBy];

        if (sortProduct === 'asc') {
        return productA < productB ? -1 : productA > productB ? 1 : 0;
        } else {
        return productA > productB ? -1 : productA < productB ? 1 : 0;
        }
    })
    : [];

    return (
        <>

            <table className="w-full table-auto rounded-lg overflow-hidden xl:text-lg lg:text-base text-sm">
                <thead className="bg-white border-b ">
                    <tr>
                        <th className="p-2 lg:pl-4 text-left font-semibold text-black cursor-pointer group transition-all duration-300 hover:text-gray-500" onClick={() => handleSort('name')}>Name <span className="text-black rounded-full ml-2 transition-all duration-300 group-hover:text-gray-500">{sortBy === 'name' && (sortProduct === 'asc' ? '▲' : '▼')}</span></th>
                        <th className="p-2 text-left font-semibold text-black cursor-pointer group transition-all duration-300 hover:text-gray-500" onClick={() => handleSort('price')}>Price <span className="text-black rounded-full ml-2 transition-all duration-300 group-hover:text-gray-500">{sortBy === 'price' && (sortProduct === 'asc' ? '▲' : '▼')}</span></th>
                        <th className="p-2 text-left font-semibold text-black cursor-pointer group transition-all duration-300 hover:text-gray-500" onClick={() => handleSort('totalSale')}>Sales <span className="text-black rounded-full ml-2 transition-all duration-300 group-hover:text-gray-500">{sortBy === 'totalSale' && (sortProduct === 'asc' ? '▲' : '▼')}</span></th>
                        <th className="p-2 text-left font-semibold text-black cursor-pointer group transition-all duration-300 hover:text-gray-500" onClick={() => handleSort('available')}>Availbility <span className="text-black rounded-full ml-2 transition-all duration-300 group-hover:text-gray-500">{sortBy === 'available' && (sortProduct === 'asc' ? '▲' : '▼')}</span></th>
                    </tr>
                </thead>
                <tbody>
                    {sortedProductListRef.length > 0 ? (
                    sortedProductListRef.map((product) => (
                        <tr key={product.id} className="transition-all duration-200 hover:bg-gray-300 hover:text-white bg-white " onClick={() => setSelectedProduct(product)} >
                            <td className="p-2 cursor-pointer lg:pl-4 text-left text-black flex flex-row gap-2 lg:gap-5 items-center">
                                <img src={product.thumbnailPicture ?? BeeFood} className="border w-10 h-10 lg:w-16 lg:h-16 rounded-lg" alt={product.name} />
                                <span>{product.name}</span>
                            </td>
                            <td className="p-2 cursor-pointer text-left text-black">{`Rp${product.price}`}</td>
                            <td className="p-2 cursor-pointer text-left text-black">{product.totalSale}</td>
                            <td className="p-2 cursor-pointer text-left text-black">{product.available ? "YES" : "NO"}</td>
                        </tr>
                    ))
                    ) : (
                    <tr>
                        <td colSpan="4" className="p-2 text-center bg-white ">
                            No product available for now.
                        </td>
                    </tr>
                    )}
                </tbody>
            </table>

            {selectedProduct ? 
                <ProductDetails product={selectedProduct} setSelectedProductRef={setSelectedProduct} merchanRefId={merchanRefId} />
                : <></>
            }
        </>
    )
}

function ProductDetails({product, setSelectedProductRef, merchanRefId}) {
    const [editable, setEditable] = useState(false)
    const [deleteConfirmation, setDeleteConfirmation] = useState(false);

    const [error, setError] = useState("")
    const [thumbnail, setThumbnail] = useState(null)
    const [name, setName] = useState(product.name)
    const [price, setPrice] = useState("Rp" + product.price)
    const [description, setDescription] = useState(product.description)
    const [available, setAvailable] = useState(product.available)

    const onCancel = () => {
        setError("")
        setName(product.name)
        setPrice("Rp" + product.price)
        setDescription(product.description)
        setThumbnail(null)
        setEditable(false)
    }

    const onDeleteProduct = async () => {
        if(await deleteProduct(merchanRefId, product.id)) {
            window.location.href = '/products'
        } else {
            setError("Delete failed!")
        }
        setDeleteConfirmation(false)
    }

    const onEditProduct = async () => {
        const regExpPrice = /^Rp[0-9]*$/;
        if(name === "" || price === "" || description === "") {
            setError("Please fill in the forms.")
        } else if(name.length < 4 || name.length > 64) {
            setError("Merchant name must be 4 - 64 characters.")
        } else if(!regExpPrice.test(price)) {
            setError("Invalid price format.")
        } else {
            const res = await updateProduct(merchanRefId, product.id, name, description, parseFloat(price.slice(2)), thumbnail, product.thumbnailPicture)
            if(res === "0") {
                setError("")
                setEditable(false)
            } else {
                setError(res)
            }
        }
    }

    const onAvailableChange = async () => {
        const res = await changeProductAvailbility(merchanRefId, product.id)
        if(res === "Available") {
            setAvailable(true)
        } else if(res === "Unavailable") {
            setAvailable(false)
        }
    }

    return(
        <div className="z-30 fixed inset-0 flex items-center justify-center bg-black/50">
            <div className="md:ml-64 w-full mx-10 md:mx-0 md:w-1/2 bg-white md:p-4 p-3 rounded-md flex flex-col lg:gap-4 md:gap-3 gap-2">

                <div className="flex flex-row justify-between items-center text-xl md:text-2xl">
                    <span className='w-fit font-bold leading-none tracking-tight text-gray-900 '>Product Details</span>
                    
                    <button class="transition-all duration-300 text-gray-400 hover:text-gray-600 font-bold" onClick={() => setSelectedProductRef(null)}>&#x2716;</button>
                </div>

                <form className="grid grid-cols-1 gap-3">
                    <div className='w-full flex flex-col lg:flex-row items-center justify-evenly lg:gap-0 gap-5'>
                        <ChangePhoto photoRef={thumbnail ? URL.createObjectURL(thumbnail) : product.thumbnailPicture} setPhotoRef={setThumbnail} type='food' classSize={"xl:w-32 xl:h-32 w-24 h-24"} disabled={!editable} />
                        <div className='flex flex-col items-center justify-evenly w-full lg:w-1/3'>
                            <span className="rounded-md bg-amber-200 text-amber-500 py-1 px-2 md:py-2 md:px-3 w-full h-fit lg:text-base text-sm">This product was sold <b>{product.totalSale}</b> times.</span>
                            <button className={"w-full md:h-9 h-8 rounded-md font-medium text-white mt-5 " + (available ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600")} type="button" onClick={onAvailableChange}>{"Product is " + (available ? "Available" : "Unavailable")}</button>
                        </div>
                    </div>
                    {error ? <div className="mb-2 w-full bg-red-100 rounded-md text-red-600 flex flex-row items-center md:px-3 px-2 md:py-2 py-1 md:text-base text-sm">{error}</div> : <></>}
                    <TextField label="Name" name="name" value={name} onChange={(e) => setName(e.target.value)} disabled={!editable} />
                    <TextField label="Price" name="price" value={price} onClick={() => {if (price.length < 3){setPrice("Rp")}}} onChange={(e) => setPrice(validatePrice(e.target.value))} disabled={!editable} />
                    <LongTextField label="Description" name="description" value={description} onChange={(e) => setDescription(e.target.value)} disabled={!editable} />
                    
                    {!editable ? 
                    <div className="flex flex-row justify-end mt-5 gap-2">
                        <button className="px-8 bg-red-500 hover:bg-red-600 md:h-9 h-8 rounded-md font-medium text-white" type="button" onClick={() => setDeleteConfirmation(true)}>{window.innerWidth >= 768 ? 'Delete Permanently' : 'Delete'}</button>
                        <button className="px-8 bf-bg-color md:h-9 h-8 rounded-md font-medium text-white" type="button" onClick={() => setEditable(true)}>Edit</button>
                    </div>
                    : <div className="flex flex-row justify-end mt-5 gap-2">
                        <button className="px-8 bg-red-500 hover:bg-red-600 md:h-9 h-8 rounded-md font-medium text-white" type="button" onClick={onCancel}>Cancel</button>
                        <button className="px-8 bf-bg-color md:h-9 h-8 rounded-md font-medium text-white" type="button" onClick={onEditProduct}>Save</button>
                    </div>}

                </form>

                {deleteConfirmation && (
                    <div className="z-30 fixed inset-0 flex items-center justify-center bg-black/50">
                        <div className="md:ml-64 bg-white md:p-4 p-3 rounded-md flex flex-col lg:gap-4 md:gap-3 gap-2">
                            <p className="md:text-xl text-md font-semibold">Are you sure you want to permanently delete this product?</p>
                            <div className="flex flex-row justify-end gap-2">
                                <button onClick={() => setDeleteConfirmation(false)} className="px-4 transition-all duration-300 bf-bg-color md:h-9 h-8 rounded-md font-medium text-white">Cancel</button>
                                <button onClick={onDeleteProduct} className="px-4 transition-all duration-300 bg-red-500 hover:bg-red-600 md:h-9 h-8 rounded-md font-medium text-white">Delete</button>
                            </div>
                        </div>
                    </div>
                )}
                
            </div>
        </div>
    )
}

function AddProduct({setAddProductOverlayRef, merchanRef}) {
    const [hideForm, setHideForm] = useState(false)

    const [error, setError] = useState("")
    const [thumbnail, setThumbnail] = useState(null)
    const [name, setName] = useState("")
    const [price, setPrice] = useState("")
    const [description, setDescription] = useState("")

    const onAddProduct = async () => {
        const regExpPrice = /^Rp[0-9]*$/;
        if(name === "" || price === "" || description === "") {
            setError("Please fill in the forms.")
        } else if(name.length < 4 || name.length > 64) {
            setError("Merchant name must be 4 - 64 characters.")
        } else if(!regExpPrice.test(price)) {
            setError("Invalid price format.")
        } else {
            const res = await addProduct(merchanRef, name, description, parseFloat(price.slice(2)), thumbnail)
            if(res === "0") {
                setHideForm(true)
                setTimeout(() => {
                    setAddProductOverlayRef(false)
                    setHideForm(false)
                    window.location.href = '/products'
                }, 2500)
            } else {
                setError(res)
            }
        }
    }

    return(
        <div className="z-30 fixed inset-0 flex items-center justify-center bg-black/50">
            <div className="md:ml-64 w-1/2 bg-white md:p-4 p-3 rounded-md flex flex-col lg:gap-4 md:gap-3 gap-2">

                <div className="flex flex-row justify-between items-center text-xl md:text-2xl">
                    <span className='w-fit font-bold leading-none tracking-tight text-gray-900 '>New Product</span>
                    
                    <button class="transition-all duration-300 text-gray-400 hover:text-gray-600 font-bold" onClick={() => setAddProductOverlayRef(false)}>&#x2716;</button>
                </div>

                {hideForm ?
                    <p>
                        <b>Congratulations!</b> {name} is now listed on the BeeFood with price of {price}.
                    </p> :
                    <form className="grid grid-cols-1 gap-3">
                        <div className='w-full flex items-center justify-center'>
                            <ChangePhoto photoRef={thumbnail ? URL.createObjectURL(thumbnail) : null} setPhotoRef={setThumbnail} type='food' classSize={"xl:w-32 xl:h-32 md:w-24 md:h-24 w-16 h-16"} />
                        </div>
                        {error ? <div className="mb-2 w-full bg-red-100 rounded-md text-red-600 flex flex-row items-center md:px-3 px-2 md:py-2 py-1 md:text-base text-sm">{error}</div> : <></>}
                        <TextField label="Name" name="name" value={name} onChange={(e) => setName(e.target.value)} />
                        <TextField label="Price" name="price" value={price} onClick={() => {if (price.length < 3){setPrice("Rp")}}} onChange={(e) => setPrice(validatePrice(e.target.value))} />
                        <LongTextField label="Description" name="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                        <button className="w-full bf-bg-color md:h-9 h-8 rounded-md font-medium text-white mt-5" type="button" onClick={onAddProduct}>Add Product</button>

                    </form>
                }

            </div>
        </div>
    )
}