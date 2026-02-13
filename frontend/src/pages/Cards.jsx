import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { CreditCard, Plus, DollarSign } from 'lucide-react';

const Cards = () => {
    const { currentUser } = useContext(AuthContext);
    const [card, setCard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionAmount, setActionAmount] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });

    const fetchCard = async () => {
        try {
            const res = await api.get('/card');
            setCard(res.data);
        } catch (error) {
            // 404 means no card, which is valid state for us
            console.log("No card found or error fetching card");
            setCard(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentUser) {
            fetchCard();
        }
    }, [currentUser]);

    const handleCreateCard = async () => {
        try {
            // Initial amount for card creation
            await api.post('/card/create?amount=0');
            setMessage({ text: 'Card issued successfully!', type: 'success' });
            fetchCard();
        } catch (error) {
            setMessage({ text: 'Failed to issue card.', type: 'error' });
        }
    };

    const handleCardAction = async (type) => {
        if (!actionAmount || isNaN(actionAmount)) {
            setMessage({ text: 'Please enter a valid amount.', type: 'error' });
            return;
        }

        try {
            const endpoint = type === 'credit' ? '/card/credit' : '/card/debit';
            await api.post(`${endpoint}?amount=${actionAmount}`);
            setMessage({ text: `Card ${type}ed successfully!`, type: 'success' });
            setActionAmount('');
            fetchCard();
        } catch (error) {
            setMessage({ text: error.response?.data?.message || `Failed to ${type} card.`, type: 'error' });
        }
    };

    if (loading) return <div className="text-center mt-10">Loading card...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-2xl font-bold text-gray-800">My Cards</h2>

            {message.text && (
                <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            {!card ? (
                <div className="bg-white p-10 rounded-lg shadow-md text-center">
                    <CreditCard className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No Card Found</h3>
                    <p className="text-gray-500 mb-6">You don't have a virtual card yet. Issue one today!</p>
                    <button
                        onClick={handleCreateCard}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium inline-flex items-center"
                    >
                        <Plus className="w-5 h-5 mr-2" /> Issue Virtual Card
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Card Visual */}
                    <div className="bg-gradient-to-br from-gray-800 to-black rounded-2xl p-6 text-white shadow-xl aspect-video relative flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <span className="font-bold text-lg tracking-wider">BankApp</span>
                            <span className="italic font-bold text-xl">VISA</span>
                        </div>
                        <div className="text-2xl font-mono tracking-widest mt-8">
                            {card.cardNumber?.toString().replace(/\d{4}(?=.)/g, '$& ')}
                        </div>
                        <div className="flex justify-between items-end mt-8">
                            <div>
                                <p className="text-xs text-gray-400 uppercase">Card Holder</p>
                                <p className="font-medium tracking-wide">{card.cardHolder}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase">Expires</p>
                                <p className="font-medium">{card.expiration ? new Date(card.expiration).toLocaleDateString(undefined, { month: '2-digit', year: '2-digit' }) : '**/**'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Card Actions */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-bold mb-4">Card Balance: ${card.balance?.toFixed(2)}</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                                <div className="relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <DollarSign className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="number"
                                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                                        placeholder="0.00"
                                        value={actionAmount}
                                        onChange={(e) => setActionAmount(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="flex space-x-4">
                                <button
                                    onClick={() => handleCardAction('credit')}
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md font-medium"
                                >
                                    Top Up
                                </button>
                                <button
                                    onClick={() => handleCardAction('debit')}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md font-medium"
                                >
                                    Withdraw
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-2 bg-white rounded-lg shadow overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-800">Card Details</h3>
                        </div>
                        <div className="p-6 grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">CVV</p>
                                <p className="font-mono font-medium">{card.cvv}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">PIN</p>
                                <p className="font-mono font-medium">{card.pin}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Status</p>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Active
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cards;
