# Generated by Django 4.2.3 on 2024-03-27 18:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0020_crorisinstitutions_realm'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='person_institution_manual_set',
            field=models.BooleanField(default=False),
        ),
    ]
