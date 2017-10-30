<template>
    <Tree :data="filter.list"></Tree>
</template>
<script>
  
    export default {
        data () {
            return {
                filter:{
                    list:[],
                }
            }
        },
        methods:{
            getData(){
            this.$http.get('http://localhost:3000/cate/list',this.filter)
            .then(res=>{
                console.log(res);
                this.filter.list = res.data;

                })
            }
        },
        created(){
            this.getData();
        }
        
    }
</script>
