from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django import forms
from django.utils.html import format_html
from django.urls import reverse, path
from django.utils.safestring import mark_safe
from django.shortcuts import render, redirect
from django.contrib import messages
from django.http import HttpResponseRedirect
from .models import User, Category, Product, ArtisanProfile, TrainingField, TutorialCategory, Tutorial

class CustomUserAdmin(BaseUserAdmin):
    model = User
    list_display = ('email', 'nom', 'prenom', 'telephone', 'role', 'is_staff', 'is_active', 'date_joined')
    list_filter = ('role', 'is_staff', 'is_active')
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Informations personnelles', {'fields': ('nom', 'prenom', 'telephone', 'role')}),
        ('Permissions', {'fields': ('is_staff', 'is_active', 'is_superuser', 'groups', 'user_permissions')}),
        ('Dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'nom', 'prenom', 'telephone', 'role', 'password1', 'password2', 'is_staff', 'is_active')
        }),
    )
    search_fields = ('email', 'nom', 'prenom', 'telephone')
    ordering = ('email',)
    filter_horizontal = ('groups', 'user_permissions',)

admin.site.register(User, CustomUserAdmin)
# Register your models here.

class ArtisanProfileAdmin(admin.ModelAdmin):
    list_display = ('user_info', 'statut', 'departement', 'ville', 'date_inscription', 'documents_status', 'validate_documents_link')
    list_filter = ('statut', 'departement', 'date_inscription', 'profil_complet')
    search_fields = ('user__nom', 'user__prenom', 'user__email', 'boutique_id', 'departement', 'ville')
    readonly_fields = ('date_inscription', 'qr_code_preview', 'documents_preview', 'documents_validation')
    ordering = ('-date_inscription',)
    
    fieldsets = (
        ('Informations de base', {
            'fields': ('user', 'statut', 'date_inscription')
        }),
        ('Informations géographiques', {
            'fields': ('departement', 'ville', 'latitude', 'longitude')
        }),
        ('Informations professionnelles', {
            'fields': ('boutique_id', 'description_artisan', 'note_moyenne', 'nombre_avis')
        }),
        ('Documents administratifs', {
            'fields': ('demande_timbre', 'attestation_enregistrement', 'copie_cni'),
            'description': 'Documents requis pour la validation du compte artisan'
        }),
        ('Documents commerciaux', {
            'fields': ('photos_produits', 'plan_localisation'),
            'description': 'Documents liés à l\'activité commerciale'
        }),
        ('Médias et communication', {
            'fields': ('photo_profil', 'galerie', 'qr_code_preview'),
            'description': 'Photos et médias de l\'artisan'
        }),
        ('Réseaux sociaux', {
            'fields': ('facebook', 'instagram', 'whatsapp', 'opening_hours'),
            'description': 'Liens vers les réseaux sociaux et horaires'
        }),
        ('Statistiques', {
            'fields': ('formations_suivies', 'profil_complet'),
            'description': 'Informations statistiques et de formation'
        }),
        ('Validation des documents', {
            'fields': ('documents_validation',),
            'description': 'Statut de validation des documents soumis'
        }),
    )

    def user_info(self, obj):
        """Affiche les informations de l'utilisateur de manière compacte"""
        if obj.user:
            return format_html(
                '<strong>{}</strong><br/>'
                '<small>{} - {}</small><br/>'
                '<small>{}</small>',
                f"{obj.user.prenom} {obj.user.nom}",
                obj.user.email,
                obj.user.telephone,
                obj.user.role
            )
        return "Utilisateur non défini"
    user_info.short_description = "Informations utilisateur"

    def documents_status(self, obj):
        """Affiche le statut des documents requis"""
        documents = {
            'Demande timbre': bool(obj.demande_timbre),
            'Attestation': bool(obj.attestation_enregistrement),
            'CNI': bool(obj.copie_cni),
            'Photos produits': bool(obj.photos_produits),
            'Plan localisation': bool(obj.plan_localisation),
        }
        
        total = len(documents)
        completed = sum(documents.values())
        
        if completed == total:
            color = 'green'
            status = 'Complet'
        elif completed >= total * 0.8:
            color = 'orange'
            status = 'Presque complet'
        else:
            color = 'red'
            status = 'Incomplet'
        
        return format_html(
            '<span style="color: {}; font-weight: bold;">{}</span><br/>'
            '<small>{}/{} documents</small>',
            color, status, completed, total
        )
    documents_status.short_description = "Statut documents"

    def documents_validation(self, obj):
        """Affiche un tableau de validation des documents"""
        documents = [
            ('Demande de timbre', obj.demande_timbre, 'Document fiscal requis'),
            ('Attestation d\'enregistrement', obj.attestation_enregistrement, 'Preuve d\'enregistrement commercial'),
            ('Copie CNI', obj.copie_cni, 'Pièce d\'identité'),
            ('Photos produits', obj.photos_produits, 'Exemples de produits'),
            ('Plan de localisation', obj.plan_localisation, 'Localisation de l\'activité'),
        ]
        
        html = '<div style="margin: 10px 0;">'
        html += '<table style="width: 100%; border-collapse: collapse;">'
        html += '<tr style="background-color: #f5f5f5;">'
        html += '<th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Document</th>'
        html += '<th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Statut</th>'
        html += '<th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Description</th>'
        html += '<th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Action</th>'
        html += '</tr>'
        
        for title, doc, description in documents:
            if doc:
                status = '✅ Présent'
                action = format_html('<a href="{}" target="_blank">Voir</a>', doc.url)
            else:
                status = '❌ Manquant'
                action = 'En attente'
            
            html += format_html(
                '<tr>'
                '<td style="border: 1px solid #ddd; padding: 8px;">{}</td>'
                '<td style="border: 1px solid #ddd; padding: 8px;">{}</td>'
                '<td style="border: 1px solid #ddd; padding: 8px;">{}</td>'
                '<td style="border: 1px solid #ddd; padding: 8px;">{}</td>'
                '</tr>',
                title, status, description, action
            )
        
        html += '</table></div>'
        return mark_safe(html)
    documents_validation.short_description = "Validation des documents"

    def qr_code_preview(self, obj):
        """Affiche un aperçu du QR code"""
        if obj.qr_code:
            return format_html(
                '<img src="{}" style="max-width: 200px; max-height: 200px;" />',
                obj.qr_code.url
            )
        return "Aucun QR code généré"
    qr_code_preview.short_description = "QR Code"

    def documents_preview(self, obj):
        """Affiche un aperçu de tous les documents"""
        documents = []
        
        if obj.demande_timbre:
            documents.append(('Demande de timbre', obj.demande_timbre))
        if obj.attestation_enregistrement:
            documents.append(('Attestation d\'enregistrement', obj.attestation_enregistrement))
        if obj.copie_cni:
            documents.append(('Copie CNI', obj.copie_cni))
        if obj.photos_produits:
            documents.append(('Photos produits', obj.photos_produits))
        if obj.plan_localisation:
            documents.append(('Plan de localisation', obj.plan_localisation))
        
        if not documents:
            return "Aucun document uploadé"
        
        html = '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px;">'
        for title, doc in documents:
            if doc.name.lower().endswith(('.jpg', '.jpeg', '.png', '.gif')):
                # Image preview
                html += format_html(
                    '<div style="border: 1px solid #ddd; padding: 10px; border-radius: 5px;">'
                    '<strong>{}</strong><br/>'
                    '<img src="{}" style="max-width: 100%; height: auto; margin-top: 5px;" />'
                    '<br/><a href="{}" target="_blank">Voir en grand</a>'
                    '</div>',
                    title, doc.url, doc.url
                )
            else:
                # File link
                html += format_html(
                    '<div style="border: 1px solid #ddd; padding: 10px; border-radius: 5px;">'
                    '<strong>{}</strong><br/>'
                    '<a href="{}" target="_blank">📄 Télécharger le document</a>'
                    '</div>',
                    title, doc.url
                )
        html += '</div>'
        
        return mark_safe(html)
    documents_preview.short_description = "Aperçu des documents"

    def get_queryset(self, request):
        """Optimise les requêtes avec select_related"""
        return super().get_queryset(request).select_related('user')

    def get_urls(self):
        """Ajoute des URLs personnalisées pour l'admin"""
        urls = super().get_urls()
        custom_urls = [
            path(
                '<int:artisan_id>/validate-documents/',
                self.admin_site.admin_view(self.validate_documents_view),
                name='artisanprofile-validate-documents',
            ),
        ]
        return custom_urls + urls

    def validate_documents_view(self, request, artisan_id):
        """Vue personnalisée pour la validation des documents"""
        try:
            artisan = ArtisanProfile.objects.get(id=artisan_id)
        except ArtisanProfile.DoesNotExist:
            messages.error(request, "Artisan non trouvé.")
            return HttpResponseRedirect(reverse('admin:core_artisanprofile_changelist'))
        
        if request.method == 'POST':
            action = request.POST.get('action')
            if action == 'validate':
                artisan.statut = 'valide'
                artisan.save()
                messages.success(request, f"L'artisan {artisan.user.prenom} {artisan.user.nom} a été validé.")
            elif action == 'reject':
                artisan.statut = 'suspendu'
                artisan.save()
                messages.warning(request, f"L'artisan {artisan.user.prenom} {artisan.user.nom} a été suspendu.")
            
            return HttpResponseRedirect(reverse('admin:core_artisanprofile_change', args=[artisan_id]))
        
        # Afficher la vue de validation
        context = {
            'artisan': artisan,
            'title': f'Validation des documents - {artisan.user.prenom} {artisan.user.nom}',
            'opts': self.model._meta,
        }
        return render(request, 'admin/core/artisanprofile/validate_documents.html', context)

    def validate_documents_link(self, obj):
        """Affiche un lien vers la validation des documents"""
        if obj.statut == 'en_attente':
            return format_html(
                '<a href="{}" class="button" style="background: #28a745; color: white; padding: 5px 10px; text-decoration: none; border-radius: 3px;">'
                '📋 Valider documents</a>',
                reverse('admin:artisanprofile-validate-documents', args=[obj.id])
            )
        elif obj.statut == 'valide':
            return format_html(
                '<span style="color: green; font-weight: bold;">✅ Validé</span>'
            )
        elif obj.statut == 'suspendu':
            return format_html(
                '<span style="color: red; font-weight: bold;">❌ Suspendu</span>'
            )
        else:
            return format_html(
                '<span style="color: gray;">{}</span>', obj.statut
            )
    validate_documents_link.short_description = "Validation"

    def get_list_display(self, request):
        """Ajoute le lien de validation à la liste d'affichage"""
        list_display = list(super().get_list_display(request))
        if 'validate_documents_link' not in list_display:
            list_display.append('validate_documents_link')
        return list_display

    actions = ['validate_artisans', 'reject_artisans', 'mark_as_complete', 'export_documents_list']

    def validate_artisans(self, request, queryset):
        """Action pour valider plusieurs artisans"""
        updated = queryset.update(statut='valide')
        self.message_user(request, f'{updated} artisan(s) ont été validés.')
    validate_artisans.short_description = "Valider les artisans sélectionnés"

    def reject_artisans(self, request, queryset):
        """Action pour rejeter plusieurs artisans"""
        updated = queryset.update(statut='suspendu')
        self.message_user(request, f'{updated} artisan(s) ont été suspendus.')
    reject_artisans.short_description = "Suspendre les artisans sélectionnés"

    def mark_as_complete(self, request, queryset):
        """Action pour marquer les profils comme complets"""
        updated = queryset.update(profil_complet=True)
        self.message_user(request, f'{updated} profil(s) ont été marqués comme complets.')
    mark_as_complete.short_description = "Marquer comme profil complet"

    def export_documents_list(self, request, queryset):
        """Action pour exporter la liste des documents"""
        # Cette action pourrait générer un rapport PDF ou CSV
        self.message_user(request, f'Rapport de {queryset.count()} artisan(s) généré.')
    export_documents_list.short_description = "Exporter la liste des documents"

admin.site.register(ArtisanProfile, ArtisanProfileAdmin)

class ProductAdminForm(forms.ModelForm):
    class Meta:
        model = Product
        fields = '__all__'
    def clean_variants(self):
        data = self.cleaned_data['variants']
        if isinstance(data, str):
            # Allow comma-separated input
            return [v.strip() for v in data.split(',') if v.strip()]
        return data

class ProductAdmin(admin.ModelAdmin):
    form = ProductAdminForm
    list_display = ('name', 'category', 'artisan', 'price', 'stock', 'status', 'created_at')
    list_filter = ('category', 'status', 'created_at', 'artisan')
    search_fields = ('name', 'description', 'artisan__user__nom', 'artisan__user__prenom')
    readonly_fields = ('created_at',)
    ordering = ('-created_at',)

admin.site.register(Product, ProductAdmin)

class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'image_preview')
    search_fields = ('name', 'description')
    
    def image_preview(self, obj):
        """Affiche un aperçu de l'image de la catégorie"""
        if obj.image:
            return format_html(
                '<img src="{}" style="max-width: 100px; max-height: 100px;" />',
                obj.image.url
            )
        return "Aucune image"
    image_preview.short_description = "Aperçu image"

admin.site.register(Category, CategoryAdmin)

admin.site.register(TrainingField)
admin.site.register(TutorialCategory)
admin.site.register(Tutorial)
