  
import os
from flask_admin import Admin
from .models import db, Users, FinalUser, PreDefinedPlans, VirtualMachines, Request, Hypervisor, OperationLog
from flask_admin.contrib.sqla import ModelView
from flask_admin.form import SecureForm

class RequestView(ModelView):
    form_base_class = SecureForm
    column_list = ('id', 'ticket_number', 'request_type', 'status', 'vm_creation_status', 'user_id', 'plan_id', 'client_id', 'hypervisor_id')
class OperationLogView(ModelView):
    form_base_class = SecureForm
    column_list = ('id', 'operation_type', 'hypervisor_id', 'vm_id', 'request_id', 'user_id', 'request_type', 'status', 'message', 'created_at')

def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    admin = Admin(app, name='4Geeks Admin', template_mode='bootstrap3')
    
    # Add your models here, for example this is how we add a the User model to the admin
    admin.add_view(ModelView(Users, db.session))
    admin.add_view(ModelView(FinalUser, db.session))
    admin.add_view(ModelView(PreDefinedPlans, db.session))
    admin.add_view(ModelView(VirtualMachines, db.session))
    admin.add_view(ModelView(Hypervisor, db.session))
    admin.add_view(RequestView(Request, db.session))
    admin.add_view(OperationLogView(OperationLog, db.session))


    # You can duplicate that line to add mew models
    # admin.add_view(ModelView(YourModelName, db.session))