<template>
    <Popover>
        <PopoverTrigger>
            <div class="flex items-center">
                <div class="user__link__meta me-2 hidden lg:block">
                    <p class="user__link__name text-sm font-bold text-end">{{userStore.userdata.name}}</p>
                    <p class="user__link__status text-sm text-sub text-end">
                        Пользователь
                    </p>
                </div>
                <Avatar :src="userStore.userdata.avatar" :name="userStore.userdata.name" :class="'ms-1 user__link__img'"/>
            </div>
        </PopoverTrigger>
        <PopoverContent>
            <NuxtLink to="/profile" class="border-b border-slate-100 p-3 flex items-center gap-2">
                <Icon name="ri:account-circle-line" size="18px" class="text-sub" />
                <span class="text-sm">Мой аккаунт</span>
            </NuxtLink>
            <Button variant="link" @click="userStore.logout" class="font-regular font-normal text-sub p-3">
                <Icon name="ri:logout-box-r-line" size="18px" class="text-sub" />
                <span class="text-sm">Выйти</span>
            </Button>
        </PopoverContent>
    </Popover>
</template>

<script setup>
import Avatar from '../UI/Avatar'
import {Popover, PopoverTrigger, PopoverContent} from '~/components/shadcn/ui/popover'
import {Button} from "~/components/shadcn/ui/button";

const userStore = useUserStore()
</script>

