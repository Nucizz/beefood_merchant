import { useState, useEffect, useRef } from "react";
import logo from "../Assets/BeeFood Text Monochrome.png";

export default function NavbarLayout({ activePage }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [darkmode, setDarkmode] = useState(() => {
        const savedMode = localStorage.getItem("darkMode");
        savedMode
            ? document.documentElement.classList.remove("dark")
            : document.documentElement.classList.add("dark");
        return savedMode ? JSON.parse(savedMode) : false;
    });
    const buttonRef = useRef(null);

    const handleClickOutside = (event) => {
        if (buttonRef.current && buttonRef.current.contains(event.target)) {
            return;
        }

        const sidebar = document.getElementById("default-sidebar");
        if (sidebar && !sidebar.contains(event.target)) {
            setIsExpanded(false);
        }
    };

    useEffect(() => {
        document.documentElement.className = darkmode ? "dark" : "";
    }, [darkmode]);

    const toggleDarkmode = () => {
        setDarkmode((prevMode) => {
            const newMode = !prevMode;
            localStorage.setItem("darkMode", JSON.stringify(newMode));
            newMode
                ? document.documentElement.classList.remove("dark")
                : document.documentElement.classList.add("dark");
            return newMode;
        });
    };

    useEffect(() => {
        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    return (
        <div className="bg-gray-100 dark:bg-slate-950">
            <button
                ref={buttonRef}
                onClick={() => setIsExpanded(!isExpanded)}
                aria-controls="default-sidebar"
                type="button"
                className="inline-flex items-center p-2 mt-2 ml-3 text-sm text-gray-500 dark:text-gray-300 rounded-lg sm:hidden hover:bg-orange-100 hover:text-orange-600 focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
                <span className="sr-only">Open sidebar</span>
                <svg
                    className="w-6 h-6"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        clipRule="evenodd"
                        fillRule="evenodd"
                        d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                    ></path>
                </svg>
            </button>

            <aside
                id="default-sidebar"
                className={
                    "fixed top-0 left-0 z-40 w-64 h-screen transition-transform " +
                    (isExpanded ? "" : "-translate-x-full sm:translate-x-0")
                }
                aria-label="Sidebar"
            >
                <div
                    className={
                        "h-full pl-4 py-2 overflow-y-auto bg-amber-500 flex flex-col justify-between " +
                        (isExpanded ? "shadow-lg shadow-amber-500" : "")
                    }
                >
                    <ul className="space-y-2 font-medium">
                        <li className="p-2">
                            <img src={logo} alt="Logo" className="w-full pr-3" />
                            <span className="text-white font-light antialiased text-lg">
                                for Merchant
                            </span>
                        </li>
                        <NavbarButton
                            title={"Dashboard"}
                            reference={"/dashboard"}
                            active={activePage === "Dashboard"}
                            Icon={() => {
                                return (
                                    <svg
                                        className="w-5 h-5 text-white"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="currentColor"
                                        viewBox="0 0 18 18"
                                    >
                                        <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
                                    </svg>
                                );
                            }}
                        />
                        <NavbarButton
                            title={"Products"}
                            reference={"/products"}
                            active={activePage === "Products"}
                            Icon={() => {
                                return (
                                    <svg
                                        className="w-5 h-5 text-white"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M17.876.517A1 1 0 0 0 17 0H3a1 1 0 0 0-.871.508C1.63 1.393 0 5.385 0 6.75a3.236 3.236 0 0 0 1 2.336V19a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-6h4v6a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V9.044a3.242 3.242 0 0 0 1-2.294c0-1.283-1.626-5.33-2.124-6.233ZM15.5 14.7a.8.8 0 0 1-.8.8h-2.4a.8.8 0 0 1-.8-.8v-2.4a.8.8 0 0 1 .8-.8h2.4a.8.8 0 0 1 .8.8v2.4ZM16.75 8a1.252 1.252 0 0 1-1.25-1.25 1 1 0 0 0-2 0 1.25 1.25 0 0 1-2.5 0 1 1 0 0 0-2 0 1.25 1.25 0 0 1-2.5 0 1 1 0 0 0-2 0A1.252 1.252 0 0 1 3.25 8 1.266 1.266 0 0 1 2 6.75C2.306 5.1 2.841 3.501 3.591 2H16.4A19.015 19.015 0 0 1 18 6.75 1.337 1.337 0 0 1 16.75 8Z" />
                                    </svg>
                                );
                            }}
                        />
                        <NavbarButton
                            title={"Analytics"}
                            reference={"/analytics"}
                            active={activePage === "Analytics"}
                            Icon={() => {
                                return (
                                    <svg
                                        className="w-5 h-5 text-white"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="currentColor"
                                        viewBox="0 0 22 21"
                                    >
                                        <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                                        <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                                    </svg>
                                );
                            }}
                        />
                        <NavbarButton
                            title={"Account"}
                            reference={"/account"}
                            active={activePage === "Account"}
                            Icon={() => {
                                return (
                                    <svg
                                        className="w-5 h-5 text-white"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="currentColor"
                                        viewBox="0 0 14 18"
                                    >
                                        <path d="M7 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm2 1H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                                    </svg>
                                );
                            }}
                        />
                    </ul>
                    <div className="pr-4 w-full flex flex-col gap-5">
                        <div className="flex flex-row items-center justify-center relative text-white font-semibold gap-5">
                            Dark Mode
                            <input
                                className="mr-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-full bg-neutral-300 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-neutral-100 after:shadow-md after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-amber-600 checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.5rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-primary checked:after:shadow-md checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-amber-600 checked:focus:before:ml-[1.5rem] checked:focus:before:scale-100 checked:focus:before:shadow-md checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s]"
                                type="checkbox"
                                role="switch"
                                onChange={toggleDarkmode}
                                checked={darkmode}
                            />
                        </div>
                        <span className="w-full text-white text-center text-sm">
                            Ⓒ 2023 BeeFood BINUS
                        </span>
                    </div>
                </div>
            </aside>
        </div>
    );
}

function NavbarButton({ title, Icon, reference, active = false }) {
    return (
        <li>
            <a
                href={reference}
                className={
                    "flex items-center py-2 px-3 rounded-l-lg text-white group transition-all duration-300 " +
                    (active
                        ? "bg-orange-500 shadow-md shadow-orange-600 hover:bg-orange-600"
                        : "hover:bg-amber-600")
                }
            >
                <Icon />
                <span className="ml-4">{title}</span>
            </a>
        </li>
    );
}
