from django.shortcuts import render, get_object_or_404

# Create your views here.
from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Product, Category, Cart, CartItem, Review, Order, OrderItem, User, ArtisanProfile, TrainingField, TutorialCategory, Tutorial
from .serializers import ProductSerializer, CategorySerializer, CartSerializer, CartItemSerializer, ReviewSerializer, OrderSerializer, UserSerializer, ArtisanProfileSerializer, TrainingFieldSerializer, TutorialCategorySerializer, TutorialSerializer
from .permissions import IsAdmin
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework import generics
from django.db import transaction
from rest_framework.decorators import api_view, permission_classes
import qrcode
from django.core.mail import EmailMessage
from django.conf import settings
from io import BytesIO
from django.core.files.base import ContentFile
import random
from rest_framework.permissions import AllowAny, IsAdminUser, BasePermission, SAFE_METHODS
from rest_framework.parsers import MultiPartParser, FormParser

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    class Meta:
        model = User
        fields = ('email', 'nom', 'prenom', 'telephone', 'role', 'password')

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Cet email est déjà utilisé.")
        return value

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({"message": "Inscription réussie."}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        user = authenticate(request, email=email, password=password)
        if not user:
            return Response({"error": "Email ou mot de passe incorrect."}, status=status.HTTP_401_UNAUTHORIZED)
        refresh = RefreshToken.for_user(user)
        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": {
                "id": user.id,
                "email": user.email,
                "nom": user.nom,
                "prenom": user.prenom,
                "telephone": user.telephone,
                "role": user.role,
            }
        })

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by('-created_at')
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = [
        'category',
        'status',
        'price',
        'artisan',  # filter by artisan id
        'artisan__user__nom',  # filter by artisan name
        'artisan__ville',      # filter by location (city)
        # 'promotions',        # Uncomment if you add a 'promotions' field to Product
    ]
    search_fields = ['name', 'description', 'artisan__user__nom']
    ordering_fields = ['price', 'name', 'stock', 'created_at']

    def get_permissions(self):
        return [permissions.AllowAny()]
    
    def get_queryset(self):
        # Pour le front-office, ne retourner que les produits actifs
        if self.request.user.is_staff or self.request.user.is_superuser:
            return Product.objects.all().order_by('-created_at')
        return Product.objects.filter(status='active').order_by('-created_at')

    @action(detail=True, methods=['get'])
    def related(self, request, pk=None):
        product = self.get_object()
        related = Product.objects.filter(category=product.category).exclude(id=product.id)[:8]
        serializer = self.get_serializer(related, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def artisan_products(self, request, pk=None):
        product = self.get_object()
        if hasattr(product, 'artisan'):
            artisan_products = Product.objects.filter(artisan=product.artisan).exclude(id=product.id)[:8]
            serializer = self.get_serializer(artisan_products, many=True)
            return Response(serializer.data)
        return Response([])

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    search_fields = ['name', 'description']
    parser_classes = [MultiPartParser, FormParser]

    def get_permissions(self):
        return [permissions.AllowAny()]

class CartViewSet(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]

    def get_cart(self, request):
        if request.user.is_authenticated:
            cart, _ = Cart.objects.get_or_create(user=request.user)
            return cart
        return None

    def get_session_cart(self, request):
        return request.session.get('cart', [])

    def save_session_cart(self, request, cart_items):
        request.session['cart'] = cart_items
        request.session.modified = True

    def list(self, request):
        if request.user.is_authenticated:
            cart = self.get_cart(request)
            serializer = CartSerializer(cart)
            return Response(serializer.data)
        # Anonymous: session cart
        cart_items = self.get_session_cart(request)
        # Build a response similar to CartSerializer
        items = []
        for item in cart_items:
            product = get_object_or_404(Product, id=item['product_id'])
            items.append({
                'id': item['id'],
                'product': ProductSerializer(product).data,
                'quantity': item['quantity'],
            })
        return Response({'items': items})

    def create(self, request):
        if request.user.is_authenticated:
            cart = self.get_cart(request)
            product_id = request.data.get('product_id')
            quantity = int(request.data.get('quantity', 1))
            try:
                product = Product.objects.get(id=product_id, status='active')
            except Product.DoesNotExist:
                return Response({'error': 'Product not found or inactive.'}, status=400)
            if product.stock < quantity:
                return Response({'error': 'Insufficient stock.'}, status=400)
            item, created = CartItem.objects.get_or_create(cart=cart, product=product)
            if not created:
                if product.stock < item.quantity + quantity:
                    return Response({'error': 'Insufficient stock.'}, status=400)
                item.quantity += quantity
            else:
                item.quantity = quantity
            item.save()
            return Response(CartSerializer(cart).data)
        # Anonymous: session cart
        cart_items = self.get_session_cart(request)
        product_id = int(request.data.get('product_id'))
        quantity = int(request.data.get('quantity', 1))
        # Check if product exists
        product = get_object_or_404(Product, id=product_id, status='active')
        # Check if already in cart
        for item in cart_items:
            if item['product_id'] == product_id:
                # Vérification du stock pour les anonymes
                if product.stock < item['quantity'] + quantity:
                    return Response({'error': 'Insufficient stock.'}, status=400)
                item['quantity'] += quantity
                break
        else:
            if product.stock < quantity:
                return Response({'error': 'Insufficient stock.'}, status=400)
            cart_items.append({'id': len(cart_items)+1, 'product_id': product_id, 'quantity': quantity})
        self.save_session_cart(request, cart_items)
        # Build response
        items = []
        for item in cart_items:
            product = get_object_or_404(Product, id=item['product_id'])
            items.append({
                'id': item['id'],
                'product': ProductSerializer(product).data,
                'quantity': item['quantity'],
            })
        return Response({'items': items})

    def update(self, request, pk=None):
        if request.user.is_authenticated:
            cart = self.get_cart(request)
            try:
                item = cart.items.get(id=pk)
            except CartItem.DoesNotExist:
                return Response({'error': 'Item not found.'}, status=404)
            quantity = int(request.data.get('quantity', 1))
            if item.product.stock < quantity:
                return Response({'error': 'Insufficient stock.'}, status=400)
            item.quantity = quantity
            item.save()
            return Response(CartSerializer(cart).data)
        # Anonymous: session cart
        cart_items = self.get_session_cart(request)
        pk = int(pk)
        for item in cart_items:
            if item['id'] == pk:
                item['quantity'] = int(request.data.get('quantity', 1))
                break
        self.save_session_cart(request, cart_items)
        # Build response
        items = []
        for item in cart_items:
            product = get_object_or_404(Product, id=item['product_id'])
            items.append({
                'id': item['id'],
                'product': ProductSerializer(product).data,
                'quantity': item['quantity'],
            })
        return Response({'items': items})

    def destroy(self, request, pk=None):
        if request.user.is_authenticated:
            cart = self.get_cart(request)
            try:
                item = cart.items.get(id=pk)
                item.delete()
            except CartItem.DoesNotExist:
                return Response({'error': 'Item not found.'}, status=404)
            return Response(CartSerializer(cart).data)
        # Anonymous: session cart
        cart_items = self.get_session_cart(request)
        pk = int(pk)
        cart_items = [item for item in cart_items if item['id'] != pk]
        self.save_session_cart(request, cart_items)
        # Build response
        items = []
        for item in cart_items:
            product = get_object_or_404(Product, id=item['product_id'])
            items.append({
                'id': item['id'],
                'product': ProductSerializer(product).data,
                'quantity': item['quantity'],
            })
        return Response({'items': items})

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.AllowAny]  # Allow both authenticated and anonymous
    filterset_fields = ['product']

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(user=user)

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request):
        user = request.user
        # Here, you would get the user's cart and create an order from it
        # For now, just create an empty order for demonstration
        order = Order.objects.create(user=user)
        return Response(OrderSerializer(order).data)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdmin]

class AdminStatsView(APIView):
    permission_classes = [IsAdmin]
    def get(self, request):
        from .models import User, Product, Order, Payment, Dispute
        return Response({
            "artisans": User.objects.filter(role='artisan').count(),
            "clients": User.objects.filter(role='client').count(),
            "products": Product.objects.count(),
            "orders": Order.objects.count(),
            "pending_payments": Payment.objects.filter(status='pending').count() if 'Payment' in globals() else 0,
            "open_disputes": Dispute.objects.filter(status='open').count() if 'Dispute' in globals() else 0,
        })

# Artisan management views
class ArtisanListView(generics.ListAPIView):
    queryset = ArtisanProfile.objects.all().select_related('user')
    serializer_class = ArtisanProfileSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [AllowAny()]
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAdminUser()]

    def get_queryset(self):
        qs = super().get_queryset()
        nom = self.request.query_params.get('nom')
        email = self.request.query_params.get('email')
        statut = self.request.query_params.get('statut')
        departement = self.request.query_params.get('departement')
        if nom:
            qs = qs.filter(user__nom__icontains=nom)
        if email:
            qs = qs.filter(user__email__icontains=email)
        if statut:
            qs = qs.filter(statut=statut)
        if departement:
            qs = qs.filter(departement__icontains=departement)
        return qs

    @transaction.atomic
    def post(self, request):
        # Accept both JSON and multipart/form-data
        data = request.data
        files = request.FILES
        # User fields
        user_data = {
            'nom': data.get('user[nom]', data.get('nom')),
            'prenom': data.get('user[prenom]', data.get('prenom')),
            'email': data.get('user[email]', data.get('email')),
            'telephone': data.get('user[telephone]', data.get('telephone')),
            'password': data.get('user[password]', data.get('password', 'changeme123')),
        }
        # Required user fields
        if not (user_data['nom'] and user_data['prenom'] and user_data['email'] and user_data['password']):
            return Response({'error': 'Champs utilisateur requis manquants'}, status=400)
        from .models import User, ArtisanProfile
        user = User.objects.filter(email=user_data['email']).first()
        if user:
            # If user already has an artisan profile, block
            if ArtisanProfile.objects.filter(user=user).exists():
                return Response({'error': 'Email déjà utilisé'}, status=400)
            # Otherwise, use the existing user (do not update password or info here)
        else:
            # Create new user
            user = User.objects.create(
                nom=user_data['nom'],
                prenom=user_data['prenom'],
                email=user_data['email'],
                telephone=user_data['telephone'],
                role='artisan',
                is_active=False,
            )
            user.set_password(user_data['password'])
            user.save()
        # Artisan fields
        artisan_fields = {
            'departement': data.get('departement', ''),
            'ville': data.get('ville', ''),
            'boutique_id': data.get('shop_name', data.get('boutique_id', '')),
            'description_artisan': data.get('description_artisan', ''),
            'statut': 'en_attente',
            'region': data.get('region', ''),
        }
        # Required files
        required_files = ['demande_timbre', 'attestation_enregistrement', 'photos_produits', 'plan_localisation', 'copie_cni']
        missing_files = [f for f in required_files if f not in files]
        if missing_files:
            return Response({'error': f'Documents manquants: {", ".join(missing_files)}'}, status=400)
        # Create artisan profile
        artisan_profile = ArtisanProfile.objects.create(
            user=user,
            departement=artisan_fields['departement'],
            ville=artisan_fields['ville'],
            boutique_id=artisan_fields['boutique_id'],
            description_artisan=artisan_fields['description_artisan'],
            statut='en_attente',
            photo_profil=None,
            demande_timbre=files.get('demande_timbre'),
            attestation_enregistrement=files.get('attestation_enregistrement'),
            photos_produits=files.get('photos_produits'),
            plan_localisation=files.get('plan_localisation'),
            copie_cni=files.get('copie_cni'),
        )
        serializer = self.get_serializer(artisan_profile)
        return Response(serializer.data, status=201)

class ArtisanDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ArtisanProfile.objects.all().select_related('user')
    serializer_class = ArtisanProfileSerializer
    def get_permissions(self):
        return [AllowAny()]
    parser_classes = [MultiPartParser, FormParser]

    def patch(self, request, *args, **kwargs):
        instance = self.get_object()
        data = request.data
        files = request.FILES
        # Update fields
        instance.description_artisan = data.get('description', instance.description_artisan)
        instance.facebook = data.get('facebook', instance.facebook)
        instance.instagram = data.get('instagram', instance.instagram)
        instance.whatsapp = data.get('whatsapp', instance.whatsapp)
        instance.opening_hours = data.get('opening_hours', instance.opening_hours)
        # Photo de profil
        if files.get('profile_photo'):
            instance.photo_profil = files.get('profile_photo')
        # Galerie (multiple files)
        galerie_files = files.getlist('galerie') if hasattr(files, 'getlist') else []
        galerie_paths = instance.galerie or []
        for f in galerie_files:
            # Save each file and store its path
            from django.core.files.storage import default_storage
            path = default_storage.save(f'artisans/galerie/{f.name}', f)
            galerie_paths.append(path)
        instance.galerie = galerie_paths
        # Vérifie si le profil est complet (exemple: description + photo + 1 photo galerie)
        if instance.description_artisan and instance.photo_profil and len(instance.galerie) > 0:
            instance.profil_complet = True
        else:
            instance.profil_complet = False
        instance.save()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

class IsOwnerOrAdmin(BasePermission):
    def has_object_permission(self, request, view, obj):
        # Allow GET for anyone (already handled)
        if request.method in SAFE_METHODS:
            return True
        # Allow PATCH/PUT/DELETE for owner or admin
        return request.user.is_staff or obj.user == request.user

class ArtisanValidateView(APIView):
    permission_classes = [IsAdmin]

    def post(self, request, pk):
        artisan = get_object_or_404(ArtisanProfile, pk=pk)
        artisan.statut = 'valide'
        # Générer un token ou lien unique (ici simple, à sécuriser en prod)
        qr_data = f"https://artizone.com/artisan/mobile-login?artisan_id={artisan.id}&token=UNIQUE_TOKEN_{artisan.id}"
        # Générer le QR code
        qr_img = qrcode.make(qr_data)
        buffer = BytesIO()
        qr_img.save(buffer, format='PNG')
        file_name = f"artisan_{artisan.id}_qrcode.png"
        artisan.qr_code.save(file_name, ContentFile(buffer.getvalue()), save=False)
        artisan.save()
        # Envoyer l'email
        subject = "Bienvenue sur Artizone !"
        message = f"Bonjour {artisan.user.prenom},\n\nVotre compte artisan a été validé !\nScannez le QR code ci-joint pour accéder à votre espace mobile.\nOu cliquez ici : https://artizone.com/artisan/confirmation"
        email = EmailMessage(subject, message, settings.DEFAULT_FROM_EMAIL, [artisan.user.email])
        if artisan.qr_code:
            email.attach(file_name, buffer.getvalue(), 'image/png')
        email.send()
        return Response({'status': 'Artisan validé'}, status=status.HTTP_200_OK)

class ArtisanRejectView(APIView):
    permission_classes = [IsAdmin]

    def post(self, request, pk):
        artisan = get_object_or_404(ArtisanProfile, pk=pk)
        artisan.statut = 'suspendu'
        artisan.save()
        return Response({'status': 'Artisan suspendu'}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def get_artisan_by_shop(request):
    boutique_id = request.GET.get('boutique_id')
    shop_name = request.GET.get('shop_name')
    
    if not boutique_id and not shop_name:
        return Response({'error': 'boutique_id ou shop_name requis'}, status=400)
    
    try:
        if boutique_id:
            # Try exact match first
            artisan = ArtisanProfile.objects.get(boutique_id__iexact=boutique_id)
        else:
            # Try exact match first, then try with URL slug conversion
            try:
                artisan = ArtisanProfile.objects.get(boutique_id__iexact=shop_name)
            except ArtisanProfile.DoesNotExist:
                # Try to convert slug back to original format
                # Replace hyphens with spaces and try to find a match
                original_name = shop_name.replace('-', ' ')
                artisan = ArtisanProfile.objects.get(boutique_id__icontains=original_name)
        
        serializer = ArtisanProfileSerializer(artisan)
        return Response(serializer.data)
    except ArtisanProfile.DoesNotExist:
        return Response({'error': 'Artisan non trouvé'}, status=404)

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def check_email_exists(request):
    email = request.GET.get('email')
    if not email:
        return Response({'error': 'Email requis'}, status=400)
    from .models import User, ArtisanProfile
    user = User.objects.filter(email=email).first()
    if not user:
        return Response({'exists': False})
    # Check if this user already has an artisan profile
    has_artisan = ArtisanProfile.objects.filter(user=user).exists()
    return Response({'exists': has_artisan})

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def send_verification_code(request):
    email = request.data.get('email')
    if not email:
        return Response({'error': 'Email requis'}, status=400)
    # Generate a 6-digit code
    code = str(random.randint(100000, 999999))
    # Store code in session (for demo; in prod, use cache or DB)
    request.session[f'verif_code_{email}'] = code
    # Send email
    subject = "Votre code de vérification Artizone"
    message = f"Votre code de vérification est : {code}"
    from django.core.mail import send_mail
    from django.conf import settings
    send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [email])
    return Response({'message': 'Code envoyé'})

@api_view(['GET'])
def reviews_by_artisan(request, artisan_id):
    from .models import Review
    reviews = Review.objects.filter(product__artisan_id=artisan_id)
    from .serializers import ReviewSerializer
    serializer = ReviewSerializer(reviews, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def artisans_stats(request):
    from .models import ArtisanProfile, Product
    artisans_count = ArtisanProfile.objects.count()
    regions_count = 13  # Replace with Region.objects.count() if you have a Region model
    departments_count = 91  # Replace with Department.objects.count() if you have a Department model
    products_count = Product.objects.count()
    return Response({
        "artisans": artisans_count,
        "regions": regions_count,
        "departments": departments_count,
        "products": products_count,
    })

class TrainingFieldViewSet(viewsets.ModelViewSet):
    queryset = TrainingField.objects.all()
    serializer_class = TrainingFieldSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'description']

class TutorialCategoryViewSet(viewsets.ModelViewSet):
    queryset = TutorialCategory.objects.all()
    serializer_class = TutorialCategorySerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['name']
    filterset_fields = ['field']

class TutorialViewSet(viewsets.ModelViewSet):
    queryset = Tutorial.objects.all()
    serializer_class = TutorialSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['title', 'description', 'objectives', 'skills', 'trainer']
    filterset_fields = ['field', 'category', 'format', 'level', 'status']

    
