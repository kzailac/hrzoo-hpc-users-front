# Generated by Django 4.2.3 on 2024-02-15 16:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0019_user_person_institution_realm_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='crorisinstitutions',
            name='realm',
            field=models.CharField(blank=True, max_length=16, verbose_name='AAI@EduHR realm'),
        ),
    ]
