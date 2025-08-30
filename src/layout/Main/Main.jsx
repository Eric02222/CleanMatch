import { Outlet } from "react-router"
import { Header } from "../Header/Header.jsx"

function Main() {
  return (
    <div>
        <Header/>
        <main>
            <Outlet />
        </main>
    </div>
  )
}

export default Main