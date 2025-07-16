from rest_framework import serializers
from .models import Category, Product, Cart, CartItem, Review, Order, OrderItem, User, ArtisanProfile, TrainingField, TutorialCategory, Tutorial
from rest_framework import viewsets, permissions



class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'




class ProductSerializer(serializers.ModelSerializer):
    is_in_stock = serializers.SerializerMethodField()

    def get_is_in_stock(self, obj):
        return obj.stock > 0

    def validate_images(self, value):
        if value.size > 2*1024*1024:  # 2MB
            raise serializers.ValidationError("L'image ne doit pas dépasser 2MB.")
        if not value.name.lower().endswith(('.jpg', '.jpeg', '.png')):
            raise serializers.ValidationError("Format d'image non supporté (jpg, jpeg, png uniquement).")
        return value

    class Meta:
        model = Product
        fields = '__all__'

class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all(), source='product', write_only=True)

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_id', 'quantity']

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)

    class Meta:
        model = Cart
        fields = ['id', 'user', 'items']

class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    class Meta:
        model = Review
        fields = '__all__'

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['product', 'quantity', 'price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    class Meta:
        model = Order
        fields = ['id', 'user', 'created_at', 'items']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'nom', 'prenom', 'telephone', 'role', 'is_active', 'is_staff', 'is_superuser']

class ArtisanProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = ArtisanProfile
        fields = '__all__'

class TrainingFieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrainingField
        fields = '__all__'

class TutorialCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = TutorialCategory
        fields = '__all__'

class TutorialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tutorial
        fields = '__all__'
