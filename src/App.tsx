import React, { useState, useRef } from 'react';
import { CashFlowMinimizer } from './lib/CashFlowMinimizer';
import { ArrowRight, UserPlus, DollarSign, RotateCcw, Github, Linkedin } from 'lucide-react';

function App() {
  const [minimizer] = useState(() => new CashFlowMinimizer());
  const [people, setPeople] = useState<{ id: number; name: string; balance: number }[]>([]);
  const [transactions, setTransactions] = useState<{ from: number; to: number; amount: number }[]>([]);
  const [newPerson, setNewPerson] = useState('');
  const [amount, setAmount] = useState('');
  const [payer, setPayer] = useState('');
  const [selectedRecipients, setSelectedRecipients] = useState<Set<number>>(new Set());
  const timeoutRef = useRef<number>();

  const formatINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleAddPerson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPerson.trim()) return;
    
    minimizer.addPerson(newPerson.trim());
    setPeople(minimizer.getPeople());
    setNewPerson('');
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !payer || selectedRecipients.size === 0) return;

    const payerId = parseInt(payer);
    minimizer.addExpense(payerId, parseFloat(amount), Array.from(selectedRecipients));
    setPeople(minimizer.getPeople());
    setAmount('');
    setPayer('');
    setSelectedRecipients(new Set());
  };

  const handleMinimize = () => {
    const newTransactions = minimizer.minimizeCashFlow();
    setTransactions(newTransactions);

    // Animate transactions
    newTransactions.forEach((transaction, index) => {
      setTimeout(() => {
        const element = document.getElementById(`transaction-${index}`);
        if (element) {
          element.classList.add('animate-slide-in');
        }
      }, index * 200);
    });
  };

  const handleReset = () => {
    minimizer.reset();
    setPeople([]);
    setTransactions([]);
    setNewPerson('');
    setAmount('');
    setPayer('');
    setSelectedRecipients(new Set());
  };

  const toggleRecipient = (id: number) => {
    const newSet = new Set(selectedRecipients);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedRecipients(newSet);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">SplitEx - Expense Manager</h1>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/Ujwal-Gaonkar"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white transition-colors"
            >
              <Github className="w-6 h-6" />
            </a>
            <a
              href="https://www.linkedin.com/in/ujwal-gaonkar-6746aa1a7/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white transition-colors"
            >
              <Linkedin className="w-6 h-6" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Add Person Form */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-purple-400" />
              Add Person
            </h2>
            <form onSubmit={handleAddPerson} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={newPerson}
                  onChange={(e) => setNewPerson(e.target.value)}
                  className="w-full bg-gray-700 rounded px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="Enter name"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded transition-colors"
              >
                Add Person
              </button>
            </form>
          </div>

          {/* Add Expense Form */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-purple-400" />
              Add Expense
            </h2>
            <form onSubmit={handleAddExpense} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-gray-700 rounded px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                    placeholder="Amount in ₹"
                    step="1"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Paid By</label>
                  <select
                    value={payer}
                    onChange={(e) => setPayer(e.target.value)}
                    className="w-full bg-gray-700 rounded px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                  >
                    <option value="">Select person</option>
                    {people.map(person => (
                      <option key={person.id} value={person.id}>{person.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Split Between</label>
                <div className="flex flex-wrap gap-2">
                  {people.map(person => (
                    <button
                      key={person.id}
                      type="button"
                      onClick={() => toggleRecipient(person.id)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        selectedRecipients.has(person.id)
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-700 text-gray-300'
                      }`}
                    >
                      {person.name}
                    </button>
                  ))}
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded transition-colors"
              >
                Add Expense
              </button>
            </form>
          </div>
        </div>

        {/* People List */}
        {people.length > 0 && (
          <div className="bg-gray-800 rounded-lg p-6 shadow-xl mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Current Balances</h2>
              <div className="flex gap-4">
                <button
                  onClick={handleMinimize}
                  className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded transition-colors"
                >
                  Minimize Cash Flow
                </button>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {people.map(person => (
                <div
                  key={person.id}
                  className={`p-4 rounded-lg ${
                    person.balance > 0
                      ? 'bg-green-900/50'
                      : person.balance < 0
                      ? 'bg-red-900/50'
                      : 'bg-gray-700'
                  }`}
                >
                  <div className="text-lg font-semibold">{person.name}</div>
                  <div className={`text-xl font-bold ${
                    person.balance > 0
                      ? 'text-green-400'
                      : person.balance < 0
                      ? 'text-red-400'
                      : 'text-gray-400'
                  }`}>
                    {formatINR(person.balance)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Optimized Transactions */}
        {transactions.length > 0 && (
          <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
            <h2 className="text-xl font-semibold mb-4">Optimized Transactions</h2>
            <div className="space-y-4">
              {transactions.map((transaction, index) => (
                <div
                  key={index}
                  id={`transaction-${index}`}
                  className="flex items-center gap-4 p-4 bg-gray-700 rounded-lg opacity-0 transform translate-y-4"
                  style={{
                    animation: `slide-in 0.5s ease-out ${index * 0.2}s forwards`
                  }}
                >
                  <div className="font-semibold text-lg">
                    {people[transaction.from].name}
                  </div>
                  <ArrowRight className="w-5 h-5 text-purple-400 flex-shrink-0" />
                  <div className="font-semibold text-lg">
                    {people[transaction.to].name}
                  </div>
                  <div className="ml-auto font-bold text-green-400">
                    {formatINR(transaction.amount)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Developer Credit */}
        <div className="mt-8 text-center text-gray-400">
          <p>Developed by Ujwal Gaonkar</p>
          <p className="text-sm">Using Graph Theory and Dynamic Programming</p>
        </div>
      </div>
    </div>
  );
}

export default App;