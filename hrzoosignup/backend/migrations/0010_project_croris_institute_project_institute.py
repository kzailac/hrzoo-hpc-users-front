# Generated by Django 4.2 on 2023-04-16 13:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0009_alter_project_approved_by_alter_project_denied_by'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='croris_institute',
            field=models.CharField(blank=True, max_length=128, verbose_name='CroRIS institute'),
        ),
        migrations.AddField(
            model_name='project',
            name='institute',
            field=models.CharField(blank=True, max_length=128, verbose_name='institution of project leader'),
        ),
    ]
