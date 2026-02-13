import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, Menu, X } from 'lucide-react';
import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const { currentUser, logout } = useContext(AuthContext);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <span className="text-2xl font-bold text-indigo-600">BankApp</span>
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                        {currentUser ? (
                            <>
                                <Link to="/dashboard" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">Dashboard</Link>
                                <Link to="/accounts" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">Accounts</Link>
                                <Link to="/cards" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">Cards</Link>
                                <Link to="/transactions" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">Transactions</Link>
                                <button onClick={handleLogout} className="flex items-center text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium">
                                    <LogOut className="h-4 w-4 mr-2" />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">Login</Link>
                                <Link to="/register" className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium">Register</Link>
                            </>
                        )}
                    </div>

                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 hover:text-indigo-600 focus:outline-none">
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {currentUser ? (
                            <>
                                <Link to="/dashboard" className="block text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-base font-medium">Dashboard</Link>
                                <Link to="/accounts" className="block text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-base font-medium">Accounts</Link>
                                <Link to="/cards" className="block text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-base font-medium">Cards</Link>
                                <Link to="/transactions" className="block text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-base font-medium">Transactions</Link>
                                <button onClick={handleLogout} className="w-full text-left block text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-base font-medium">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="block text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-base font-medium">Login</Link>
                                <Link to="/register" className="block w-full text-left bg-indigo-600 text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-base font-medium">Register</Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
