# Generated by Django 5.0.2 on 2024-03-23 09:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0013_notifications'),
    ]

    operations = [
        migrations.AlterField(
            model_name='report',
            name='accepted',
            field=models.CharField(choices=[('pending', 'pending'), ('accepted', 'accepted'), ('rejected', 'rejected')], default='pending', max_length=255),
        ),
    ]
