# Generated by Django 4.2 on 2023-04-07 18:48

import backend.models
import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0007_rename_users_sshpublickey_user_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='sshpublickey',
            name='public_key',
            field=models.TextField(validators=[django.core.validators.MaxLengthValidator(2000), backend.models.validate_ssh_public_key]),
        ),
    ]
