import React from "react";
import {NavLink} from "react-router-dom";

type NavbarOptionProps = {
    classActive?: string
    classInactive?: string
    ClassName?: string
}

export default function NavbarOptions
    ({classActive="text-white hover:text-green-200 transition-colors font-medium border-b-2 border-white pb-1"
    ,classInactive="text-green-100 hover:text-white transition-colors font-medium"
    ,ClassName="hidden md:flex space-x-8"}: NavbarOptionProps
    ) {
    return (
        <nav className={ClassName}>
            
            <NavLink
              to="/"
              className={({ isActive }) => isActive ? classActive : classInactive}
            > Home </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) => isActive ? classActive : classInactive}
            > Sobre </NavLink>
            <NavLink
              to="/stands"
              className={({ isActive }) => isActive ? classActive : classInactive}
            > Standes </NavLink>
            <NavLink
              to="/events"
              className={({ isActive }) => isActive ? classActive : classInactive}
            > Programações </NavLink>
            <NavLink
              to="/map"
              className={({ isActive }) => isActive ? classActive : classInactive}
            > Mapa do evento</NavLink>
        </nav>
    )}
