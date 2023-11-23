import logo from '../Assets/Beefood Icon White.png'

export default function Error({code, description}) {
    return (
        <div className="w-screen h-screen bg-pattern">

            <div className="w-screen h-screen bg-pattern-overlay absolute z-0" />

            <div className="w-screen pt-16 absolute z-20 flex flex-row justify-center items-center">
                <a href="/dashboard" className="gap-3 flex flex-row justify-center items-center hover:cursor-pointer transition-all duration-300 hover:brightness-75">
                    <img className="h-12 rounded-md" src={logo} alt="" />
                    <span className="text-4xl font-semibold text-white font-hero">BeeFood</span>
                </a>
            </div>

            <div className="w-screen h-screen flex flex-row justify-center items-center gap-3 z-10 absolute">
                <h1 className={"text-5xl md:text-6xl lg:text-8xl font-bold text-red-600 " + (code ? "block" : "hidden")}>{code}</h1>
                <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold text-white">{description}</h2>
            </div>

        </div>
    )
}

export function Unlisted() {
    return (
        <div className="w-screen h-screen bg-pattern">

            <div className="w-screen h-screen bg-pattern-overlay absolute z-0" />

            <div className="w-screen pt-16 absolute z-20 flex flex-row justify-center items-center">
                <a href="/dashboard" className="gap-3 flex flex-row justify-center items-center hover:cursor-pointer transition-all duration-300 hover:brightness-75">
                    <img className="h-12 rounded-md" src={logo} alt="" />
                    <span className="text-4xl font-semibold text-white font-hero">BeeFood</span>
                </a>
            </div>

            <div className="flex flex-col w-screen h-screen justify-center items-center gap-10 z-10 absolute">
                <div className="flex flex-row justify-center items-center w-full gap-3">
                    <h1 className="text-5xl md:text-6xl lg:text-8xl font-bold text-red-600">:(</h1>
                    <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold text-white">You're not verified yet!</h2>
                </div>
                <h2 className="text-xl md:text-2xl lg:text-4xl font-bold text-white w-full text-center">Email your proposal to<br />
                <a href="mailto:beefood.contact@gmail.com" className="hover:text-blue-500 text-blue-600 hover:cursor-pointer transition-all underline">beefood.contact@gmail.com</a>
                <br/>with format of Name, Email, and Phone.</h2>
            </div>

        </div>
    )
}