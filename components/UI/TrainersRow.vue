<template>
    <div class="row g-4">
        <div
            v-for="(item, i) in items"
            :key="i"
            :class="className ? className : 'col-md-6 col-lg-4 col-xl-3'"
        >
            <div class="person_box">
                <div class="person_box__top mb-3">
                    <div class="person_box__top__overlay"></div>
                    <Avatar 
                        :src="item.avatar"
                        :name="item.name"
                        :className="'avatar_badge__big rounded-circle'"
                        size="lg"
                    />
                </div>
                <div class="person_box__content p-2 text-center">
                    <p v-if="item.name" class="font-bold text_20">{{item.name}}</p>
                    <p v-if="item.desc" class="text-sub mb-0">
                       {{item.desc}}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Avatar from './Avatar'
export default {
  components: { Avatar },
    props: ['items', 'className']
};
</script>

<style>
</style>