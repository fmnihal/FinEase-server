const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const verifyToken = require('../middleware/verifyToken');

router.use(verifyToken);
router.post('/add-transaction', async (req, res) => {
  try {
    const { type, category, amount, description, date } = req.body;
    const userEmail = req.user.email;
    const userName = req.user.name || null;
    const newTransaction = new Transaction({
      type,
      category,
      amount,
      description,
      date: new Date(date),
      email: userEmail,
      name: userName
    });
    const savedTransaction = await newTransaction.save();
    res.status(201).json(savedTransaction);
  } catch (error) {
    console.error('Error adding transaction:', error);
    res.status(400).json({ message: 'Error adding transaction', error: error.message });
  }
});
router.get('/my-transactions', async (req, res) => {
  try {
    const transactions = await Transaction.find({ email: req.user.email }).sort({ date: -1 });
    
    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Error fetching transactions', error: error.message });
  }
});
router.get('/transaction/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findOne({ _id: id, email: req.user.email });
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found or not authorized' });
    }
    res.status(200).json(transaction);
  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({ message: 'Error fetching transaction', error: error.message });
  }
});
router.patch('/transaction/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updatedTransaction = await Transaction.findOneAndUpdate(
      { _id: id, email: req.user.email },
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedTransaction) {
      return res.status(404).json({ message: 'Transaction not found or not authorized' });
    }
    res.status(200).json(updatedTransaction);
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(400).json({ message: 'Error updating transaction', error: error.message });
  }
});
router.delete('/transaction/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTransaction = await Transaction.findOneAndDelete({
      _id: id,
      email: req.user.email
    });

    if (!deletedTransaction) {
      return res.status(404).json({ message: 'Transaction not found or not authorized' });
    }

    res.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ message: 'Error deleting transaction', error: error.message });
  }
});

module.exports = router;