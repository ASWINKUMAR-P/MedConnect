# Generated by Django 5.0.2 on 2024-03-13 16:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_report'),
    ]

    operations = [
        migrations.AddField(
            model_name='proof',
            name='rejected',
            field=models.BooleanField(default=False),
        ),
    ]
