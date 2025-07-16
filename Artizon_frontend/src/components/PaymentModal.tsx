
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { CreditCard, Smartphone, ArrowLeft } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentMethod: string;
  total: number;
}

export const PaymentModal = ({ isOpen, onClose, paymentMethod, total }: PaymentModalProps) => {
  const [step, setStep] = useState<'info' | 'confirm' | 'success' | 'error'>('info');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');

  const handlePaymentSubmit = async () => {
    // Simulate payment processing
    setStep('confirm');
    
    // Simulate API call
    setTimeout(() => {
      // Randomly succeed or fail for demo purposes
      const success = Math.random() > 0.3;
      setStep(success ? 'success' : 'error');
    }, 2000);
  };

  const handleClose = () => {
    setStep('info');
    setPhoneNumber('');
    setConfirmationCode('');
    setCardNumber('');
    setExpiryDate('');
    setCvv('');
    setCardName('');
    onClose();
  };

  const renderMobileMoneyForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="phone">Numéro de téléphone</Label>
        <Input
          id="phone"
          placeholder="ex: +237 6XX XXX XXX"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Instructions:</strong>
        </p>
        <ol className="text-sm text-blue-700 mt-2 space-y-1">
          <li>1. Composez *126# sur votre téléphone</li>
          <li>2. Suivez les instructions pour effectuer le paiement</li>
          <li>3. Entrez le code de confirmation reçu ci-dessous</li>
        </ol>
      </div>

      <div>
        <Label htmlFor="confirmCode">Code de confirmation</Label>
        <Input
          id="confirmCode"
          placeholder="Code reçu par SMS"
          value={confirmationCode}
          onChange={(e) => setConfirmationCode(e.target.value)}
        />
      </div>
    </div>
  );

  const renderCardForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="cardName">Nom sur la carte</Label>
        <Input
          id="cardName"
          placeholder="JEAN DUPONT"
          value={cardName}
          onChange={(e) => setCardName(e.target.value)}
        />
      </div>
      
      <div>
        <Label htmlFor="cardNumber">Numéro de carte</Label>
        <Input
          id="cardNumber"
          placeholder="1234 5678 9012 3456"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="expiry">Date d'expiration</Label>
          <Input
            id="expiry"
            placeholder="MM/AA"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="cvv">CVV</Label>
          <Input
            id="cvv"
            placeholder="123"
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <CreditCard className="h-4 w-4" />
        <span>Vos informations sont sécurisées et cryptées</span>
      </div>
    </div>
  );

  const getPaymentIcon = () => {
    switch (paymentMethod) {
      case 'Orange Money':
        return <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center"><span className="text-white text-xs">🍊</span></div>;
      case 'Mobile Money':
        return <Smartphone className="w-6 h-6" />;
      case 'Carte Bancaire':
        return <CreditCard className="w-6 h-6" />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {getPaymentIcon()}
            Paiement - {paymentMethod}
          </DialogTitle>
        </DialogHeader>

        {step === 'info' && (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total à payer:</span>
                  <span className="text-xl font-bold text-[#405B35]">
                    {total.toLocaleString()} FCFA
                  </span>
                </div>
              </CardContent>
            </Card>

            {(paymentMethod === 'Orange Money' || paymentMethod === 'Mobile Money') && renderMobileMoneyForm()}
            {paymentMethod === 'Carte Bancaire' && renderCardForm()}

            <div className="flex gap-3">
              <Button variant="outline" onClick={handleClose} className="flex-1">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
              <Button 
                onClick={handlePaymentSubmit} 
                className="flex-1 bg-[#405B35] hover:bg-[#405B35]/90"
                disabled={!phoneNumber && !cardNumber}
              >
                Confirmer le paiement
              </Button>
            </div>
          </div>
        )}

        {step === 'confirm' && (
          <div className="text-center space-y-4">
            <div className="animate-spin w-8 h-8 border-4 border-[#405B35] border-t-transparent rounded-full mx-auto"></div>
            <p className="text-lg font-medium">Traitement du paiement...</p>
            <p className="text-gray-600">Veuillez patienter, ne fermez pas cette fenêtre.</p>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl">✓</span>
            </div>
            <h3 className="text-xl font-bold text-green-600">Paiement réussi !</h3>
            <p className="text-gray-600">
              Votre commande a été confirmée. Vous recevrez un email de confirmation sous peu.
            </p>
            <Button onClick={handleClose} className="w-full bg-[#405B35] hover:bg-[#405B35]/90">
              Fermer
            </Button>
          </div>
        )}

        {step === 'error' && (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl">✗</span>
            </div>
            <h3 className="text-xl font-bold text-red-600">Échec du paiement</h3>
            <p className="text-gray-600">
              Une erreur s'est produite lors du traitement de votre paiement. Veuillez réessayer.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleClose} className="flex-1">
                Annuler
              </Button>
              <Button 
                onClick={() => setStep('info')} 
                className="flex-1 bg-[#405B35] hover:bg-[#405B35]/90"
              >
                Réessayer
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
