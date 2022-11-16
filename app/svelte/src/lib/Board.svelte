<script lang="ts">
    import { Canvas, Layer, t } from 'svelte-canvas';
    import Tools from './Tools.svelte';
    import Shape from './Shape.svelte';

    let width, height;
    let draw = false;
    let mousePos = { x: 0, y: 0};
    let startPos = { x: 0, y: 0};

    function startDrawing() {
        startPos = mousePos;
        draw = true;
    }

    function stopDrawing() {
        draw = false;
    }

</script>

<div bind:clientWidth={width} bind:clientHeight={height} class="w-screen h-screen">
    <Tools/>
    <Canvas {width} {height}
        on:mousemove={e => mousePos = {x: e.clientX, y: e.clientY}}
        on:mousedown={startDrawing}
        on:mouseup={stopDrawing}
        on:mouseleave={stopDrawing}
    >
    {#each shapes as shape}
        <Shape/>
    {/each}
    </Canvas>
</div>