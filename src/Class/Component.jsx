import Profile from '../Assets/Default Profile.webp'

export function DropdownField({ label, name, options, isFilled=true, disabled=false, ...rest }) {
    return (
        <div className="relative z-0 w-full">
            <div className="relative">
                <select {...rest} id={name} disabled={disabled} className={"cursor-pointer w-full h-12 md:text-base text-sm md:pt-3 md:pb-2 block px-0 mt-0 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-black border-gray-200 rounded-none " + (disabled ? "text-gray-400" : "")} >
                    {options}
                </select>
                <label htmlFor={name} className={"absolute top-3 -z-1 origin-0 text-gray-500 md:text-base text-sm w-full " + ( isFilled ? "dropdown-label" : "")} >
                    {label}
                </label>
                <span className="absolute top-3 right-0 h-full text-gray-500 cursor-pointer md:text-base text-sm">
                    ▼
                </span>
            </div>
        </div>
    )
}

export function TextField({ label, name, type = "text", disabled=false, ...rest }) {
    return (
        <div className="relative z-0 w-full">
            <input {...rest} disabled={disabled} id={name} type={type} placeholder=" " className={"h-12 md:text-base text-sm md:pt-3 md:pb-2 block w-full px-0 mt-0 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-black border-gray-200 rounded-none " + (disabled ? "text-gray-400" : "")} />
            <label htmlFor={name} className="absolute duration-300 top-3 -z-1 origin-0 text-gray-500 md:text-base text-sm w-full" >
            {label}
            </label>
        </div>
    )
}

export function LongTextField({ label, name, ...rest }) {
    return(
        <div className="relative z-0 w-full">
            <textarea {...rest} id={name} placeholder=" " className="h-32 md:text-base text-sm md:pt-3 md:pb-2 block w-full px-0 mt-0 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-black border-gray-200 rounded-none" />
            <label htmlFor={name} className="absolute duration-300 top-3 -z-1 origin-0 text-gray-500 md:text-base text-sm w-full">
                {label}
            </label>
        </div>
    );
}

export function ChangePhoto({photoRef, setPhotoRef, classSize, disabled=false}) {
    return(
        <div className={"flex flex-col gap-4 " + classSize}>
            <img
            src={photoRef ?? Profile}
            alt="Profile"
            className={(!disabled ? "cursor-pointer" : "") + " object-cover rounded-full " + classSize}
            />
            <label htmlFor="fileInput" className={(!disabled ? "cursor-pointer" : "hidden") + " text-transparent hover:bg-black/25 hover:text-white text-semibold transition-all duration-300 absolute flex items-center justify-center rounded-full " + classSize}>
                Change Photo
            </label>
            <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                    setPhotoRef(e.target.files[0]);
                }}
                className="hidden" 
                id="fileInput"
            />
        </div>
    )
}

export function Accordion({setAccordionRef, index, Children, Icon}) {
    const toggleAccordion = (newIndex) => {
        setAccordionRef(index === newIndex ? null : newIndex);
    }

    return(
        <div>
            <div
                className={"group flex items-center justify-between cursor-pointer lg:px-6 lg:py-4 md:px-4 md:py-3 px-3 py-2 rounded-lg transition-all duration-300 hover:bg-amber-400 hover:text-white " + (index === 1 ? "bg-amber-500 text-white" : "bg-gray-100")}
                onClick={() => toggleAccordion(1)}
            >
                <div className='flex flex-row gap-2 lg:text-lg md:text-md text-base font-semibold items-center'>
                    {Icon}
                    Account Settings
                </div>
                <svg
                className={`md:w-6 md:h-6 w-4 h-4 transition-transform ${index === 1 ? 'transform rotate-180' : ''}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </div>
    
            {index === 1 && (
                <div className="bg-gray-100 p-4 rounded-lg mt-2">
                    {Children}
                </div>
            )}
        </div>
    )
}