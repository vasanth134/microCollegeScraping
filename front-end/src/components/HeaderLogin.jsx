import Logo from '../assets/images/Microcollege-Logo-New1.webp';
import Login from '../assets/images/login.png';

export default function HeaderLogin() {
  return (
    <header className='bg-white shadow-sm flex justify-between items-center px-10 py-3'>
        <img src={Logo} className='h-16' alt="Logo" />
        <a href="#"><div className='rounded-full px-2 flex items-center justify-center ring-1 ring-blue-800 h-14 hover:ring-2 transition-all'><img src={Login} className='h-9'/><p className='text-2xl px-2'>Login</p></div></a>
    </header>
  )
}