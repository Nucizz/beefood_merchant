import { useState, useEffect } from "react";
import { getTodayOrderList } from "../Javascript/OrderHandler";
import { OrderDetails } from "./Order";
import { ChangePhoto } from "../Class/Component";
import { timeConverter } from "../Javascript/Global";

export default function DashboardLayout({merchanRef}) {
    const [order, setOrder] = useState(null)
    const [isLoading, setIsLoading] = useState(true);

    const dummyOrderList = [
        { id: '3HrXQf1iQ0XsgHE2Op9b', name: 'John Doe', status: 'Processing', price: 24000, time: 1670237700000 },
        { id: '4ZsOYv8aD6RwKcJ0Lm5x', name: 'Jane Smith', status: 'Delivered', price: 19000, time: 1670242200000 },
        { id: '1GtUxL9pV3NnAcX5bH7o', name: 'Bob Johnson', status: 'Processing', price: 32500, time: 1670249100000 },
        { id: '2PbDqR6cE8QjSgH1Oz9p', name: 'Alice Williams', status: 'Delivered', price: 15750, time: 1670253600000 },
        { id: '9WjIuO4nH5YbV3A6oQ2x', name: 'Charlie Brown', status: 'Processing', price: 28400, time: 1670257500000 },
        { id: '8AqBpX2eD7RrH3C0W1jK', name: 'Eva Martinez', status: 'Delivered', price: 22100, time: 1670261400000 },
        { id: '7SsYhE3nW6OoL1F8wK1l', name: 'David Miller', status: 'Processing', price: 18950, time: 1670265300000 },
        { id: '5LjJfQ4zI2A0T8C6eD8x', name: 'Grace Davis', status: 'Delivered', price: 36800, time: 1670272200000 },
        { id: '6VvWmX3kY2ZpO1D4gH3v', name: 'Frank Turner', status: 'Processing', price: 14500, time: 1670276100000 },
        { id: '0KcEgH8uV2BwP9Y3xZ4o', name: 'Sophie Johnson', status: 'Delivered', price: 30250, time: 1670280600000 },
    ]

    useEffect(() => {
        const fetchTodayOrderList = async () => {
            try {
                const todayOrderList = await getTodayOrderList(merchanRef.id);
                setOrder(dummyOrderList)
            } catch (e) {

            } finally {
                setIsLoading(false);
            }
        }
        fetchTodayOrderList();
    }, [merchanRef.id])

    if (isLoading) {
      return null
    }

    return (
        <div className="w-full gap-4 flex flex-col" >
            <h1 className="text-3xl font-bold leading-none tracking-tight text-black dark:text-white md:text-4xl lg:text-4xl">Dashboard</h1>
            
            <GeneralInformation merchanRef={merchanRef} />

            <ToDoListLayout orderRef={order} />

            <OrderListLayout orderRef={order} />

        </div>
    )
}

function GeneralInformation({merchanRef}) {
    return (
        <div className="w-full rounded-lg py-4 bg-white dark:bg-slate-800 lg:px-8 lg:py-6 md:px-6 md:py-4 px-4 py-2 flex lg:flex-row flex-col lg:items-start items-center lg:gap-8 gap-4">

            <ChangePhoto photoRef={merchanRef.profilePicture} classSize={"w-36 h-36"} disabled={true} />

            <div className="flex flex-col lg:items-start items-center">
                <span className="xl:text-6xl md:text-4xl text-2xl font-bold text-black dark:text-white text-center md:text-left">{merchanRef.name}</span>
                <p className="xl:text-2xl lg:text-xl md:text-lg text-md text-gray-500 dark:text-gray-300 text-center md:text-left">{merchanRef.description}</p>
            </div>

        </div>
    )
}

function ToDoListLayout({orderRef}) {
    var needConfirmation = 0
    var needProcessing = 0
    var waitingPickup = 0
    var finished = 0
    var cancelled = 0

    useEffect(() => {
        if(orderRef) {
            for(const order of orderRef) {
                switch (order.status) {
                    case 1:
                        needConfirmation++
                        break
                    case 2:
                        needProcessing++
                        break
                    case 3:
                        waitingPickup++
                        break
                    case 4:
                        finished++
                        break
                    case -1:
                        cancelled++
                        break
                    default:
                        break
                }
            }
        }
    }, [orderRef, needConfirmation, needProcessing, waitingPickup, finished, cancelled])


    return (
        <div className="w-full flex flex-col xl:gap-4 md:gap-3 gap-2">
            <h2 className="w-full text-lg md:text-xl lg:text-2xl font-bold text-black dark:text-white">Your To-Do List</h2>
            <ol className="w-full grid grid-cols-2 gap-y-5 lg:grid-cols-3 xl:grid-cols-5 rounded-lg py-4 bg-white dark:bg-slate-800">
                <li className="flex flex-col justify-center items-center w-full border-r-2 border-gray-200 dark:border-gray-400">
                    <span className="text-xl font-bold text-gray-500 dark:text-gray-300">{needConfirmation}</span>
                    <span className="text-sm md:text-base lg:text-lg font-semibold w-full text-center text-black dark:text-white">Need Confirmation</span>
                </li>
                <li className="flex flex-col justify-center items-center w-full lg:border-r-2 border-gray-200 dark:border-gray-400">
                    <span className="text-xl font-bold text-gray-500 dark:text-gray-300">{needProcessing}</span>
                    <span className="text-sm md:text-base lg:text-lg font-semibold w-full text-center text-black dark:text-white">Need Processing</span>
                </li>
                <li className="flex flex-col justify-center items-center w-full border-r-2 lg:border-r-0 xl:border-r-2 border-gray-200 dark:border-gray-400">
                    <span className="text-xl font-bold text-gray-500 dark:text-gray-300">{waitingPickup}</span>
                    <span className="text-sm md:text-base lg:text-lg font-semibold w-full text-center text-black dark:text-white">Waiting Pickup</span>
                </li>
                <li className="flex flex-col justify-center items-center w-full lg:border-r-2 border-gray-200 dark:border-gray-400">
                    <span className="text-xl font-bold text-gray-500 dark:text-gray-300">{finished}</span>
                    <span className="text-sm md:text-base lg:text-lg font-semibold w-full text-center text-black dark:text-white">Order Finished</span>
                </li>
                <li className="flex flex-col justify-center items-center w-full col-span-2 lg:col-span-1">
                    <span className="text-xl font-bold text-gray-500 dark:text-gray-300">{cancelled}</span>
                    <span className="text-sm md:text-base lg:text-lg font-semibold w-full text-center text-black dark:text-white">Order Cancelled</span>
                </li>
            </ol>
        </div>
    )
}


function OrderListLayout({ orderRef }) {
    const [sortBy, setSortBy] = useState('time')
    const [sortOrder, setSortOrder] = useState('desc')
    const [selectedOrder, setSelectedOrder] = useState(null)
  
    const handleSort = (criteria) => {
        if (criteria === sortBy) {
            setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'))
        } else {
            setSortBy(criteria)
            setSortOrder('asc')
        }
    }
  
    const sortedOrderRef = orderRef ? [...orderRef].sort((a, b) => {
        const orderA = sortBy === 'price' ? parseFloat(a[sortBy]) : a[sortBy];
        const orderB = sortBy === 'price' ? parseFloat(b[sortBy]) : b[sortBy];

        if (sortOrder === 'asc') {
            return orderA < orderB ? -1 : orderA > orderB ? 1 : 0;
        } else {
            return orderA > orderB ? -1 : orderA < orderB ? 1 : 0;
        }
    }):[]
  
    return (
        <div className="w-full flex flex-col xl:gap-4 md:gap-3 gap-2">
            <h2 className="w-full text-lg md:text-xl lg:text-2xl font-bold text-black dark:text-white">Order List</h2>
        
            <table className="w-full table-auto rounded-lg overflow-hidden xl:text-lg lg:text-base text-sm">
                <thead className="bg-white dark:bg-slate-800 border-b ">
                    <tr>
                        <th className="p-2 lg:pl-4 text-left font-semibold text-black dark:text-white cursor-pointer group transition-all duration-300 hover:text-gray-500 dark:text-gray-300" onClick={() => handleSort('name')}>Name <span className="text-black dark:text-white rounded-full ml-2 transition-all duration-300 group-hover:text-gray-500 dark:text-gray-300">{sortBy === 'name' && (sortOrder === 'asc' ? '▲' : '▼')}</span></th>
                        <th className="p-2 text-left font-semibold text-black dark:text-white cursor-pointer group transition-all duration-300 hover:text-gray-500 dark:text-gray-300" onClick={() => handleSort('status')}>Status <span className="text-black dark:text-white rounded-full ml-2 transition-all duration-300 group-hover:text-gray-500 dark:text-gray-300">{sortBy === 'status' && (sortOrder === 'asc' ? '▲' : '▼')}</span></th>
                        <th className="p-2 text-left font-semibold text-black dark:text-white cursor-pointer group transition-all duration-300 hover:text-gray-500 dark:text-gray-300" onClick={() => handleSort('price')}>Price <span className="text-black dark:text-white rounded-full ml-2 transition-all duration-300 group-hover:text-gray-500 dark:text-gray-300">{sortBy === 'price' && (sortOrder === 'asc' ? '▲' : '▼')}</span></th>
                        <th className="p-2 text-left font-semibold text-black dark:text-white cursor-pointer group transition-all duration-300 hover:text-gray-500 dark:text-gray-300" onClick={() => handleSort('time')}>Time <span className="text-black dark:text-white rounded-full ml-2 transition-all duration-300 group-hover:text-gray-500 dark:text-gray-300">{sortBy === 'time' && (sortOrder === 'asc' ? '▲' : '▼')}</span></th>
                    </tr>
                </thead>
                <tbody>
                    {sortedOrderRef.length > 0 ? (
                        sortedOrderRef.map((order) => (
                            <tr key={order.id} className="transition-all duration-200 hover:bg-gray-300 hover:text-white bg-white dark:bg-slate-800 dark:hover:bg-slate-700 " onClick={() => setSelectedOrder(order)}>
                                <td className="p-2 cursor-pointer lg:pl-4 text-left text-black dark:text-white">{order.name}</td>
                                <td className="p-2 cursor-pointer text-left text-black dark:text-white">{order.status}</td>
                                <td className="p-2 cursor-pointer text-left text-black dark:text-white">{`Rp${order.price}`}</td>
                                <td className="p-2 cursor-pointer text-left text-black dark:text-white">{timeConverter(order.time)}</td>
                            </tr>
                        ))
                        ) : (
                        <tr>
                            <td colSpan="5" className="p-2 text-center bg-white dark:bg-slate-800 text-black dark:text-white">
                            No order available for now.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {selectedOrder ? <OrderDetails orderRef={selectedOrder} setOrderRef={setSelectedOrder} /> : null}
        </div>
    )
}