import { useState } from 'react';
import { PaymentMethod } from '@/types/booking';
import { paymentMethods } from '@/data/movies';
import { CreditCard, Wallet, Smartphone, Check, Lock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface PaymentFormProps {
  totalAmount: number;
  onPaymentComplete: (method: PaymentMethod) => void;
  onBack: () => void;
}

const PaymentForm = ({ totalAmount, onPaymentComplete, onBack }: PaymentFormProps) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('credit');
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
    upiId: '',
    walletNumber: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const getIcon = (type: string) => {
    switch (type) {
      case 'credit':
      case 'debit':
        return CreditCard;
      case 'wallet':
        return Wallet;
      case 'upi':
        return Smartphone;
      default:
        return CreditCard;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (selectedMethod === 'credit' || selectedMethod === 'debit') {
      if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, '').length !== 16) {
        newErrors.cardNumber = 'Enter a valid 16-digit card number';
      }
      if (!formData.cardName.trim()) {
        newErrors.cardName = 'Enter cardholder name';
      }
      if (!formData.expiry || !/^\d{2}\/\d{2}$/.test(formData.expiry)) {
        newErrors.expiry = 'Enter valid expiry (MM/YY)';
      }
      if (!formData.cvv || formData.cvv.length < 3) {
        newErrors.cvv = 'Enter valid CVV';
      }
    } else if (selectedMethod === 'upi') {
      if (!formData.upiId || !formData.upiId.includes('@')) {
        newErrors.upiId = 'Enter a valid UPI ID';
      }
    } else if (selectedMethod === 'wallet') {
      if (!formData.walletNumber || formData.walletNumber.length < 10) {
        newErrors.walletNumber = 'Enter a valid phone number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    const method = paymentMethods.find((m) => m.id === selectedMethod)!;
    onPaymentComplete(method);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : v;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Payment Method</h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Lock className="w-4 h-4" />
          <span>Secure Payment</span>
        </div>
      </div>

      {/* Payment Methods */}
      <RadioGroup
        value={selectedMethod}
        onValueChange={setSelectedMethod}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
      >
        {paymentMethods.map((method) => {
          const Icon = getIcon(method.type);
          return (
            <div key={method.id}>
              <RadioGroupItem value={method.id} id={method.id} className="peer sr-only" />
              <Label
                htmlFor={method.id}
                className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-border bg-secondary/30 cursor-pointer transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10"
              >
                <Icon className="w-6 h-6" />
                <span className="text-sm font-medium">{method.label}</span>
              </Label>
            </div>
          );
        })}
      </RadioGroup>

      {/* Form Fields */}
      <div className="p-6 rounded-xl bg-card border border-border space-y-4">
        {(selectedMethod === 'credit' || selectedMethod === 'debit') && (
          <>
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={formData.cardNumber}
                onChange={(e) =>
                  setFormData({ ...formData, cardNumber: formatCardNumber(e.target.value) })
                }
                maxLength={19}
                className={errors.cardNumber ? 'border-destructive' : ''}
              />
              {errors.cardNumber && (
                <p className="text-xs text-destructive">{errors.cardNumber}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardName">Cardholder Name</Label>
              <Input
                id="cardName"
                placeholder="John Doe"
                value={formData.cardName}
                onChange={(e) => setFormData({ ...formData, cardName: e.target.value })}
                className={errors.cardName ? 'border-destructive' : ''}
              />
              {errors.cardName && <p className="text-xs text-destructive">{errors.cardName}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input
                  id="expiry"
                  placeholder="MM/YY"
                  value={formData.expiry}
                  onChange={(e) =>
                    setFormData({ ...formData, expiry: formatExpiry(e.target.value) })
                  }
                  maxLength={5}
                  className={errors.expiry ? 'border-destructive' : ''}
                />
                {errors.expiry && <p className="text-xs text-destructive">{errors.expiry}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  type="password"
                  placeholder="•••"
                  value={formData.cvv}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      cvv: e.target.value.replace(/[^0-9]/g, '').slice(0, 4),
                    })
                  }
                  maxLength={4}
                  className={errors.cvv ? 'border-destructive' : ''}
                />
                {errors.cvv && <p className="text-xs text-destructive">{errors.cvv}</p>}
              </div>
            </div>
          </>
        )}

        {selectedMethod === 'upi' && (
          <div className="space-y-2">
            <Label htmlFor="upiId">UPI ID</Label>
            <Input
              id="upiId"
              placeholder="yourname@upi"
              value={formData.upiId}
              onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
              className={errors.upiId ? 'border-destructive' : ''}
            />
            {errors.upiId && <p className="text-xs text-destructive">{errors.upiId}</p>}
          </div>
        )}

        {selectedMethod === 'wallet' && (
          <div className="space-y-2">
            <Label htmlFor="walletNumber">Phone Number</Label>
            <Input
              id="walletNumber"
              placeholder="Enter your phone number"
              value={formData.walletNumber}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  walletNumber: e.target.value.replace(/[^0-9]/g, '').slice(0, 10),
                })
              }
              className={errors.walletNumber ? 'border-destructive' : ''}
            />
            {errors.walletNumber && (
              <p className="text-xs text-destructive">{errors.walletNumber}</p>
            )}
          </div>
        )}
      </div>

      {/* Amount Display */}
      <div className="flex items-center justify-between p-4 rounded-lg bg-primary/10 border border-primary/20">
        <span className="font-medium">Amount to Pay</span>
        <span className="text-2xl font-bold text-primary">${totalAmount.toFixed(2)}</span>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isProcessing}
          className="flex-1 cinema-glow"
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
              Processing...
            </>
          ) : (
            <>
              <Check className="w-4 h-4 mr-2" />
              Pay ${totalAmount.toFixed(2)}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default PaymentForm;
