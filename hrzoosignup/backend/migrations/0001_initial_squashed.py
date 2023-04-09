# Generated by Django 4.2 on 2023-04-09 17:20

import backend.models
from django.conf import settings
import django.contrib.auth.models
import django.contrib.auth.validators
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='Project',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=256, verbose_name='name')),
                ('reason', models.CharField(max_length=1024, verbose_name='reason')),
                ('date_start', models.DateField(blank=True, null=True)),
                ('date_end', models.DateField(blank=True, null=True)),
                ('date_submitted', models.DateField(blank=True, null=True)),
                ('date_approved', models.DateField(blank=True, null=True)),
                ('approved_by', models.CharField(blank=True, max_length=128, verbose_name='Approved by')),
                ('denied_by', models.CharField(blank=True, max_length=128, verbose_name='Approved by')),
                ('science_field', models.JSONField(blank=True, null=True)),
                ('science_software', models.JSONField(blank=True, null=True)),
                ('science_extrasoftware', models.CharField(blank=True, max_length=256, null=True, verbose_name='Extra software needed on project')),
                ('science_extrasoftware_help', models.BooleanField()),
                ('resources_numbers', models.JSONField(blank=True, null=True)),
                ('resources_type', models.JSONField(blank=True, null=True)),
                ('is_active', models.BooleanField()),
                ('date_extensions', models.DateField(blank=True, null=True)),
                ('croris_title', models.CharField(blank=True, max_length=512, null=True, verbose_name='CroRIS title')),
                ('croris_start', models.DateField(blank=True, null=True)),
                ('croris_end', models.DateField(blank=True, null=True)),
                ('croris_identifier', models.CharField(blank=True, max_length=48, null=True, verbose_name='CroRIS hrSifraProjekta')),
                ('croris_id', models.PositiveBigIntegerField(verbose_name='CroRIS id')),
                ('croris_summary', models.CharField(blank=True, max_length=512, null=True, verbose_name='CroRIS summary')),
                ('croris_collaborators', models.JSONField(blank=True, null=True, verbose_name='CroRIS osobeResources -voditelj')),
                ('croris_lead', models.JSONField(blank=True, null=True, verbose_name='CroRIS osobeResources voditelj')),
                ('croris_finance', models.JSONField(blank=True, max_length=256, null=True, verbose_name='CroRIS financijeri entityNameHr')),
                ('croris_type', models.CharField(blank=True, max_length=128, null=True, verbose_name='CroRIS tipProjekta')),
            ],
        ),
        migrations.CreateModel(
            name='Role',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, default='', max_length=24, verbose_name='Role name')),
            ],
        ),
        migrations.CreateModel(
            name='State',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, default='', max_length=24, verbose_name='Project state')),
            ],
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('username', models.CharField(error_messages={'unique': 'A user with that username already exists.'}, help_text='Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.', max_length=150, unique=True, validators=[django.contrib.auth.validators.UnicodeUsernameValidator()], verbose_name='username')),
                ('first_name', models.CharField(blank=True, max_length=150, verbose_name='first name')),
                ('last_name', models.CharField(blank=True, max_length=150, verbose_name='last name')),
                ('email', models.EmailField(blank=True, max_length=254, verbose_name='email address')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
                ('croris_first_name', models.CharField(blank=True, max_length=48, verbose_name='CroRIS first name')),
                ('croris_last_name', models.CharField(blank=True, max_length=48, verbose_name='CroRIS last name')),
                ('person_affiliation', models.CharField(blank=True, default='', max_length=64, verbose_name='Affiliation - LDAP')),
                ('person_institution', models.CharField(blank=True, default='', max_length=128, verbose_name='Institution - LDAP')),
                ('person_uniqueid', models.CharField(blank=True, default='', max_length=128, verbose_name='hrEduPersonUniqueID - LDAP')),
                ('croris_mail', models.EmailField(blank=True, max_length=254, verbose_name='CroRIS email address')),
                ('person_mail', models.EmailField(blank=True, default='', max_length=64, verbose_name='Email - LDAP')),
                ('person_oib', models.CharField(blank=True, max_length=11, verbose_name='OIB number - LDAP')),
                ('person_organisation', models.CharField(blank=True, max_length=128, verbose_name='Organisation unit - LDAP')),
            ],
            options={
                'verbose_name': 'user',
                'verbose_name_plural': 'users',
                'abstract': False,
            },
            managers=[
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name='UserProject',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_joined', models.DateTimeField(blank=True, null=True)),
                ('project', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend.project')),
                ('role', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend.role')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'unique_together': {('user', 'project', 'role')},
            },
        ),
        migrations.AddField(
            model_name='project',
            name='users',
            field=models.ManyToManyField(through='backend.UserProject', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='project',
            name='croris_identifier',
            field=models.CharField(blank=True, default='', max_length=48, verbose_name='CroRIS hrSifraProjekta'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='project',
            name='croris_summary',
            field=models.CharField(blank=True, default='', max_length=512, verbose_name='CroRIS summary'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='project',
            name='croris_title',
            field=models.CharField(blank=True, default='', max_length=512, verbose_name='CroRIS title'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='project',
            name='croris_type',
            field=models.CharField(blank=True, default='', max_length=128, verbose_name='CroRIS tipProjekta'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='project',
            name='science_extrasoftware',
            field=models.CharField(blank=True, default='', max_length=256, verbose_name='Extra software needed on project'),
            preserve_default=False,
        ),
        migrations.CreateModel(
            name='SSHPublicKey',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, max_length=128)),
                ('fingerprint', models.CharField(max_length=47)),
                ('public_key', models.TextField(validators=[django.core.validators.MaxLengthValidator(2000), backend.models.validate_ssh_public_key])),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'unique_together': {('name', 'user')},
            },
        ),
        migrations.CreateModel(
            name='ProjectType',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, max_length=24, verbose_name='Project type')),
            ],
        ),
        migrations.AddField(
            model_name='project',
            name='state',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='backend.state'),
        ),
        migrations.AddField(
            model_name='project',
            name='project_type',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='backend.projecttype'),
        ),
        migrations.AlterField(
            model_name='project',
            name='croris_summary',
            field=models.CharField(blank=True, max_length=8192, verbose_name='CroRIS summary'),
        ),
        migrations.AlterField(
            model_name='project',
            name='croris_end',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='project',
            name='croris_start',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='project',
            name='date_approved',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='project',
            name='date_end',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='project',
            name='date_extensions',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='project',
            name='date_start',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='project',
            name='date_submitted',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]