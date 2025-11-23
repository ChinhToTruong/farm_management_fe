import { User } from '@/pages/service/user.service';


export const MOCK_USERS: User[] = [
    {
        "id": 1,
        "name": "Nguyễn Văn A",
        "email": "nguyenvana@example.com",
        "phone": "0901123456",
        "password": "123456",
        "status": "ACTIVE",
        "role": {
            "id": 1,
            "roleName": "ADMIN",
            "roleDescription": "Quản trị hệ thống",
            "permissions": [
                { "id": 1, "permissionName": "USER_VIEW", "permissionDescription": "Xem người dùng" },
                { "id": 2, "permissionName": "USER_CREATE", "permissionDescription": "Tạo người dùng" },
                { "id": 3, "permissionName": "USER_UPDATE", "permissionDescription": "Cập nhật người dùng" },
                { "id": 4, "permissionName": "USER_DELETE", "permissionDescription": "Xóa người dùng" },
                { "id": 5, "permissionName": "ROLE_MANAGE", "permissionDescription": "Quản lý role" }
            ]
        },
        "createdAt": "2025-01-01T10:00:00",
        "updatedAt": "2025-01-05T12:20:00",
        "createdBy": "system",
        "updatedBy": "admin"
    },
    {
        "id": 2,
        "name": "Trần Thị B",
        "email": "tranthib@example.com",
        "phone": "0902456789",
        "password": "password",
        "status": "ACTIVE",
        "role": {
            "id": 2,
            "roleName": "MANAGER",
            "roleDescription": "Quản lý trung gian",
            "permissions": [
                { "id": 1, "permissionName": "USER_VIEW", "permissionDescription": "Xem người dùng" },
                { "id": 3, "permissionName": "USER_UPDATE", "permissionDescription": "Cập nhật người dùng" },
                { "id": 5, "permissionName": "ROLE_MANAGE", "permissionDescription": "Quản lý role" }
            ]
        },
        "createdAt": "2025-01-02T09:30:00",
        "updatedAt": "2025-01-03T14:00:00",
        "createdBy": "admin",
        "updatedBy": "admin"
    },
    {
        "id": 3,
        "name": "Phạm Văn C",
        "email": "phamvanc@example.com",
        "phone": "0912345678",
        "password": "secret",
        "status": "INACTIVE",
        "role": {
            "id": 3,
            "roleName": "USER",
            "roleDescription": "Người dùng cơ bản",
            "permissions": [
                { "id": 1, "permissionName": "USER_VIEW", "permissionDescription": "Xem người dùng" }
            ]
        },
        "createdAt": "2025-01-03T11:00:00",
        "updatedAt": "2025-01-06T15:15:00",
        "createdBy": "admin",
        "updatedBy": "manager"
    },
    {
        "id": 4,
        "name": "Lê Thị D",
        "email": "lethid@example.com",
        "phone": "0933123456",
        "password": "pass123",
        "status": "BLOCKED",
        "role": {
            "id": 3,
            "roleName": "USER",
            "roleDescription": "Người dùng cơ bản",
            "permissions": [
                { "id": 1, "permissionName": "USER_VIEW", "permissionDescription": "Xem người dùng" }
            ]
        },
        "createdAt": "2025-01-04T08:20:00",
        "updatedAt": "2025-01-04T08:20:00",
        "createdBy": "system",
        "updatedBy": "system"
    }
]
