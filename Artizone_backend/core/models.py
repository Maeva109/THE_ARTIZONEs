from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.conf import settings
from django.contrib.postgres.fields import ArrayField
import json
from django.contrib import admin

class UserManager(BaseUserManager):
    def create_user(self, email, nom, prenom, telephone, role, password=None, **extra_fields):
        if not email:
            raise ValueError('L\'email est obligatoire')
        email = self.normalize_email(email)
        user = self.model(email=email, nom=nom, prenom=prenom, telephone=telephone, role=role, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, nom, prenom, telephone, password=None, **extra_fields):
        extra_fields.setdefault('role', 'admin')
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, nom, prenom, telephone, password=password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('artisan', 'Artisan'),
        ('client', 'Client'),
    )
    email = models.EmailField(unique=True)
    nom = models.CharField(max_length=100)
    prenom = models.CharField(max_length=100)
    telephone = models.CharField(max_length=20)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='client')
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['nom', 'prenom', 'telephone', 'role']

    objects = UserManager()

    def __str__(self):
        return f"{self.email} ({self.role})"

# Create your models here.

class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    image = models.ImageField(upload_to='categories/', blank=True, null=True)

    def __str__(self):
        return self.name

class Product(models.Model):
    STATUS_CHOICES = (
        ('active', 'Active'),
        ('inactive', 'Inactive'),
    )

    name = models.CharField(max_length=100)
    description = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField()
    images = models.ImageField(upload_to='products/', blank=True, null=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='active')
    variants = models.JSONField(blank=True, default=list, help_text="Liste des variantes du produit, ex: ['Rouge/Or', 'Bleu/Argent', 'Vert/Bronze']")
    artisan = models.ForeignKey('core.ArtisanProfile', on_delete=models.CASCADE, related_name='products', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    # Example: materials = "Perles en terre cuite, fil de coton naturel, fermoir en laiton"
    # Example: dimensions = "Longueur: 45cm, Largeur: 2cm"
    # Example: variants = ["Rouge/Or", "Bleu/Argent", "Vert/Bronze"] (if you add a variants field)

    def __str__(self):
        return self.name

class Cart(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='cart')
    created_at = models.DateTimeField(auto_now_add=True)

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey('Product', on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    class Meta:
        unique_together = ('cart', 'product')

class Review(models.Model):
    product = models.ForeignKey('Product', on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    rating = models.PositiveSmallIntegerField()  # 1-5
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.product.name} ({self.rating})"

class Order(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    # Add more fields as needed (address, status, etc.)

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey('Product', on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

class ArtisanProfile(models.Model):
    STATUT_CHOICES = [
        ('en_attente', 'En attente'),
        ('valide', 'Validé'),
        ('suspendu', 'Suspendu'),
        ('supprime', 'Supprimé'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='artisan_profile')
    description_artisan = models.TextField(blank=True)
    boutique_id = models.CharField(max_length=100, blank=True, null=True)
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default='en_attente')
    date_inscription = models.DateTimeField(auto_now_add=True)
    departement = models.CharField(max_length=100, blank=True)
    ville = models.CharField(max_length=100, blank=True)
    note_moyenne = models.FloatField(default=0)
    nombre_avis = models.IntegerField(default=0)
    formations_suivies = models.JSONField(default=list, blank=True)
    photo_profil = models.ImageField(upload_to='artisans/', blank=True, null=True)
    demande_timbre = models.FileField(upload_to='artisans/demande_timbre/', blank=True, null=True)
    attestation_enregistrement = models.FileField(upload_to='artisans/attestation_enregistrement/', blank=True, null=True)
    photos_produits = models.FileField(upload_to='artisans/photos_produits/', blank=True, null=True)
    plan_localisation = models.FileField(upload_to='artisans/plan_localisation/', blank=True, null=True)
    copie_cni = models.FileField(upload_to='artisans/copie_cni/', blank=True, null=True)
    qr_code = models.ImageField(upload_to='artisans/qr_codes/', blank=True, null=True)
    profil_complet = models.BooleanField(default=False)
    facebook = models.CharField(max_length=255, blank=True, null=True)
    instagram = models.CharField(max_length=255, blank=True, null=True)
    whatsapp = models.CharField(max_length=50, blank=True, null=True)
    opening_hours = models.TextField(blank=True, null=True)
    galerie = models.JSONField(default=list, blank=True)
    # Ajout des coordonnées GPS
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)

    def __str__(self):
        return f"{self.user.nom} {self.user.prenom} ({self.user.email})"

class TrainingField(models.Model):
    name = models.CharField(max_length=100)
    icon = models.CharField(max_length=100, blank=True)  # nom d'icône ou URL
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

class TutorialCategory(models.Model):
    name = models.CharField(max_length=100)
    field = models.ForeignKey(TrainingField, related_name='categories', on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.field.name} - {self.name}"

class Tutorial(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Brouillon'),
        ('published', 'Publié'),
        ('scheduled', 'Programmé'),
    ]
    FORMAT_CHOICES = [
        ('video', 'Vidéo'),
        ('pdf', 'PDF'),
        ('workshop', 'Atelier'),
    ]
    LEVEL_CHOICES = [
        ('beginner', 'Débutant'),
        ('intermediate', 'Intermédiaire'),
        ('advanced', 'Avancé'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    field = models.ForeignKey(TrainingField, on_delete=models.CASCADE)
    category = models.ForeignKey(TutorialCategory, on_delete=models.CASCADE)
    objectives = models.TextField(blank=True)
    skills = models.TextField(blank=True)
    target_audience = models.CharField(max_length=200, blank=True)
    format = models.CharField(max_length=20, choices=FORMAT_CHOICES)
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES)
    resource_url = models.URLField(blank=True)
    image = models.ImageField(upload_to='tutorials/images/', blank=True, null=True)
    trainer = models.CharField(max_length=100)
    trainer_profile = models.TextField(blank=True)
    schedule = models.DateTimeField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    published_at = models.DateTimeField(blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title