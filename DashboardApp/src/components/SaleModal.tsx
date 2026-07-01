import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

interface SaleItem {
  medicineName: string;
  category: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
}

interface Sale {
  id: string;
  productName: string;
  category: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  date: string;
  paymentMethod: string;
}

interface SaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (saleData: {
    saleDate: string;
    items: SaleItem[];
    paymentMethod: string;
    totalAmount: number;
  }) => void;
  saleToEdit?: Sale | null;
}

export const SaleModal: React.FC<SaleModalProps> = ({
  isOpen,
  onClose,
  onSave,
  saleToEdit
}) => {
  const { t } = useLanguage();

  const [medicineName, setMedicineName] = useState('');
  const [category, setCategory] = useState('Antibiotics');
  const [quantity, setQuantity] = useState<number | ''>(1);
  const [totalPrice, setTotalPrice] = useState<number | ''>('');
  const [saleDate, setSaleDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState('cash');

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      if (saleToEdit) {
        setMedicineName(saleToEdit.productName || '');
        setCategory(saleToEdit.category || 'Antibiotics');
        setQuantity(saleToEdit.quantity || 1);
        setTotalPrice(saleToEdit.totalAmount || (saleToEdit.unitPrice * saleToEdit.quantity) || '');
        setSaleDate(saleToEdit.date || new Date().toISOString().split('T')[0]);
        setPaymentMethod(saleToEdit.paymentMethod || 'cash');
      } else {
        setMedicineName('');
        setCategory('Antibiotics');
        setQuantity(1);
        setTotalPrice('');
        setSaleDate(new Date().toISOString().split('T')[0]);
        setPaymentMethod('cash');
      }
      setErrors({});
    }
  }, [isOpen, saleToEdit]);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!medicineName.trim()) {
      newErrors.medicineName = t('validationRequired') || 'Required';
    }
    if (!quantity || Number(quantity) <= 0) {
      newErrors.quantity = t('validationPositiveNumber') || 'Must be > 0';
    }
    if (!totalPrice || Number(totalPrice) < 0) {
      newErrors.totalPrice = t('validationPositiveNumber') || 'Must be >= 0';
    }
    if (!saleDate) {
      newErrors.saleDate = t('validationRequired') || 'Required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const qty = Number(quantity);
    const totalAmt = Number(totalPrice);

    onSave({
      saleDate,
      items: [{
        medicineName,
        category,
        quantity: qty,
        unitPrice: totalAmt / qty,
        totalAmount: totalAmt
      }],
      paymentMethod,
      totalAmount: totalAmt
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '600px' }}>
        <div className="modal-header">
          <h2 className="modal-title">
            {saleToEdit ? (t('modalEditTitle') || 'Edit Sale') : (t('modalAddTitle') || 'Add Sale')}
          </h2>
          <button className="modal-close" type="button" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Sale Date & Payment Method Row */}
            <div className="form-row">
              <div className="form-group flex-1">
                <label className="form-label">{(t as any)('fieldSaleDate') || 'Sale Date'}</label>
                <input
                  type="date"
                  className="form-input"
                  value={saleDate}
                  onChange={(e) => setSaleDate(e.target.value)}
                />
                {errors.saleDate && <span className="field-error">{errors.saleDate}</span>}
              </div>

              <div className="form-group flex-1">
                <label className="form-label">{(t as any)('fieldPaymentMethod') || 'Payment Method'}</label>
                <select
                  className="form-select"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="upi">UPI</option>
                </select>
              </div>
            </div>

            {/* Medicine Name */}
            <div className="form-group">
              <label className="form-label">{t('fieldProductName') || 'Medicine Name'}</label>
              <input
                type="text"
                className="form-input"
                value={medicineName}
                onChange={(e) => setMedicineName(e.target.value)}
                placeholder="e.g. Paracetamol 650mg"
              />
              {errors.medicineName && <span className="field-error">{errors.medicineName}</span>}
            </div>

            {/* Category */}
            <div className="form-group">
              <label className="form-label">{t('fieldCategory') || 'Category'}</label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Antibiotics">Antibiotics</option>
                <option value="Painkillers">Painkillers</option>
                <option value="Vitamins">Vitamins</option>
                <option value="Medical Devices">Medical Devices</option>
                <option value="Other OTC">Other OTC</option>
              </select>
            </div>

            {/* Quantity and Total Price */}
            <div className="form-row">
              <div className="form-group flex-1">
                <label className="form-label">{t('fieldQuantity') || 'Quantity'}</label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  className="form-input"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="1"
                />
                {errors.quantity && <span className="field-error">{errors.quantity}</span>}
              </div>

              <div className="form-group flex-1">
                <label className="form-label">{(t as any)('fieldTotalPrice') || 'Total Price (₹)'}</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="form-input"
                  value={totalPrice}
                  onChange={(e) => setTotalPrice(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="e.g. 150"
                />
                {errors.totalPrice && <span className="field-error">{errors.totalPrice}</span>}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              {t('btnCancel') || 'Cancel'}
            </button>
            <button type="submit" className="btn btn-primary">
              {t('btnSave') || 'Save'}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .form-row {
          display: flex;
          gap: 16px;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .flex-1 {
          flex: 1;
        }

        .field-error {
          font-size: 11px;
          color: var(--danger);
          font-weight: 600;
          margin-top: 4px;
          display: block;
        }

        .modal-content {
          max-width: 600px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
        }

        .form-group {
          margin-bottom: 16px;
        }
        
        .form-row .form-group {
          margin-bottom: 0;
        }
      `}</style>
    </div>
  );
};
