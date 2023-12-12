export default function AnalyticsLayout({merchanRef}) {
    return (
        <div className="w-full">
            <h1 className="mb-4 text-3xl font-bold leading-none tracking-tight text-black dark:text-white md:text-4xl lg:text-4xl">Analytics</h1>
            
            <div className="w-full flex flex-col lg:gap-16 gap-8">
                
                <TodaySummary merchanRef={merchanRef} />

            </div>

        </div>
    );
}

function TodaySummary({merchanRef}) {
    return (
        <div className="w-full rounded-lg py-4 bg-white dark:bg-slate-800 lg:px-8 lg:py-6 md:px-6 md:py-4 px-4 py-2 flex md:flex-row flex-col lg:items-start items-center lg:gap-8 gap-4">
            
            <div className="lg:w-1/3 md:w-1/2 w-full flex flex-col items-start border-r-2 border-gray-200 dark:border-gray-400">
                <span className="xl:text-2xl lg:text-xl text-lg font-bold text-gray-500 dark:text-gray-300 text-left">Today's Earning</span>
                <span className="xl:text-6xl lg:text-5xl text-4xl font-bold text-left text-black dark:text-white">Rp0.0</span>
            </div>

        </div>
    )
}