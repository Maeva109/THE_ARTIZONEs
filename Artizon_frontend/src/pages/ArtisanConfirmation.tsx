
import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { CheckCircle, Download, Mail, Smartphone, QrCode } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const ArtisanConfirmation = () => {
  const [qrCodeSent, setQrCodeSent] = useState(false);
  const { toast } = useToast();

  // Generate a unique QR code (in real app, this would come from your backend)
  const qrCodeData = `artisan-${Date.now()}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrCodeData)}`;

  const handleSendQRByEmail = async () => {
    try {
      // Here you would call your API to send QR code by email
      console.log('Sending QR code by email');
      setQrCodeSent(true);
      toast({
        title: "QR Code envoyé",
        description: "Le QR code a été envoyé à votre adresse email"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Erreur lors de l'envoi du QR code"
      });
    }
  };

  const handleDownloadApp = (platform: 'android' | 'ios') => {
    const urls = {
      android: 'https://play.google.com/store/apps',
      ios: 'https://apps.apple.com/app'
    };
    
    // In a real app, these would be your actual app store URLs
    window.open(urls[platform], '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Accueil</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/artisans">Nos artisans</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/artisan/create">Créer sa boutique d'artisan</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Confirmation</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <Card className="max-w-3xl mx-auto">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <CardTitle className="text-3xl font-bold text-[#405B35] mb-2">
                Félicitations !
              </CardTitle>
              <p className="text-xl text-gray-600">
                Votre demande a été acceptée ! Bienvenue dans la communauté Artizone.
              </p>
            </CardHeader>
            
            <CardContent className="space-y-8">
              {/* Instructions */}
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Pour accéder à votre espace boutique sur mobile, scannez ce QR code avec l'application Artizone Artisan.
                </h3>
              </div>

              {/* QR Code */}
              <div className="flex justify-center">
                <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-[#405B35]">
                  <img 
                    src={qrCodeUrl} 
                    alt="QR Code Artisan Access" 
                    className="w-64 h-64 mx-auto"
                  />
                  <div className="text-center mt-4">
                    <QrCode className="h-6 w-6 mx-auto mb-2 text-[#405B35]" />
                    <p className="text-sm text-gray-600">Votre QR code unique</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-center text-gray-800">
                  Télécharger l'application mobile
                </h4>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => handleDownloadApp('android')}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3"
                  >
                    <Smartphone className="h-5 w-5 mr-2" />
                    Télécharger pour Android
                  </Button>
                  
                  <Button
                    onClick={() => handleDownloadApp('ios')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3"
                  >
                    <Download className="h-5 w-5 mr-2" />
                    Télécharger pour iOS
                  </Button>
                </div>

                <div className="text-center">
                  <Button
                    onClick={handleSendQRByEmail}
                    disabled={qrCodeSent}
                    variant="outline"
                    className="border-[#405B35] text-[#405B35] hover:bg-[#405B35] hover:text-white px-6 py-2"
                  >
                    <Mail className="h-5 w-5 mr-2" />
                    {qrCodeSent ? 'QR Code envoyé' : 'Recevoir le QR code par email'}
                  </Button>
                </div>
              </div>

              {/* Continue Link */}
              <div className="text-center pt-6 border-t">
                <p className="text-gray-600 mb-4">
                  Vous pouvez également finaliser votre profil artisan maintenant
                </p>
                <Link to="/artisan/profile-completion">
                  <Button className="bg-[#405B35] hover:bg-[#405B35]/90 px-8 py-3">
                    Continuer pour finaliser le profil artisan
                  </Button>
                </Link>
              </div>

              {/* Additional Information */}
              <div className="bg-blue-50 rounded-lg p-6">
                <h4 className="font-semibold text-blue-800 mb-2">Prochaines étapes :</h4>
                <ul className="text-blue-700 space-y-1 text-sm">
                  <li>• Téléchargez l'application mobile Artizone Artisan</li>
                  <li>• Scannez votre QR code pour accéder à votre espace</li>
                  <li>• Complétez votre profil et ajoutez vos produits</li>
                  <li>• Commencez à vendre vos créations artisanales</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ArtisanConfirmation;
