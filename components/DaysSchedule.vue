<template>
    <div class="timetable">
        <div class="row g-4">
            <div
                v-for="(item, i) in items"
                :key="i"
                class="timetable__item__col col-md-6 col-lg-4 col-xl-3"
            >
                <div class="timetable__item p-3">
                    <div
                        class="
                            timetable__item__header
                            flex
                            justify-between
                            items-center
                        "
                    >
                        <p class="title_block">{{ i }}-й день</p>
                        <p v-if="item.day" class="small text-sub">{{item.day}}</p>
                    </div>
                    <p v-if="item.text" class="mb-0 opacity-50">
                        {{item.text}}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['items']
};
</script>

<style>
</style>