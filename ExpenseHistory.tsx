import React, { useState, useEffect } from 'react';
import { 
  Card, CardHeader, CardTitle, CardContent
} from '@/components/ui/card';
import { 
  Input, InputLeftElement 
} from '@/components/ui/input';
import { 
  Tag, Search
} from 'lucide-react';

interface Expense {
  id: string;
  amount: number;
  description: string;
  date: string;
  category: string;
  type: 'food' | 'shopping' | 'transport' | 'personal' | 'clothes' | 'ott';
}

const ExpenseHistory: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: '1',
      amount: 562,
      description: 'McDonald\'s',
      date: 'Today, 11:17 PM',
      category: 'Food',
      type: 'food'
    },
    {
      id: '2',
      amount: 2586,
      description: 'Myntra',
      date: 'Yesterday, 5:31 PM',
      category: 'Clothes',
      type: 'shopping'
    },
    {
      id: '3',
      amount: 199,
      description: 'Netflix Subscription',
      date: 'November 30, 12:15 AM',
      category: 'OTT',
      type: 'ott'
    },
    {
      id: '4',
      amount: 169,
      description: 'Uber',
      date: 'Today, 9:30 AM',
      category: 'Transport',
      type: 'transport'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>(expenses);

  useEffect(() => {
    const filtered = expenses.filter(expense =>
      expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.date.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredExpenses(filtered);
  }, [searchQuery, expenses]);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Expense History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, category, or date"
            leftElement={<InputLeftElement><Search className="text-gray-400" size={20} /></InputLeftElement>}
            className="w-full"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredExpenses.map((expense) => (
            <div
              key={expense.id}
              className={`
                bg-white rounded-lg shadow-md p-4
                border-l-4 ${
                  expense.type === 'food' ? 'border-yellow-500' :
                  expense.type === 'shopping' ? 'border-blue-500' :
                  expense.type === 'transport' ? 'border-green-500' :
                  expense.type === 'personal' ? 'border-purple-500' :
                  expense.type === 'clothes' ? 'border-pink-500' :
                  'border-gray-500'
                }
              `}
            >
              <div className="text-gray-500 text-sm">{expense.date}</div>
              <div className="text-gray-700 font-medium text-lg">{expense.description}</div>
              <div className="text-right text-gray-700 font-medium text-lg">₹{expense.amount}</div>
              <div className="flex items-center text-gray-500 text-sm">
                <Tag size={16} className="mr-2" />
                {expense.category}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpenseHistory;
