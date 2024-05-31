import {NewRole} from "@/components/newForms/new-role-management-form.vue";
import {UpdateRoleForm} from "@/components/detailsForms/role-management-detail-form.vue";
import {app_role} from "@/types/database-types";

export class RoleRequestMapper{
    public static newFormToRequest(roleRequest: NewRole): app_role {
        return {
            role_name: roleRequest.role_name
        }
    }
    public static updateFormToRequest(role: UpdateRoleForm): app_role {
        return {
            role_name: role.role_name,
        }
    }
}