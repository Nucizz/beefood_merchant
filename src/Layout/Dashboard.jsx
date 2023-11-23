import { getAuth } from 'firebase/auth';
import { app } from '../firebase-config.js';

export default function DashboardLayout() {
    return (
        <div className="w-full">
            <h1 className="mb-4 text-3xl font-bold leading-none tracking-tight text-gray-900 md:text-4xl lg:text-4xl">Dashboard</h1>
            
            <div className="w-full flex flex-row gap-4">

                <ProfileContainer />

                <div className="rounded-lg basis-2/5 bg-gray-200 py-3 px-4">
                    
                </div>

            </div>

        </div>
    );
}

function ProfileContainer() {
    const currentUserAuth = getAuth(app).currentUser

    return(
        <div className="rounded-lg basis-3/5 bg-gray-200 py-3 px-4">
            
            <div>
                {currentUserAuth.displayName} <br></br>
                {currentUserAuth.email}
            </div>

        </div>
    );
}