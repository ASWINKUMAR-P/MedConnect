from django.contrib import admin
from .models import *
# Register your models here.

admin.site.register(Question)
admin.site.register(Answer)
admin.site.register(Tags)
admin.site.register(Comment)
admin.site.register(Files)
admin.site.register(Proof)
admin.site.register(BlockedUsers)
admin.site.register(Report)
