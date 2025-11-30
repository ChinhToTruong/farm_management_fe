import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Documentation } from './app/pages/documentation/documentation';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
import { AuthGuard } from '@/commons/guards/auth.guard';
import { AppTable } from '@/layout/component/table/table';
import { Test } from '@/pages/test/test';
import { EditProfile } from '@/pages/users/edit-profile/edit-profile';
import { UserList } from '@/pages/users/user-list/user-list';
import { LocationList } from '@/pages/location/location';
import { CropSeasonList } from '@/pages/crop-season/crop-season-list/crop-season-list';
import { PlantList } from '@/pages/plant/plant-list/plant-list';
import { AnimalList } from '@/pages/animal/animal-list/animal-list';
import { WorkDiaryList } from '@/pages/work-diary/work-diary-list/work-diary-list';
import { VaccinationList } from '@/pages/vaccination/vaccination-list/vaccination-list';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            { path: '', component: Dashboard },
            { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
            { path: 'documentation', component: Documentation },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') }
        ],
        canActivate: [AuthGuard],
    },
    {
        path: 'users',
        component: AppLayout,
        children: [
            {
                path: 'profile',
                component: EditProfile
            },
            {
                path: ':id',
                component: EditProfile,
            },
            {
                path: '',
                component:UserList
            }
        ]
    },
    {
        path: 'locations',
        component: AppLayout,
        children: [
            {
                path: '',
                component:LocationList
            }
        ]
    },
    {
        path: 'crop-seasons',
        component: AppLayout,
        children: [
            {
                path: '',
                component:CropSeasonList
            }
        ]
    },
    {
        path: 'plants',
        component: AppLayout,
        children: [
            {
                path: '',
                component:PlantList
            }
        ]
    },
    {
        path: 'animals',
        component: AppLayout,
        children: [
            {
                path: '',
                component:AnimalList
            }
        ]
    },
    {
        path: 'work-diaries',
        component: AppLayout,
        children: [
            {
                path: '',
                component:WorkDiaryList
            }
        ]
    },
    {
        path: 'vaccination',
        component: AppLayout,
        children: [
            {
                path: '',
                component: VaccinationList
            }
        ]
    },
    {
        path: 'test',
        component: Test
    },
    { path: 'landing', component: Landing },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];
