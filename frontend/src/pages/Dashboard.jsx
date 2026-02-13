import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { currentUser } = useContext(AuthContext);
    const [accounts, setAccounts] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const calculateDashboardData = async () => {
            try {
                // Fetch Accounts
                const accountsRes = await api.get('/accounts');
                setAccounts(accountsRes.data);

                // Fetch Transactions (Assuming first page for recent)
                const transactionsRes = await api.get('/transactions?page=0');
                setTransactions(transactionsRes.data.slice(0, 5)); // Take only first 5
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (currentUser) {
            calculateDashboardData();
        }
    }, [currentUser]);

    if (loading) {
        return <div className="text-center mt-10">Loading dashboard...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">
                    Hello, {currentUser?.firstName || 'User'}!
                </h2>
                <div className="text-sm text-gray-500">
                    {new Date().toLocaleDateString()}
                </div>
            </div>

            {/* Account Balances */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {accounts.length > 0 ? (
                    accounts.map((account) => (
                        <div key={account.accountId} className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white p-6 rounded-lg shadow-lg">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-sm font-semibold opacity-90">{account.label || account.accountName}</h3>
                                <span className="bg-white/20 px-2 py-1 rounded text-xs backdrop-blur-sm">{account.code}</span>
                            </div>
                            <p className="text-3xl font-bold mb-1">{account.symbol}{account.balance?.toFixed(2)}</p>
                            <p className="text-xs opacity-75">Account #{account.accountNumber}</p>
                        </div>
                    ))
                ) : (
                    <div className="bg-gray-100 p-6 rounded-lg shadow text-center col-span-full">
                        <p className="text-gray-600">No accounts found.</p>
                        <Link to="/accounts" className="text-indigo-600 hover:text-indigo-800 font-medium mt-2 inline-block">
                            Create your first account
                        </Link>
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link to="/accounts" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 py-3 rounded-lg text-center font-medium transition">
                        Transfer Money
                    </Link>
                    <Link to="/cards" className="bg-green-50 text-green-700 hover:bg-green-100 py-3 rounded-lg text-center font-medium transition">
                        Manage Cards
                    </Link>
                    <Link to="/accounts" className="bg-purple-50 text-purple-700 hover:bg-purple-100 py-3 rounded-lg text-center font-medium transition">
                        New Account
                    </Link>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800">Recent Transactions</h3>
                    <Link to="/transactions" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">View All</Link>
                </div>
                <div className="divide-y divide-gray-100">
                    {transactions.length > 0 ? (
                        transactions.map((tx) => (
                            <div key={tx.txId} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                                <div className="flex items-center">
                                    <div className={`p-2 rounded-full ${tx.type === 'DEPOSIT' || tx.type === 'CREDIT' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'} mr-4`}>
                                        {/* Icon based on type */}
                                        <div className="w-4 h-4 rounded-full bg-current"></div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">{tx.description || 'Transaction'}</p>
                                        <p className="text-xs text-gray-500">{new Date(tx.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <span className={`font-semibold ${tx.type === 'DEPOSIT' || tx.type === 'CREDIT' ? 'text-green-600' : 'text-gray-800'}`}>
                                    {tx.type === 'DEPOSIT' || tx.type === 'CREDIT' ? '+' : '-'}${tx.amount.toFixed(2)}
                                </span>
                            </div>
                        ))
                    ) : (
                        <div className="px-6 py-8 text-center text-gray-500">
                            No transactions found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
