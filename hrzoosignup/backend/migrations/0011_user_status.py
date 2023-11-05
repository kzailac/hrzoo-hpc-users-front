# Generated by Django 4.2.3 on 2023-11-05 22:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0010_set_project_date_todatechanged'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='status',
            field=models.BooleanField(default=True, help_text='Custom is_active field that will designate whether user is assigned to active HRZOO project', verbose_name='custom_active'),
        ),
    ]
