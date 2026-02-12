const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const authMiddleware = require('../middleware/auth');

// Get all invoices
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM invoices WHERE user_id = $1 ORDER BY created_at DESC', [req.userId]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create invoice
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { client_id, invoice_number, issue_date, due_date, amount, status, notes, items } = req.body;
    
    // Create invoice
    const invoiceResult = await pool.query(
      'INSERT INTO invoices (user_id, client_id, invoice_number, issue_date, due_date, amount, status, notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [req.userId, client_id, invoice_number, issue_date, due_date, amount, status || 'draft', notes]
    );

    const invoiceId = invoiceResult.rows[0].id;

    // Add items if provided
    if (items && items.length > 0) {
      for (const item of items) {
        await pool.query(
          'INSERT INTO invoice_items (invoice_id, description, quantity, rate, amount) VALUES ($1, $2, $3, $4, $5)',
          [invoiceId, item.description, item.quantity, item.rate, item.amount]
        );
      }
    }

    res.status(201).json(invoiceResult.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single invoice with items
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const invoiceResult = await pool.query('SELECT * FROM invoices WHERE id = $1 AND user_id = $2', [req.params.id, req.userId]);
    if (invoiceResult.rows.length === 0) return res.status(404).json({ error: 'Invoice not found' });

    const itemsResult = await pool.query('SELECT * FROM invoice_items WHERE invoice_id = $1', [req.params.id]);

    res.json({ ...invoiceResult.rows[0], items: itemsResult.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update invoice
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { client_id, invoice_number, issue_date, due_date, amount, status, notes } = req.body;
    const result = await pool.query(
      'UPDATE invoices SET client_id = $1, invoice_number = $2, issue_date = $3, due_date = $4, amount = $5, status = $6, notes = $7 WHERE id = $8 AND user_id = $9 RETURNING *',
      [client_id, invoice_number, issue_date, due_date, amount, status, notes, req.params.id, req.userId]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Invoice not found' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete invoice
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await pool.query('DELETE FROM invoice_items WHERE invoice_id = $1', [req.params.id]);
    const result = await pool.query('DELETE FROM invoices WHERE id = $1 AND user_id = $2 RETURNING *', [req.params.id, req.userId]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Invoice not found' });
    res.json({ message: 'Invoice deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;