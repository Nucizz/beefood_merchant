import Profile from '../Assets/Default Profile.webp'
import AddPhoto from '../Assets/Add Photo.png'
import { useState, useEffect } from 'react'

export function DropdownField({ label, name, options, isFilled=true, disabled=false, value, ...rest }) {
    return (
        <div className="relative z-0 w-full">
            <div className="relative">
                <select {...rest} id={name} disabled={disabled} value={value} className={"cursor-pointer w-full h-12 md:text-base text-sm pt-3 md:pb-2 block px-0 mt-0 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-black dark:focus:border-white border-gray-200 dark:border-gray-400 rounded-none " + (disabled ? "text-gray-500 dark:text-gray-300" : "")} >
                    {options}
                </select>
                <label htmlFor={name} className={"absolute top-5 md:top-3 -z-1 origin-0 text-gray-500 dark:text-gray-300 md:text-base text-sm w-full cursor-pointer " + ( isFilled ? "dropdown-label" : "")} >
                    {label}
                </label>
                <span className="absolute top-5 md:top-3  right-0 h-full text-gray-500 dark:text-gray-300 cursor-pointer md:text-base text-sm">
                    ▼
                </span>
            </div>
        </div>
    )
}

export function TextField({ label, name, type = "text", disabled = false, ...rest }) {
    const [showPassword, setShowPassword] = useState(false)
    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword)
    }
  
    return (
      <div className="relative z-0 w-full">
        <input
          {...rest}
          disabled={disabled}
          id={name}
          type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
          placeholder=" "
          className={
            "h-12 md:text-base text-sm pt-3 md:pb-2 block w-full px-0 mt-0 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-black dark:focus:border-white border-gray-200 dark:border-gray-400 rounded-none " +
            (disabled ? "text-gray-500 dark:text-gray-300" : "text-black dark:text-white")
          }
        />
        <label htmlFor={name} className="absolute duration-300 top-5 md:top-3 -z-1 origin-0 text-gray-500 dark:text-gray-300 md:text-base text-sm w-full cursor-text">
          {label}
        </label>
        {type === 'password' && (
          <span
            className="absolute top-3 right-0 cursor-pointer text-gray-500 dark:text-gray-300"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? 
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                <path d="M3.53 2.47a.75.75 0 00-1.06 1.06l18 18a.75.75 0 101.06-1.06l-18-18zM22.676 12.553a11.249 11.249 0 01-2.631 4.31l-3.099-3.099a5.25 5.25 0 00-6.71-6.71L7.759 4.577a11.217 11.217 0 014.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113z" />
                <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0115.75 12zM12.53 15.713l-4.243-4.244a3.75 3.75 0 004.243 4.243z" />
                <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 00-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 016.75 12z" />
            </svg>          
            : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                <path fill-rule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clip-rule="evenodd" />
            </svg>
          }
          </span>
        )}
      </div>
    )
  }

export function LongTextField({ label, name, disabled=false, ...rest }) {
  return(
      <div className="relative z-0 w-full">
          <textarea {...rest} disabled={disabled} id={name} placeholder=" " className={"h-32 md:text-base text-sm pt-4 md:pb-2 block w-full px-0 mt-0 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-black dark:focus:border-white border-gray-200 dark:border-gray-400 rounded-none " + (disabled ? "text-gray-500 dark:text-gray-300" : "text-black dark:text-white")} />
          <label htmlFor={name} className="absolute duration-300 top-4 -z-1 origin-0 text-gray-500 dark:text-gray-300 md:text-base text-sm w-full cursor-text">
              {label}
          </label>
      </div>
  )
}

export function TimeField({ label, name, disabled = false, ...rest }) {
  return (
    <div className="relative z-0 w-fit">
      <input
        {...rest}
        disabled={disabled}
        id={name}
        type="time"
        placeholder=" "
        className={
          "h-12 md:text-base text-sm pt-3 md:pb-2 block w-fit px-0 mt-0 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-black dark:focus:border-white border-gray-200 dark:border-gray-400 rounded-none " +
          (disabled ? "text-gray-500 dark:text-gray-300" : "text-black dark:text-white")
        }
      />
      <label
        htmlFor={name}
        className="absolute duration-300 top-5 md:top-3 -z-1 origin-0 text-gray-500 dark:text-gray-300 md:text-base text-sm w-full cursor-pointer"
      >
        {label}
      </label>
    </div>
  )
}

export function ChangePhoto({photoRef, setPhotoRef, classSize, disabled=false, type="add"}) {
  const [defaultVal, setDefaultVal] = useState(Profile)

  useEffect(() => {
    switch (type) {
      case "profile":
        setDefaultVal(Profile);
        break;
      default:
        setDefaultVal(AddPhoto);
        break;
    }
  }, [type])

  return(
      <div className={"flex flex-col gap-4 " + classSize}>
          <img
          src={photoRef ?? defaultVal}
          alt="Thumbnail"
          className={(!disabled ? "cursor-pointer" : "") + " object-cover rounded-full border " + classSize}
          />
          <label htmlFor="fileInput" className={(!disabled ? "cursor-pointer" : "hidden") + " text-transparent hover:bg-black/25 hover:text-white text-semibold transition-all duration-300 absolute flex items-center justify-center rounded-full " + classSize}>
              Change Photo
          </label>
          <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                  setPhotoRef(e.target.files[0])
              }}
              className="hidden" 
              id="fileInput"
          />
      </div>
  )
}

export function Accordion({setAccordionRef, index, indexId, title, Children, Icon}) {
    const toggleAccordion = (newIndex) => {
        setAccordionRef(index === newIndex ? null : newIndex);
    }

    return(
        <div>
            <div
                className={"group flex items-center justify-between cursor-pointer lg:px-6 lg:py-4 md:px-4 md:py-3 px-3 py-2 rounded-lg transition-all duration-300 hover:bg-amber-400 hover:text-white " + (index === indexId ? "bg-amber-500 text-white" : "bg-white dark:bg-slate-800")}
                onClick={() => toggleAccordion(indexId)}
            >
                <div className='text-black dark:text-white flex flex-row gap-2 lg:text-lg md:text-md text-base font-semibold items-center'>
                    {Icon}
                    {title}
                </div>
                <svg
                className={`md:w-6 md:h-6 w-4 h-4 transition-transform text-black dark:text-white ${index === indexId ? 'transform rotate-180' : ''}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </div>
    
            {index === indexId && (
                <div className={`text-black dark:text-white bg-white dark:bg-slate-800 p-4 rounded-lg mt-2 ${index === indexId ? 'h-fit' : 'h-0'}`}>
                    {Children}
                </div>
            )}
            
        </div>
    )
}

export function JustifiedInfo({title, content}) {
  return (
      <div className="flex flex-row text-black dark:text-white">
          <div className="w-1/4 flex flex-row justify-between font-semibold">
              <span>{title}</span>
              <span>:&nbsp;</span>
          </div>
          <p className="w-3/4">
              {content}
          </p>
      </div>
  )
}

export function Toast({message, setShowRef}) {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowRef(false);
    }, 5000)

    return () => clearTimeout(timeoutId)
  }, [setShowRef])

  return(
    <div class="inset-0 h-fit absolute z-30 m-4 bg-white dark:bg-slate-800 dark:text-white text-black rounded-md shadow-lg border-2 border-amber-500 flex flex-col px-4 py-2 lg:w-1/3 md:w-1/2 w-full" role="alert">

      <div className='flex flex-row w-full justify-between'>
        <h3 className='font-semibold text-amber-500 text-lg'>{message.title}</h3>
        <button class="mb-auto transition-all duration-300 text-lg text-gray-500 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-600 font-bold" onClick={() => setShowRef(false)}>&#x2716;</button>
      </div>

      <p className='text-justify' >{message.body}</p>

    </div>
  )
}