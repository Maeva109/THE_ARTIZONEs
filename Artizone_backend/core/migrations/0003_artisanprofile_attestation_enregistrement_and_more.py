# Generated by Django 4.2.20 on 2025-07-10 15:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0002_artisanprofile'),
    ]

    operations = [
        migrations.AddField(
            model_name='artisanprofile',
            name='attestation_enregistrement',
            field=models.FileField(blank=True, null=True, upload_to='artisans/attestation_enregistrement/'),
        ),
        migrations.AddField(
            model_name='artisanprofile',
            name='copie_cni',
            field=models.FileField(blank=True, null=True, upload_to='artisans/copie_cni/'),
        ),
        migrations.AddField(
            model_name='artisanprofile',
            name='demande_timbre',
            field=models.FileField(blank=True, null=True, upload_to='artisans/demande_timbre/'),
        ),
        migrations.AddField(
            model_name='artisanprofile',
            name='photos_produits',
            field=models.FileField(blank=True, null=True, upload_to='artisans/photos_produits/'),
        ),
        migrations.AddField(
            model_name='artisanprofile',
            name='plan_localisation',
            field=models.FileField(blank=True, null=True, upload_to='artisans/plan_localisation/'),
        ),
    ]
