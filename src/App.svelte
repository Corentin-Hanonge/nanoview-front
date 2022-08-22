<script>

	import EarthViz from './earthviz.svelte'
	import List from './list.svelte'
	import Footer from './footer.svelte'

	import { nodes } from './nodeStore.js';

	let nodelist;

	open();

	nodes.subscribe(value => {
			 nodelist = value;
		})

	let footer





</script>

<main>


	<header class="flex">
	 <img src = "../images/earthIcon.png" alt="earth logo">
	 <h1>Nano PR Transactions Viewer</h1>

	</header>

	<div class="mainGrid">

		<!-- <div class="listWrapper">
			<List/>
		</div> -->

		<div class="earthWrapper">
		 <EarthViz class="canvas"/>
		</div>


	</div>

	<Footer/>





</main>

<style>
	main {
		margin: 0 auto;
	}
	header {
		padding-top: 3rem;
		position: absolute;
		width: 50%;
		padding-left: 5%;
	}
	h1 {
		z-index: 2;
		padding-top: 0rem;
		color: #EEF0F2;
		font-size: 1em;
		font-weight: 100;
	}
	h2{
		color: #EEF0F2;
		font-weight: 100;
		z-index: 3;
	}
	h3{
		font-weight: lighter;
	}


	.mainGrid{
		width: 100%;
		height: 100%;
		display: grid;
		grid-template-columns: 1fr;
		align-items: center;
		margin-top: -1rem;
		margin-right: auto;
		margin-left: auto;
		overflow: hidden;
	}
	.earthWrapper{
		text-align: center;

		z-index: 1;
	}

	header img{
		width: 1.2em;
		height: 1.2em;
		margin-right: 0.5em;
		z-index: 2
	}



	@media (max-width: 1000px) {
		.mainGrid{
			grid-template-columns: 1fr;
		}
	}
</style>
