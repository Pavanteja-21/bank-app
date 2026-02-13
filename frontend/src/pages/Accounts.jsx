import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Plus, ArrowRight, RefreshCw } from 'lucide-react';

const Accounts = () => {
    const { currentUser } = useContext(AuthContext);
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showTransferModal, setShowTransferModal] = useState(false);
    const [showConvertModal, setShowConvertModal] = useState(false);
    const [newAccount, setNewAccount] = useState({ code: '', label: '', symbol: '' });
    const [transferData, setTransferData] = useState({ code: '', recipientAccountNumber: '', amount: '' });
    const [convertData, setConvertData] = useState({ fromCurrency: '', toCurrency: '', amount: '' });
    const [message, setMessage] = useState(null);

    const CURRENCY_SYMBOLS = {
        'USD': '$',
        'EUR': '€',
        'GBP': '£',
        'JPY': '¥',
        'NGN': '₦',
        'INR': '₹'
    };

    const fetchAccounts = async () => {
        setLoading(true);
        try {
            const res = await api.get('/accounts');
            setAccounts(res.data);
            if (res.data.length === 0) {
                // Optional: Set a message or just let the empty state handle it
                setMessage({ text: 'No accounts found. Create one to get started!', type: 'info' });
            } else {
                setMessage(null); // Clear message if accounts are loaded
            }
        } catch (error) {
            console.error("Error fetching accounts", error);
            setMessage({ text: 'Failed to load accounts. Please try again.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentUser) {
            fetchAccounts();
        }
    }, [currentUser]);

    const handleCreateAccount = async (e) => {
        e.preventDefault();
        try {
            const accountData = {
                code: newAccount.code,
                label: newAccount.label,
                symbol: CURRENCY_SYMBOLS[newAccount.code] || '$'
            };
            await api.post('/accounts', accountData);
            setMessage({ text: 'Account created successfully!', type: 'success' });
            setShowCreateModal(false);
            setNewAccount({ code: '', label: '', symbol: '' });
            fetchAccounts();
        } catch (error) {
            setMessage({ text: error.response?.data?.message || 'Failed to create account', type: 'error' });
        }
    };

    const handleTransfer = async (e) => {
        e.preventDefault();
        try {
            await api.post('/accounts/transfer', transferData);
            setMessage({ text: 'Transfer successful!', type: 'success' });
            setShowTransferModal(false);
            setTransferData({ code: '', recipientAccountNumber: '', amount: '' });
            fetchAccounts();
        } catch (error) {
            setMessage({ text: error.response?.data?.message || 'Transfer failed', type: 'error' });
        }
    };

    const handleConvert = async (e) => {
        e.preventDefault();
        try {
            await api.post('/accounts/convert', convertData);
            setMessage({ text: 'Conversion successful!', type: 'success' });
            setShowConvertModal(false);
            setConvertData({ fromCurrency: '', toCurrency: '', amount: '' });
            fetchAccounts();
        } catch (error) {
            setMessage({ text: 'Conversion failed. Check details.', type: 'error' });
        }
    };

    if (loading) return <div className="text-center mt-10">Loading accounts...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow">
                <h2 className="text-2xl font-bold text-gray-800">My Accounts</h2>
                <div className="space-x-2">
                    <button
                        onClick={() => setShowConvertModal(true)}
                        className="flex items-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" /> Convert Currency
                    </button>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
                    >
                        <Plus className="w-4 h-4 mr-2" /> Create Account
                    </button>
                </div>
            </div>

            {message && (
                <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : message.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {accounts.length === 0 ? (
                    <div className="col-span-full text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        <p className="text-gray-500 mb-2">No accounts found.</p>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                            Create your first account
                        </button>
                    </div>
                ) : (
                    accounts.map((acc) => (
                        <div key={acc.accountId} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100">
                            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 text-white">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-lg">{acc.accountName || acc.label}</h3>
                                        <p className="text-indigo-100 text-sm font-mono tracking-wider">{acc.accountNumber}</p>
                                    </div>
                                    <span className="bg-white/20 px-2 py-1 rounded text-xs backdrop-blur-sm">{acc.code}</span>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flex justify-between items-end mb-4">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Available Balance</p>
                                        <p className="text-3xl font-bold text-gray-900">{acc.symbol}{acc.balance?.toFixed(2)}</p>
                                    </div>
                                </div>
                                <div className="flex space-x-2 pt-4 border-t border-gray-100">
                                    <button
                                        onClick={() => {
                                            setTransferData({ ...transferData, code: acc.code });
                                            setShowTransferModal(true);
                                        }}
                                        className="flex-1 flex items-center justify-center bg-indigo-50 text-indigo-700 py-2 rounded-md hover:bg-indigo-100 transition text-sm font-medium"
                                    >
                                        <ArrowRight className="w-4 h-4 mr-1" /> Transfer
                                    </button>
                                </div>
                            </div>
                        </div>
                    )))}
            </div>

            {/* Create Account Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-8 max-w-md w-full">
                        <h3 className="text-xl font-bold mb-4">Create New Account</h3>
                        <form onSubmit={handleCreateAccount} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Currency Code</label>
                                <select
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    value={newAccount.code}
                                    onChange={(e) => setNewAccount({ ...newAccount, code: e.target.value })}
                                    required
                                >
                                    <option value="">Select Currency</option>
                                    <option value="USD">USD - United States Dollar</option>
                                    <option value="EUR">EUR - Euro</option>
                                    <option value="GBP">GBP - British Pound</option>
                                    <option value="JPY">JPY - Japanese Yen</option>
                                    <option value="NGN">NGN - Nigerian Naira</option>
                                    <option value="INR">INR - Indian Rupee</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Account Label (Optional)</label>
                                <input
                                    type="text"
                                    placeholder="e.g., My Savings Account"
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    value={newAccount.label}
                                    onChange={(e) => setNewAccount({ ...newAccount, label: e.target.value })}
                                />
                            </div>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <p className="text-sm text-blue-800">
                                    <strong>Note:</strong> Initial balance will be set to $1,000.00
                                </p>
                            </div>
                            <div className="flex justify-end space-x-2 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
                                >
                                    Create Account
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Transfer Modal */}
            {showTransferModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-8 max-w-md w-full">
                        <h3 className="text-xl font-bold mb-4">Transfer Funds</h3>
                        <form onSubmit={handleTransfer} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">From Account</label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded-lg p-2 bg-gray-50"
                                    value={transferData.code}
                                    readOnly
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">To Account Number</label>
                                <input
                                    type="text"
                                    placeholder="Enter recipient account number"
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    value={transferData.recipientAccountNumber}
                                    onChange={(e) => setTransferData({ ...transferData, recipientAccountNumber: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    value={transferData.amount}
                                    onChange={(e) => setTransferData({ ...transferData, amount: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="flex justify-end space-x-2 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowTransferModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
                                >
                                    Transfer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Convert Modal */}
            {showConvertModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-8 max-w-md w-full">
                        <h3 className="text-xl font-bold mb-4">Convert Currency</h3>
                        <form onSubmit={handleConvert} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">From</label>
                                    <input
                                        type="text"
                                        placeholder="USD"
                                        className="w-full border rounded p-2"
                                        value={convertData.fromCurrency}
                                        onChange={(e) => setConvertData({ ...convertData, fromCurrency: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">To</label>
                                    <input
                                        type="text"
                                        placeholder="EUR"
                                        className="w-full border rounded p-2"
                                        value={convertData.toCurrency}
                                        onChange={(e) => setConvertData({ ...convertData, toCurrency: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Amount</label>
                                <input
                                    type="number"
                                    placeholder="Amount"
                                    className="w-full border rounded p-2"
                                    value={convertData.amount}
                                    onChange={(e) => setConvertData({ ...convertData, amount: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button type="button" onClick={() => setShowConvertModal(false)} className="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
                                <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">Convert</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Accounts;
