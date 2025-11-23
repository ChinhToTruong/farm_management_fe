import { User } from '@/pages/service/user.service';

export interface LocationType {
    id?: string; // từ BaseEntity
    createdAt?: string;
    updatedAt?: string;

    user?: User; // backend trả user hay userId tùy bạn

    locationName: string;
    areaSize?: string;
    type?: 'ANIMAL' | 'CROP' | 'MIXED';
    description: string;
}
