
import {NavLink} from "react-router-dom";

type NavbarOptionProps = {
    classActive?: string
    classInactive?: string
    ClassName?: string
}

export default function NavbarOptions
    ({classActive = "text-white hover:text-green-200 hover:border-b-2 hover:border-white transition-all font-medium pb-1",
  classInactive = "text-green-100 hover:text-white hover:border-b-2 hover:border-white transition-all font-medium pb-1",
  ClassName = "hidden md:flex space-x-8"}: NavbarOptionProps
    ) {
    return (
        <nav className={ClassName}>
            
            <NavLink
              to="/"
              className={({ isActive }) => isActive ? classActive : classInactive}
            > Home </NavLink>
            <NavLink
              to="/#sobre"
              className={({ isActive }) => isActive ? classActive : classInactive}
            > Sobre </NavLink>
            <NavLink
              to="/stands"
              className={({ isActive }) => isActive ? classActive : classInactive}
            > Programação </NavLink>
            <NavLink
              to="/mapa"
              className={({ isActive }) => isActive ? classActive : classInactive}
            > Mapa do evento</NavLink>
        </nav>
    )}
