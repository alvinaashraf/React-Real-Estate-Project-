import React, { useState } from 'react'
import { navbarStyles as s } from '../../assets/dummyStyles.js'
import Logo from './Logo.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { Link } from 'react-router-dom'
import { HiMenuAlt4, HiX } from 'react-icons/hi'

const NavBar = () => {

    const [isOpen, setIsOpen] = useState(false)
    const { user, logout } = useAuth();

    // toggle manu on mobile 

    const toggleMenu = () => setIsOpen(prev => !prev)


    // navlinks 
    const navLinks = (
        <>
            {(!user || user.role !== "buyer") && (
                <Link to='/properties' className={s.navLink} onClick={() => setIsOpen(false)}>
                    Browse Properties
                </Link>
            )}


            {user && user.role === "buyer" && (
                <>
                    <Link to='/' className={s.navLink} onClick={() => setIsOpen(false)}>
                        Home
                    </Link>
                    <Link to='/properties' className={s.navLink} onClick={() => setIsOpen(false)}>
                        Property
                    </Link>


                    <Link to='/wishlist' className={s.navLink} onClick={() => setIsOpen(false)}>
                        WishList
                    </Link>

                    <Link to='/chat-messages' className={s.navLink} onClick={() => setIsOpen(false)}>
                        Messages
                    </Link>


                    <Link to='/contact' className={s.navLink} onClick={() => setIsOpen(false)}>
                        Contact Us
                    </Link>


                </>
            )}


            {/* if user not found  */}
            {!user && (
                <>


                    <Link to='/login' className={s.navLink} onClick={() => setIsOpen(false)}>
                        Login
                    </Link>

                    <Link to='/register' className={s.navLink} onClick={() => setIsOpen(false)}>
                        Register
                    </Link>




                </>
            )}


            {/* if user is seller  */}

            {user && user.role === "seller" && (
                <>

                    <Link to='/dashboard' className={s.navLink} onClick={() => setIsOpen(false)}>
                        Dashboard
                    </Link>



                </>
            )}

            {/* if user is admin */}

            {user && user.role === "admin" && (
                <>

                    <Link to='/admin-dashboard' className={s.navLink} onClick={() => setIsOpen(false)}>
                        Admin Panel
                    </Link>



                </>
            )}


        </>
    )

    return (


        <>
            <nav className={s.nav}>

                <div className={s.container}>
                    <div className={s.grid}>
                        <div className='justify=self-start'>
                            <Logo />
                        </div>

                        <div className={s.desktopMenu}>
                            {navLinks}
                        </div>


{/* right side  */}
<div className={s.rightSection}>
{user ? (

<div className={s.userSection} >
    <Link to='/profile' className="flex items-center" >
                     <img        src={
                        user.profilePic ||
                        `https://ui-avatars.com/api/?name=${user.name}&background=0d6e59&color=fff`
                      }
                      alt="Profile"
                      className={s.avatar} />
                    </Link>


                    <button onClick={logout} className={s.logoutButton} >
Logout
                    </button>
</div>
): null}


{/* mobile toggle  */}

<div className={s.mobileToggle} onClick={toggleMenu}>

{isOpen ? <HiX size={28} /> : <HiMenuAlt4 size={28} />}
</div>

</div>

                    </div>

                </div>
            </nav>



<div className={s.backdrop(isOpen)} onClick={() => setIsOpen(false)}></div>

<div className={s.drawer(isOpen)}>
<div className={s.drawerHeader}>
 <Logo onClick={() => setIsOpen(false)} />
    <HiX size={28} onClick={() => setIsOpen(false)} className={s.drawerCloseIcon} /> 
</div>

<div className={s.drawerNavLinks}>
{navLinks}
</div>

{user && (
    <div className={s.drawerUserSection}> 
    <div className={s.drawerUserInfo}> 
        <img    src={
                  user.profilePic ||
                  `https://ui-avatars.com/api/?name=${user.name}&background=0d6e59&color=fff`
                }
                alt="Profile"
                className={s.drawerAvatar} />


                <div>
                    <div className={s.drawerUserName}> {user.name}  </div>
                      <div className={s.drawerUserEmail}> {user.email}  </div>
                     </div>
    </div>


    <button onClick={logout} className={s.drawerLogoutButton}>
Logout
    </button>
    
    </div>
)}


</div>

        </>
    )
}


export default NavBar