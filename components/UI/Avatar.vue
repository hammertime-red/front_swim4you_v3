<template>
    <div class="shrink-0">
        <img v-if="src" class="rounded-full avatar " :src="src" :class="(size ? size : 'sm') +' '+ (className ? className : '')" />
        <span v-else class="flex items-center justify-center rounded-full text-white font-bold avatar avatar_badge" :class="(size ? size : 'sm') +' '+ (className ? className : '')" :style="colorByName">{{getFirstLetters}}</span>
    </div>
</template>

<script>
export default {
    props: ["src", "name", 'size', 'className'],
    data(){
        return {
            COLORS_HSL: [
                '6, 71, 60',
                '340, 85, 66',
                '291, 49, 60',
                '263, 49, 63',
                '232, 46, 64',
                '218, 93, 67',
                '187, 73, 70',
                '187, 73, 58',
                '175, 43, 50',
                '151, 44, 53',
                '88, 53, 59',
                '66, 73, 59',
                '51, 95, 53',
                '47, 100, 49',
                '40, 100, 50',
                '16, 100, 69',
                '0, 0, 76',
                '201, 17, 62',
                '17, 16, 56',
                '0, 0, 64',
                '233, 47, 79',
                '262, 49, 74',
                '0, 0, 76',
                '187, 73, 70',
                '15, 15, 69',
                '88, 52, 67',
            ]
        }
    },
    computed: {
        getFirstLetters() {
            const parts = this.name.trim().split(' ');

            // Если имя состоит из одного слова
            if (parts.length === 1) {
                return parts[0].substring(0, 2);
            }

            // Если есть фамилия, возвращаем первые буквы имени и фамилии
            return parts[0].substring(0, 1) + parts[1].substring(0, 1);
        },
        getRandomColor(){
            let int = this.getRandomInt(0, this.COLORS_HSL.length)
            return 'background: rgb('+this.COLORS_HSL[int]+');'
        },
        colorByName(){
            let hash = 0;
            for (let i = 0; i < this.name.length; i++) {
                hash = this.name.charCodeAt(i) + ((hash << 5) - hash);
            }
            hash = Math.abs(hash);
            
            const hRange = [0, 360];
            const sRange = [50, 75];
            const lRange = [25, 60];

            const h = this.normalizeHash(hash, hRange[0], hRange[1]);
            const s = this.normalizeHash(hash, sRange[0], sRange[1]);
            const l = this.normalizeHash(hash, lRange[0], lRange[1]);
            return `background-color: hsl(${h}, ${s}%, ${l}%);`;
        }
    },
    methods: {
        getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min)) + min;
        },
        normalizeHash (hash, min, max) {
            return Math.floor((hash % (max - min)) + min);
        }
    }
};
</script>

<style scoped>
    .avatar_badge.sm,
    .avatar.sm{
        width: 32px;
        height: 32px;
        font-size: 12px;
        line-height: 32px;
    }

    .avatar_badge.lg,
    .avatar.lg{
        width: 150px;
        height: 150px;
        font-size: 60px;
        line-height: 150px;
    }
</style>