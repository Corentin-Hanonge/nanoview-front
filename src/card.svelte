<script>

  export let name;
  export let description;
  export let totalDonated;



  let showDescription = false;
  let rowSpread = "1/3"

  function handleClick(){
    showDescription = !showDescription;
    if(rowSpread=="1/3"){rowSpread = "1";}
    else{rowSpread = "1/3";}
  }

</script>

<li>
<img src="https://as2.ftcdn.net/v2/jpg/03/56/40/85/1000_F_356408557_88o7YC6LQJlxqFNjlbr91MCzdbPrdChb.jpg" on:click={handleClick}>
<span class="name" on:click={handleClick} style:grid-row={rowSpread}>{name}</span>
{#if showDescription}

<span class="description" on:click={handleClick}>{description}</span>
<label> Total donated : {totalDonated} </label>
<button>DONATE</button>

{:else}

{/if}


</li>



<style>

li{
  margin: 1rem;
  margin-top: 2rem;
  display: grid;
  grid-gap: 0.5rem;
  list-style-type: none;
  grid-template-columns: 1fr 5fr 2fr ;
  align-items: center;

}
li:hover{
  cursor: pointer;
}
img{
  max-width: 100px;
  grid-column: 1 ;
  grid-row: 1/3;
}
.name{
  text-align: left;
  font-size: 1.5rem;
  grid-column: 2 ;

}
.description{
  text-align: justify;
  grid-column: 2 ;
  grid-row: 2;
}
button{
  grid-column: 3 ;
  grid-row: 2;
  background: rgb(34,91,59);
  background: linear-gradient(41deg, rgba(34,91,59,1) 0%, rgba(55,107,78,1) 100%);
  color: white;
  border-radius: 5px;
  border: none;
  width: 10rem;
}
label{
  grid-column: 3 ;
  grid-row: 1;
}

</style>
