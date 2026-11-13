export default {
  slug: 'transaction-manager',
  order: 3,
  title: 'Financial Ledger and Transaction Manager',
  short: 'Transaction Manager',
  term: 'prelim',
  date: '2026-08-28',
  kind: 'Activity',
  team: null,
  stack: ['React 18.3', 'Express 4.22', 'Mongoose 8.24', 'MongoDB', 'Tailwind CSS 3.4', 'Vite 5.4'],
  summary:
    'A full-stack personal finance tracker where users record income and expenses, filter them by keyword, type and date range, and see total income, total expense and net balance in pesos.',
  objective:
    'Build a MERN-style CRUD application from a written Product Requirements Document. The PRD fixed the data model, five REST endpoints with structured JSON errors, the React component hierarchy and a six-step acceptance test matrix (create, validation, search and filter, update, delete, empty query). The goal was to practice turning a specification into a working Express API, a Mongoose model and a React client that talk to each other through Axios.',
  built: [
    'Mongoose Transaction model with date, description (trimmed, max 200 characters), amount (minimum 0.01) and an income/expense enum, timestamps and a text index on description',
    'Express REST API under /api/transactions: POST, GET with search, type, startDate and endDate filters, GET /:id, PUT /:id with runValidators, and DELETE /:id',
    'Errors returned as { success: false, message } with 400 for bad input or invalid ObjectIds, 404 for missing records and 500 for server errors',
    'GET response that includes a summary (totalIncome, totalExpense, balance) computed from the same filtered query, so the cards always match the table',
    'React components TransactionForm (create and edit mode), SearchBar, TransactionList and TransactionItem, wired together in App.jsx with Axios calls in src/api/api.js',
    'Client-side checks before any request: description required, amount greater than 0, valid date; delete asks for confirmation first',
    'Amounts formatted as Philippine pesos with Intl.NumberFormat(\'en-PH\'), and a setup_project.js script that writes the backend and frontend files from one place',
  ],
  screenshots: [
    { src: '/work/transaction-manager/01-dashboard.webp', caption: 'Ledger with six sample transactions and the income, expense and net balance cards' },
    { src: '/work/transaction-manager/02-filter-expense.webp', caption: 'Filtering by type: only expenses are listed and the totals recalculate' },
    { src: '/work/transaction-manager/03-edit-mode.webp', caption: 'Edit mode: clicking Edit loads the grocery entry into the form' },
    { src: '/work/transaction-manager/04-validation.webp', caption: 'Client-side validation stops an entry with no description before it is sent' },
  ],
  code: [
    {
      title: 'Building the filter query',
      file: 'backend/controllers/transactionController.js',
      lang: 'javascript',
      code: `exports.getTransactions = async (req, res) => {
  try {
    const { search, type, startDate, endDate } = req.query;
    let query = {};

    if (search && search.trim() !== '') {
      query.description = { $regex: search.trim(), $options: 'i' };
    }

    if (type && type !== 'all' && ['income', 'expense'].includes(type.toLowerCase())) {
      query.type = type.toLowerCase();
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    const transactions = await Transaction.find(query).sort({ date: -1, createdAt: -1 });`,
    },
    {
      title: 'REST routes',
      file: 'backend/routes/transactionRoutes.js',
      lang: 'javascript',
      code: `const express = require('express');
const router = express.Router();
const {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction
} = require('../controllers/transactionController');

router.route('/')
  .post(createTransaction)
  .get(getTransactions);

router.route('/:id')
  .get(getTransactionById)
  .put(updateTransaction)
  .delete(deleteTransaction);

module.exports = router;`,
    },
    {
      title: 'Form validation before saving',
      file: 'frontend/src/components/TransactionForm.jsx',
      lang: 'jsx',
      code: `const handleSubmit = (e) => {
  e.preventDefault();

  if (!formData.description.trim()) {
    setValidationError('Description is required.');
    return;
  }

  const numAmount = parseFloat(formData.amount);
  if (isNaN(numAmount) || numAmount <= 0) {
    setValidationError('Amount must be a positive number greater than 0.');
    return;
  }

  if (!formData.date) {
    setValidationError('Please select a valid date.');
    return;
  }

  onSave({
    description: formData.description.trim(),
    amount: numAmount,
    type: formData.type,
    date: formData.date
  });

  if (!editingTransaction) {
    setFormData(initialFormState);
  }
};`,
    },
  ],
  reflection:
    'Working from a PRD changed how I built this project. The model fields, endpoints, status codes and test cases were written down first, and the work was split into phases with a check after each one, such as a curl POST and GET against the API before any React code existed. I also learned to validate in three layers: the form stops obvious mistakes without a network call, the controller returns clear 400 messages, and the Mongoose schema is the last line with its min, maxlength and enum rules. Computing the totals on the server from the same query as the list meant the summary cards never disagreed with the table after a filter.\n\nThe final app did drift from the PRD. The spec asked for plain CSS, a white minimalist palette and US dollars, while I used Tailwind, a beige ledger style and pesos, and the API ended up on port 5001 instead of 5000, so the Vite proxy had to match. If I did it again I would update the PRD when I change direction. I would also fix one mismatch: the model defines a text index on description, but the search uses a $regex query, so that index is never used. Either the search should use $text or the index should go.',
  docs: [],
}
