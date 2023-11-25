export default function DashboardLayout({user}) {
    return (
        <div className="w-full">
            <h1 className="mb-4 text-3xl font-bold leading-none tracking-tight text-gray-900 md:text-4xl lg:text-4xl">Dashboard</h1>
            
            <ToDoLayout />

        </div>
    );
}

function ToDoLayout() {
    return (
        <ol className="w-3/5 grid grid-cols-4 rounded-lg py-4 px-8 bg-gray-200">
            <li className="flex flex-col justify-center items-center w-full">
                <span className="text-xl font-bold text-amber-500">1</span>
                <span className="text-lg font-semibold">New Order</span>
            </li>
            <li className="flex flex-col justify-center items-center w-full">
                <span className="text-xl font-bold text-amber-500">1</span>
                <span className="text-lg font-semibold">On Process</span>
            </li>
            <li className="flex flex-col justify-center items-center w-full">
                <span className="text-xl font-bold text-amber-500">1</span>
                <span className="text-lg font-semibold">Ready for Pickup</span>
            </li>
            <li className="flex flex-col justify-center items-center w-full">
                <span className="text-xl font-bold text-amber-500">1</span>
                <span className="text-lg font-semibold">Finished</span>
            </li>
        </ol>
    )
}