import { useState } from 'react';
import { ChangePhoto, Accordion, TextField, DropdownField, LongTextField, TimeField } from '../Class/Component'
import { authenticateLogout, updateMerchantData, sendPasswordResetMail } from '../Javascript/MerchantHandler';
import { CAMPUS_LOCATION } from '../Javascript/Global'

export default function AccountLayout({merchanRef, setMerchantRef}) {
    return (
        <div className="w-full">
            <h1 className="mb-4 text-3xl font-bold leading-none tracking-tight text-gray-900 md:text-4xl lg:text-4xl">Account</h1>
            
            <div className="w-full flex flex-col-reverse lg:gap-16 gap-8">

                <SettingsList merchanRef={merchanRef} setMerchantRef={setMerchantRef} />

                <ProfileInformation merchanRef={merchanRef} /> 

            </div>

        </div>
    );
}

function ProfileInformation({merchanRef}) {
    const [logoutConfirmation, setLogoutConfirmation] = useState(false);

    return (
        <div className="w-full flex flex-col lg:flex-row gap-4 lg:gap-10 lg:items-start items-center lg:h-36">

            <ChangePhoto photoRef={merchanRef.profilePicture} classSize={"w-36 h-36"} disabled={true} />
            
            <div className="flex flex-col justify-evenly lg:items-start items-center h-full w-fit">
                <span className="xl:text-6xl md:text-4xl text-2xl font-bold text-center md:text-left">{merchanRef.name}</span>
                <span className="xl:text-2xl lg:text-xl md:text-lg text-md text-gray-500 text-center md:text-left">{merchanRef.email}</span>
                <span className="xl:text-2xl lg:text-xl md:text-lg text-md text-gray-500 text-center md:text-left">{merchanRef.phone}</span>
            </div>

            <button onClick={() => setLogoutConfirmation(true)} className="px-4 transition-all duration-300 bg-red-500 hover:bg-red-600 md:h-10 h-8 rounded-md font-medium text-white flex flex-row gap-2 items-center md:ml-auto">
                <svg className="lg:h-8 lg:w-8 md:w-6 md:h-6 w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                </svg>
                Logout
            </button>

            {logoutConfirmation && (
                <div className="z-30 fixed inset-0 flex items-center justify-center bg-black/50">
                    <div className="md:ml-64 bg-white md:p-4 p-3 rounded-md flex flex-col lg:gap-4 md:gap-3 gap-2">
                        <p className="md:text-xl text-md font-semibold">Are you sure you want to logout?</p>
                        <div className="flex flex-row justify-end gap-2">
                            <button onClick={() => setLogoutConfirmation(false)} className="px-4 bf-bg-color md:h-9 h-8 rounded-md font-medium text-white">Cancel</button>
                            <button onClick={() => authenticateLogout()} className="px-4 transition-all duration-300 bg-red-500 hover:bg-red-600 md:h-9 h-8 rounded-md font-medium text-white">Logout</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}

function SettingsList({merchanRef, setMerchantRef}) {
    const [openAccordion, setOpenAccordion] = useState(null);

    return (
        <div className="w-full flex flex-col gap-4">

            <Accordion setAccordionRef={setOpenAccordion} index={openAccordion} indexId={1} title={"General Settings"}
            Icon={
                <svg className='md:w-6 md:h-6 w-4 h-4' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.75 12.75h1.5a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5zM12 6a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 0112 6zM12 18a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 0112 18zM3.75 6.75h1.5a.75.75 0 100-1.5h-1.5a.75.75 0 000 1.5zM5.25 18.75h-1.5a.75.75 0 010-1.5h1.5a.75.75 0 010 1.5zM3 12a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 013 12zM9 3.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zM12.75 12a2.25 2.25 0 114.5 0 2.25 2.25 0 01-4.5 0zM9 15.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" />
                </svg>

            }
            Children={
                <GeneralSettings merchanRef={merchanRef} setMerchantRef={setMerchantRef} />
            }
            />
    
            <Accordion setAccordionRef={setOpenAccordion} index={openAccordion} indexId={2} title={"Account Settings"}
            Icon={
                <svg className='md:w-6 md:h-6 w-4 h-4' fill='currentColor' viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><title>Account Settings</title><path d="M9.6,3.32a3.86,3.86,0,1,0,3.86,3.85A3.85,3.85,0,0,0,9.6,3.32M16.35,11a.26.26,0,0,0-.25.21l-.18,1.27a4.63,4.63,0,0,0-.82.45l-1.2-.48a.3.3,0,0,0-.3.13l-1,1.66a.24.24,0,0,0,.06.31l1,.79a3.94,3.94,0,0,0,0,1l-1,.79a.23.23,0,0,0-.06.3l1,1.67c.06.13.19.13.3.13l1.2-.49a3.85,3.85,0,0,0,.82.46l.18,1.27a.24.24,0,0,0,.25.2h1.93a.24.24,0,0,0,.23-.2l.18-1.27a5,5,0,0,0,.81-.46l1.19.49c.12,0,.25,0,.32-.13l1-1.67a.23.23,0,0,0-.06-.3l-1-.79a4,4,0,0,0,0-.49,2.67,2.67,0,0,0,0-.48l1-.79a.25.25,0,0,0,.06-.31l-1-1.66c-.06-.13-.19-.13-.31-.13L19.5,13a4.07,4.07,0,0,0-.82-.45l-.18-1.27a.23.23,0,0,0-.22-.21H16.46M9.71,13C5.45,13,2,14.7,2,16.83v1.92h9.33a6.65,6.65,0,0,1,0-5.69A13.56,13.56,0,0,0,9.71,13m7.6,1.43a1.45,1.45,0,1,1,0,2.89,1.45,1.45,0,0,1,0-2.89Z"></path></g></svg>
            }
            Children={
                <AccountSettings merchanRef={merchanRef} />
            }
            />

            <Accordion setAccordionRef={setOpenAccordion} index={openAccordion} indexId={3} title={"Help"}
            Icon={
                <svg className='md:w-6 md:h-6 w-4 h-4' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clip-rule="evenodd" />
                </svg>

            }
            Children={
                <HelpText />
            }
            />
    
        </div>
    );
}

function AccountSettings({merchanRef}){
    const [buttonUsable, setButtonUsable] = useState(true)
    const [resetConfirmation, setResetConfirmation] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState("Are you sure you want to reset your password?");

    const onResetPasswordPressed = () => {
        sendPasswordResetMail(merchanRef.email)
        setButtonUsable(false)
        setConfirmationMessage(`An email has been sent to ${merchanRef.email} for password reset.`);
        setTimeout(() => {
            setResetConfirmation(false)
            setButtonUsable(true)
            setConfirmationMessage("Are you sure you want to reset your password?");
          }, 2500)
    }

    return(
        <div className='grid grid-cols-1 gap-3'>
            
            <p className="rounded-md bg-amber-200 text-amber-500 py-1 px-2 md:py-2 md:px-3 w-full h-fit lg:text-base text-sm">
                <b>Note:</b> To change your contact information such as email and phone please contact BeeFood admin.   
            </p>
            <TextField label="Email" name="email" value={merchanRef.email} type="email" onChange={() => {}} disabled={true} />
            <TextField label="Phone" name="phone" type="tel" onClick={() => {}} value={merchanRef.phone} onChange={() => {}} disabled={true} />

            <button className="ml-auto px-8 bg-red-500 hover:bg-red-600 md:h-9 h-8 transition-all duration-300 rounded-md font-medium text-white mt-5" type="button" onClick={() => setResetConfirmation(true)}>Reset Password</button>

            {resetConfirmation && (
                <div className="z-30 fixed inset-0 flex items-center justify-center bg-black/50">
                    <div className="md:ml-64 bg-white md:p-4 p-3 rounded-md flex flex-col lg:gap-4 md:gap-3 gap-2">
                        <p className="md:text-xl text-md font-semibold">{confirmationMessage}</p>
                        <div className="flex flex-row justify-end gap-2">
                            <button onClick={() => setResetConfirmation(false)} className={"px-4 bf-bg-color md:h-9 h-8 rounded-md font-medium text-white " + (buttonUsable ? "block" : "hidden")}>Cancel</button>
                            <button onClick={onResetPasswordPressed} className={"px-4 transition-all duration-300 bg-red-500 hover:bg-red-600 md:h-9 h-8 rounded-md font-medium text-white " + (buttonUsable ? "block" : "hidden")}>Reset Password</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}

function GeneralSettings({merchanRef, setMerchantRef}) {
    const [error, setError] = useState("")
    const [editable, setEditable] = useState(false)
    const [profilePicture, setProfilePicture] = useState(null)
    const [name, setName] = useState(merchanRef.name)
    const [campus, setCampus] = useState(merchanRef.campus)
    const [location, setLocation] = useState(merchanRef.location)
    const [description, setDescription] = useState(merchanRef.description)
    const [openTime, setOpenTime] = useState(merchanRef.openTime)
    const [closeTime, setCloseTime] = useState(merchanRef.closeTime)

    const onCancel = () => {
        setError("")
        setProfilePicture(null)
        setName(merchanRef.name)
        setCampus(merchanRef.campus)
        setLocation(merchanRef.location)
        setDescription(merchanRef.description)
        setOpenTime(merchanRef.openTime)
        setCloseTime(merchanRef.closeTime)
        setEditable(false)
    }


    const init = (data) => {
        setProfilePicture(null)
        setName(data.name)
        setDescription(data.description)
        setCampus(data.campus)
        setLocation(data.location)
    }

    const onCampusChange = (campusName) => {
        setCampus(campusName)
        for (const campusInfo of CAMPUS_LOCATION) {
            if (campusInfo.campus === campusName) {
                setLocation(campusInfo.location[0])
                break
            }
        }
    }

    const updateGeneralData = async () => {
        if(location === "" || campus === "" || name === "") {
            setError("Please fill in the forms.")
        } else {
            const newProfilePicture = profilePicture !== merchanRef.profilePicture ? profilePicture : null
            const res = await updateMerchantData(merchanRef.id, name, description, campus, location, newProfilePicture, openTime, closeTime)
            if(res) {
                setMerchantRef(res)
                setEditable(false)
                init(res)
            } else {
                setError("Something went wrong.")
            }
        }
    }

    return(
        <div className='grid grid-cols-1 gap-3'>

            <div className='w-full flex md:flex-row flex-col items-center justify-evenly mb-5 md:gap-0 gap-5'> 
                <ChangePhoto photoRef={profilePicture ? URL.createObjectURL(profilePicture) : merchanRef.profilePicture} setPhotoRef={setProfilePicture} classSize={"xl:w-32 xl:h-32 md:w-24 md:h-24 w-28 h-28"} disabled={!editable} />
                <p className="rounded-md bg-amber-200 text-amber-500 py-1 px-2 md:py-2 md:px-3 md:w-2/3 w-full h-fit lg:text-base text-sm">
                    <b>Note:</b> This changes applies right away and will be visible to all of BeeFood merchants. 
                </p>
            </div>
            {error ? <div className={"mb-2 w-full md:h-9 h-8 rounded-md flex flex-row items-center md:px-3 px-2 md:text-base text-sm text-red-600 bg-red-100"}>{error}</div> : <></>}
            <TextField label="Name" name="name" value={name} onChange={(e) => setName(e.target.value)} disabled={!editable} />
            <LongTextField label="Description" name="description" value={description} onChange={(e) => setDescription(e.target.value)} disabled={!editable} />
            <DropdownField label="Campus" name="campus" value={campus} onChange={(e) => {onCampusChange(e.target.value)}} options={CAMPUS_LOCATION.map((campusInfo) => (
                    <option key={campusInfo.campus} value={campusInfo.campus}>
                        {campusInfo.campus}
                    </option>
                ))} disabled={!editable} />
            <DropdownField label="Location" name="location" value={location} onChange={(e) => {setLocation(e.target.value)}} options={campus
        ? CAMPUS_LOCATION.find((campusInfo) => campusInfo.campus === campus)?.location.map((locationData) => (
              <option key={locationData} value={locationData} className="cursor-pointer">
                  {locationData} 
              </option>
                ))
            : null} disabled={!editable} />
            <div className="w-full flex flex-row gap-8">
                <TimeField label="Open Time" name="opentime" value={openTime} onChange={(e) => {setOpenTime(e.target.value)}} disabled={!editable} />
                <TimeField label="Close Time" name="closetime" value={closeTime} onChange={(e) => {setCloseTime(e.target.value)}} disabled={!editable} />
            </div>

            {!editable ? 
            <button className="ml-auto px-8 bf-bg-color md:h-9 h-8 rounded-md font-medium text-white mt-5" type="button" onClick={() => setEditable(true)}>Edit</button>
            : <div className="flex flex-row justify-end mt-5 gap-2">
                <button className="px-8 bg-red-500 hover:bg-red-600 md:h-9 h-8 rounded-md font-medium text-white" type="button" onClick={onCancel}>Cancel</button>
                <button className="px-8 bf-bg-color md:h-9 h-8 rounded-md font-medium text-white" type="button" onClick={updateGeneralData}>Save</button>
            </div>}

        </div>
    )
}

function HelpText() {
    return (
        <div className="grid grid-cols-1 gap-3">
            <p className="text-lg font-semibold">Need Help?</p>
            <p>
                If you have any questions or need assistance, please reach out to our support team at{' '}
                <a href="mailto:beefood.contact@gmail.com" className="bf-text-color hover:underline">
                    beefood.contact@gmail.com
                </a>
                .
            </p>
        </div>
      )
}