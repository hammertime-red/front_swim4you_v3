<template>
<div v-if="pages > 1" class="pagination justify-center justify-content-sm-end">
    <button
        v-if="currentPage > 1"
        @click="prevPage()"
        class="pagination__item btn-circle prev_arrow d-xs-none me-2">
        <vue-feather type="chevron-left"></vue-feather>
    </button>
    <div class="pagination__list flex">
        <button 
        @click="toPage(i)"
        v-for="i in visiblePages" 
        :key="i" 
        class="pagination__item btn-circle" 
        :class="currentPage == i ? 'current' : ''">
            {{i}}
        </button>
    </div>
    <button 
        v-if="currentPage < pages"
        @click="nextPage()"
        class="pagination__item btn-circle prev_arrow d-xs-none ms-2">
        <vue-feather type="chevron-right"></vue-feather>
    </button>
</div>
</template>

<script>
export default {
    props: ['className', 'currentPage', 'pageSize', 'itemsLength'],
    /* data(){
        return {
            visiblePages: this.pages
        }
    }, */
    mounted(){
    },
    methods: {
        nextPage: function() {
            if(this.currentPage <= this.pages){
                let page = this.currentPage + 1
                this.$emit('changepage', page)
                return true
            } 
        },
        toPage: function(page) {
            if((this.currentPage <= this.pages) && page != this.currentPage) {
                this.$emit('changepage', page)
                return true
            }
        },
        prevPage: function() {
            if(this.currentPage > 1) {
                let page = this.currentPage - 1
                this.$emit('changepage', page)
                return true
            }
        },
    },
    computed: {
        pages(){
            return Math.ceil(this.itemsLength / this.pageSize)
        },
        visiblePages(){
            let visiblePages = [];
            for (let index = 1; index <= this.pages; index++) {
				visiblePages.push(index);
			}
            
            if(visiblePages.length > 7){
                let from = 0
                let to = 5
                
                if(this.currentPage >= 3){
                    from = this.currentPage - 3
                    to = this.currentPage + 2
                }

                return visiblePages.slice(from, to);
            } else {
                return visiblePages;
            }
        }
    },
    emits: ['changepage']
}
</script>

<style scoped>
    .pagination__item.current{
        cursor: default;
        color: #071031 !important;
        background: #c1cfe9;
    }
</style>
