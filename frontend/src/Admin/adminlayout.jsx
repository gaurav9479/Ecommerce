import AdminNavbar from "./adminNav";
import { Outlet } from "react-router-dom";
const AdminLayout=()=>{
    return(
        <>
            <AdminNavbar/>
            <main >
                <Outlet/>
            </main>
        </>
    )
}
export default AdminLayout;