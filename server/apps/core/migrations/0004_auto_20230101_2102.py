# Generated by Django 3.1.6 on 2023-01-02 03:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0003_artist_image2'),
    ]

    operations = [
        migrations.AlterField(
            model_name='artist',
            name='gender',
            field=models.CharField(choices=[('m', 'Masculino'), ('f', 'Femenino')], max_length=1),
        ),
    ]
