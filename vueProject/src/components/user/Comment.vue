<template>
    <Carousel autoplay v-model="value2" loop>
        <CarouselItem>
            <div class="demo-carousel">1</div>
        </CarouselItem>
        <CarouselItem>
            <div class="demo-carousel">2</div>
        </CarouselItem>
        <CarouselItem>
            <div class="demo-carousel">3</div>
        </CarouselItem>
        <CarouselItem>
            <div class="demo-carousel">4</div>
        </CarouselItem>
    </Carousel>
</template>
<style>
.demo-carousel{
    height: 100px;
    background: #2d8cf0;
    font-size: 40px
}
</style>

<script>
    export default {
        data () {
            return {
                value2: 0
            }
        }
    }
</script>
