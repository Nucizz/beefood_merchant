import { useState, useEffect } from "react";
import { getTodayOrderList } from "../Javascript/OrderHandler";
import { OrderDetails } from "./Order";
import { ChangePhoto, Toast } from "../Class/Component";
import { timeConverter, moneyConverter, statusConverter } from "../Javascript/Global";
import { onMessageListener } from '../firebase-config.js';

export default function DashboardLayout({merchanRef}) {
    const [show, setShow] = useState(false);
    const [notification, setNotification] = useState({ title: '', body: '' });
    const [order, setOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchTodayOrderList = async () => {
        try {
            setOrder(await getTodayOrderList(merchanRef.id))
        } catch (e) {
            console.log(e)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        const handlePayload = async (payload) => {
            setShow(true)
            setNotification({ title: payload.notification.title, body: payload.notification.body })
            console.log(payload)

            if (payload.notification.title === "New Order Received") {
                await fetchTodayOrderList();
            }
        }

        const fetchData = async () => {
            try {
                const payload = await onMessageListener();
                await handlePayload(payload)
            } catch (err) {
                console.log('failed: ', err)
            }
        }

        fetchData()
    }, [])

    useEffect(() => {
        fetchTodayOrderList()
    }, [])

    if (isLoading) {
        return null
    }

    return (
        <div className="w-full gap-4 flex flex-col" >
            <h1 className="text-3xl font-bold leading-none tracking-tight text-black dark:text-white md:text-4xl lg:text-4xl">Dashboard</h1>
            
            <GeneralInformation merchanRef={merchanRef} />

            <ToDoListLayout orderRef={order} />

            <OrderListLayout orderRef={order} />

            { show ? <Toast message={notification} setShowRef={setShow} /> : null }

        </div>
    )
}

function GeneralInformation({merchanRef}) {
    return (
        <div className="w-full rounded-lg bg-white dark:bg-slate-800 lg:px-8 lg:py-6 md:px-6 md:py-4 px-4 py-2 flex lg:flex-row flex-col lg:items-start items-center lg:gap-8 gap-4">

            <ChangePhoto photoRef={merchanRef.profilePicture} classSize={"w-36 h-36"} disabled={true} />

            <div className="flex flex-col lg:items-start items-center">
                <span className="xl:text-6xl md:text-4xl text-2xl font-bold text-black dark:text-white text-center md:text-left">{merchanRef.name}</span>
                <p className="xl:text-2xl lg:text-xl md:text-lg text-md text-gray-500 dark:text-gray-300 text-center md:text-left">{merchanRef.description}</p>
            </div>

        </div>
    )
}

function ToDoListLayout({orderRef}) {
    const [needConfirmation, setNeedConfirmation] = useState(0)
    const [needProcessing, setNeedProcessing] = useState(0)
    const [waitingPickup, setWaitingPickup] = useState(0)
    const [finished, setFinished] = useState(0)
    const [cancelled, setCancelled] = useState(0)

    useEffect(() => {
        let newNeedConfirmation = 0;
        let newNeedProcessing = 0;
        let newWaitingPickup = 0;
        let newFinished = 0;
        let newCancelled = 0;

        if (orderRef) {
            for (const order of orderRef) {
                switch (order.status) {
                    case 1:
                        newNeedConfirmation++;
                        break;
                    case 2:
                        newNeedProcessing++;
                        break;
                    case 3:
                        newWaitingPickup++;
                        break;
                    case 4:
                        newFinished++;
                        break;
                    case -1:
                        newCancelled++;
                        break;
                    default:
                        break;
                }
            }
        }

        // Set the state with the new counts
        setNeedConfirmation(newNeedConfirmation);
        setNeedProcessing(newNeedProcessing);
        setWaitingPickup(newWaitingPickup);
        setFinished(newFinished);
        setCancelled(newCancelled);
    }, [orderRef])


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
                        <th className="p-2 lg:pl-4 text-left font-semibold text-black dark:text-white cursor-pointer group transition-all duration-300 hover:text-gray-500" onClick={() => handleSort('name')}>Name <span className="text-black rounded-full ml-2 transition-all duration-300 group-hover:text-gray-500 dark:text-gray-300">{sortBy === 'name' && (sortOrder === 'asc' ? '▲' : '▼')}</span></th>
                        <th className="p-2 text-left font-semibold text-black dark:text-white cursor-pointer group transition-all duration-300 hover:text-gray-500" onClick={() => handleSort('status')}>Status <span className="text-black rounded-full ml-2 transition-all duration-300 group-hover:text-gray-500 dark:text-gray-300">{sortBy === 'status' && (sortOrder === 'asc' ? '▲' : '▼')}</span></th>
                        <th className="p-2 text-left font-semibold text-black dark:text-white cursor-pointer group transition-all duration-300 hover:text-gray-500" onClick={() => handleSort('totalPrice')}>Price <span className="text-black rounded-full ml-2 transition-all duration-300 group-hover:text-gray-500 dark:text-gray-300">{sortBy === 'totalPrice' && (sortOrder === 'asc' ? '▲' : '▼')}</span></th>
                        <th className="p-2 text-left font-semibold text-black dark:text-white cursor-pointer group transition-all duration-300 hover:text-gray-500" onClick={() => handleSort('createTime')}>Time <span className="text-black rounded-full ml-2 transition-all duration-300 group-hover:text-gray-500 dark:text-gray-300">{sortBy === 'createTime' && (sortOrder === 'asc' ? '▲' : '▼')}</span></th>
                    </tr>
                </thead>
                <tbody>
                    {sortedOrderRef.length > 0 ? (
                        sortedOrderRef.map((order) => (
                            <tr key={order.id} className="transition-all duration-200 hover:bg-gray-300 hover:text-white bg-white dark:bg-slate-800 dark:hover:bg-slate-700 " onClick={() => setSelectedOrder(order)}>
                                <td className="p-2 cursor-pointer lg:pl-4 text-left text-black dark:text-white">{order.name}</td>
                                <td className="p-2 cursor-pointer text-left text-black dark:text-white">{statusConverter(order.status)}</td>
                                <td className="p-2 cursor-pointer text-left text-black dark:text-white">{moneyConverter(order.totalPrice)}</td>
                                <td className="p-2 cursor-pointer text-left text-black dark:text-white">{timeConverter(order.createTime)}</td>
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