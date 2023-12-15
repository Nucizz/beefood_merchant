import { useState, useRef, useEffect } from "react"
import { moneyConverter, timeConverter } from "../Javascript/Global"
import { onMessageListener } from '../firebase-config.js';
import { Toast } from "../Class/Component.jsx";

export default function AnalyticsLayout({merchanRef}) {
    const [show, setShow] = useState(false);
    const [notification, setNotification] = useState({title: '', body: ''})
  
    onMessageListener().then(payload => {
      setShow(true)
      setNotification({title: payload.notification.title, body: payload.notification.body})
      console.log(payload)
    }).catch(err => console.log('failed: ', err))

    return (
        <div className="w-full flex flex-col gap-4">
            <h1 className="mb-4 text-3xl font-bold leading-none tracking-tight text-black dark:text-white md:text-4xl lg:text-4xl">Analytics</h1>
            
            <MerchantSummary merchanRef={merchanRef} />

            <TransactionListLayout orderRef={[]} />

            { show ? <Toast message={notification} setShowRef={setShow} /> : null }

        </div>
    );
}

function MerchantSummary({merchanRef}) {
    const [viewAllTime, setViewAllTime] = useState(false)

    return (
        <div className="relative w-full rounded-lg bg-white dark:bg-slate-800 lg:px-8 lg:py-6 md:px-6 md:py-4 px-4 py-2 flex lg:flex-row flex-col items-center lg:gap-8 gap-4">
            
            <div className="lg:w-2/5 w-full flex flex-col items-start lg:border-r-2 border-gray-200 dark:border-gray-400">
                <span className="xl:text-2xl lg:text-xl text-lg font-bold text-gray-500 dark:text-gray-300 text-left">{(viewAllTime ? "All Time" : "Today's") + " Earning"}</span>
                <span className="xl:text-6xl lg:text-5xl text-4xl font-bold text-left text-black dark:text-white">{moneyConverter(viewAllTime ? merchanRef.totalEarning : 0)}</span>
            </div>

            <ol className="lg:w-3/5 w-full flex flex-row justify-between">
                <li className="flex flex-col justify-evenly items-center lg:w-1/3 gap-2">
                    <span className="xl:text-xl lg:text-lg text-md font-semibold text-gray-500 dark:text-gray-300 text-left">{(viewAllTime ? "All Time" : "Today's") + " Order"}</span>
                    <span className="xl:text-4xl lg:text-3xl text-2xl font-bold text-left text-black dark:text-white">{viewAllTime ? merchanRef.totalOrder : 0}</span>
                </li>
                <li className="flex flex-col justify-evenly items-center lg:w-1/3 gap-2">
                    <span className="xl:text-xl lg:text-lg text-md font-semibold text-gray-500 dark:text-gray-300 text-left">Your Rating</span>
                    <span className="xl:text-4xl lg:text-3xl text-2xl font-bold text-left text-black dark:text-white">{merchanRef.rating + " ⭐"}</span>
                </li>
                <li className="flex flex-col justify-evenly items-center lg:w-1/3 gap-2">
                    <span className="xl:text-xl lg:text-lg text-md font-semibold text-gray-500 dark:text-gray-300 text-left">Queue Time</span>
                    <span className="xl:text-4xl lg:text-3xl text-2xl font-bold text-left text-black dark:text-white">{merchanRef.queueTime + " mins"}</span>
                </li>
            </ol>

            <div className="absolute top-0 right-0 p-4">
                <button className="bf-bg-color xl:h-12 xl:w-12 h-10 w-10 rounded-md text-white flex items-center justify-center" onClick={() => {setViewAllTime(!viewAllTime)}}>
                    <svg viewBox="0 0 24 24" className="xl:w-8 lg:h-8 h-7 w-7" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M18 10L21 7M21 7L18 4M21 7H7M6 14L3 17M3 17L6 20M3 17H17" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                </button>
            </div>

        </div>
    )
}

function DateList({ setDate, date }) {
    const currentDate = new Date()
    const containerRef = useRef(null);

    const dateList = [...Array(14).keys()].map((index) => {
        const newDate = new Date(currentDate)
        newDate.setDate(currentDate.getDate() - index)
        return newDate
    }).reverse()

    const classAttributes = (dateData) => {
        if(dateData === date.getDate()) {
            return "bg-amber-500"
        } else if(dateData === currentDate.getDate()) {
            return "bg-gray-300 dark:bg-slate-500"
        } else {
            return "bg-white dark:bg-slate-800"
        }
    }

    useEffect(() => {
        containerRef.current.scrollLeft = containerRef.current.scrollWidth
    }, [])

    return (
        <div ref={containerRef} className="w-full overflow-x-auto mb-2">
            <div className="w-fit flex flex-row">
                {dateList.map((dateData) => (
                    <button key={dateData} onClick={() => setDate(dateData)} className={"date-button flex items-center justify-center h-12 w-12 rounded-md text-black dark:text-white font-semibold mr-5 transition-all duration-300 hover:bg-amber-400 dark:hover:bg-amber-400 " + classAttributes(dateData.getDate())}>
                        {dateData.getDate()}
                    </button>
                ))}
            </div>
        </div> 
    )
}

function TransactionListLayout({ orderRef }) {
    const [sortBy, setSortBy] = useState('time')
    const [sortOrder, setSortOrder] = useState('desc')
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [date, setDate] = useState(new Date())
  
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
            <h2 className="w-full text-lg md:text-xl lg:text-2xl font-bold text-black dark:text-white">Transaction List</h2>

            <DateList setDate={setDate} date={date} />
        
            <table className="w-full table-auto rounded-lg overflow-hidden xl:text-lg lg:text-base text-sm">
                <thead className="bg-white dark:bg-slate-800 border-b ">
                    <tr>
                        <th className="p-2 lg:pl-4 text-left font-semibold text-black dark:text-white cursor-pointer group transition-all duration-300 hover:text-gray-500" onClick={() => handleSort('name')}>Name <span className="text-black dark:text-white rounded-full ml-2 transition-all duration-300 group-hover:text-gray-500">{sortBy === 'name' && (sortOrder === 'asc' ? '▲' : '▼')}</span></th>
                        <th className="p-2 text-left font-semibold text-black dark:text-white cursor-pointer group transition-all duration-300 hover:text-gray-500" onClick={() => handleSort('price')}>Price <span className="text-black dark:text-white rounded-full ml-2 transition-all duration-300 group-hover:text-gray-500">{sortBy === 'price' && (sortOrder === 'asc' ? '▲' : '▼')}</span></th>
                        <th className="p-2 text-left font-semibold text-black dark:text-white cursor-pointer group transition-all duration-300 hover:text-gray-500" onClick={() => handleSort('time')}>Time <span className="text-black dark:text-white rounded-full ml-2 transition-all duration-300 group-hover:text-gray-500">{sortBy === 'time' && (sortOrder === 'asc' ? '▲' : '▼')}</span></th>
                    </tr>
                </thead>
                <tbody>
                    {sortedOrderRef.length > 0 ? (
                        sortedOrderRef.map((order) => (
                            <tr key={order.id} className="transition-all duration-200 hover:bg-gray-300 hover:text-white bg-white dark:bg-slate-800 dark:hover:bg-slate-700" onClick={() => setSelectedOrder(order)}>
                                <td className="p-2 cursor-pointer lg:pl-4 text-left text-black dark:text-white">{order.name}</td>
                                <td className="p-2 cursor-pointer text-left text-black dark:text-white">{`Rp${order.price}`}</td>
                                <td className="p-2 cursor-pointer text-left text-black dark:text-white">{timeConverter(order.time)}</td>
                            </tr>
                        ))
                        ) : (
                        <tr>
                            <td colSpan="5" className="p-2 text-center bg-white dark:bg-slate-800 text-black dark:text-white">
                                No transaction available on this date.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* {selectedOrder ? <OrderDetails orderRef={selectedOrder} setOrderRef={setSelectedOrder} /> : null} */}
        </div>
    )
}