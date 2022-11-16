<script lang="ts">

    const tools = [
        { name: "Pencil", icon: "fa-solid fa-pen" },
        { name: "Circle", icon: "fa-regular fa-circle" },
        { name: "Square", icon: "fa-regular fa-square" },
        { name: "Text", icon: "fa-solid fa-align-justify" },
    ];

    let selected = 0;

    function onClick(name) {
        selected = tools.indexOf(tools.find(x => x.name === name));
    }

</script>

<div class="absolute top-0 w-full flex justify-center align-middle mt-2">
  <div class="bg-green-500 rounded-md shadow-md px-8 py-2">
    {#each tools as {name, icon}, index }
        {#if (selected == index)}
            <button on:click|preventDefault={() => {onClick(name)}}><i class="{icon} text-xl mx-2 py-2 text-white"></i></button>
        {:else}
            <button on:click|preventDefault={() => {onClick(name)}}><i class="{icon} text-xl mx-2 py-2 hover:text-gray-500 transistion duration-150"></i></button>
        {/if}
    {/each}
  </div>
</div>