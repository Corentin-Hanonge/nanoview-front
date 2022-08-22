

<script>
let footerHeight = 0.5
let footerItems = "-10"
let arrowAngle = "180"


const openNav = () => {

    if (footerHeight == 0.5) { footerHeight = 15; footerItems="0"; arrowAngle = "360"}
    else{footerHeight = 0.5 ; footerItems="-10" ; arrowAngle = "180"}
 }



</script>




<footer style="height:{footerHeight}%">


  <div class="downArrowDiv flex row" on:click = {openNav} >
  	<img src="../images/icons8-double-down-100.png" style="transform:rotate({arrowAngle}deg) ;">
  </div>

  <div class="row flex footerContainer" style="margin-bottom:{footerItems}rem">

    <div>
    	<a href="https://nano.org/"><h2 class="item hover-underline-animation">Making use of nano's open, near-instant and feeless network</h2></a>
    </div>

    <div class="footerMenuContainer flex row">

    	<a href="https://twitter.com/C_Hanonge">
    	<div class="item twitter flex row">
    			<img src="../images/icons8-twitter.svg">
    	</div>
    	</a>

    	<a href="https://xno.to/nano_3pgjeh64eyg77k8cc5h4cem16p94s4u3q63e9aywpg6gjpyxaed1ou41dccn">
    	<div class="item heart flex row spin">
    			<img src="../images/heart.svg">
    			<span>tip nano</span>
    	</div>
    	</a>
    </div>

  </div>


</footer>


<style>


h2{
  font-weight: normal;

}
.downArrowDiv{
  align-self: start;

  top: 0rem;
  left: 10rem;
  background-color: #011638;
  border-radius : 10px;
    margin-top: -2.7rem;


}
.downArrowDiv:hover{
  cursor: pointer;
}
.downArrowDiv img{
  width: 20px;
  padding: 1rem;
  transform: rotate(180deg);
  transition: 0.5s;

}


.footerMenuContainer{
  align-self: end;
  padding: 0.5rem;
  gap: 1rem;
  align-self: bottom;
}
.hover-underline-animation {
display: inline-block;
position: relative;
color: #EEF0F2;
}

.hover-underline-animation:after {
content: '';
position: absolute;
width: 100%;
transform: scaleX(0);
height: 2px;
bottom: 0;
left: 0;
background-color: #EEF0F2;
transform-origin: bottom right;
transition: transform 0.25s ease-out;
}

.hover-underline-animation:hover:after {
transform: scaleX(1);
transform-origin: bottom left;
}
.heart img{
filter: invert(85%) sepia(87%) saturate(5972%) hue-rotate(323deg) brightness(101%) contrast(87%);
height: 1.2rem;
padding: 0.2rem;
}
.heart span{
color: #EEC643;
}
.heart {
padding: 0.5rem;
padding-top: 0.175rem;
padding-bottom: 0.175rem;
  border: 1px solid #EEC643;
  border-radius: 10px;
  position: relative;
  transition: transform .2s;
}
.heart:hover{
cursor: pointer;

transform: scale(1.05);


}
.twitter{

border: 1px solid #EEF0F2;
border-radius: 10px;
transition: transform .2s;

}
.twitter:hover{
cursor: pointer;

transform: scale(1.05);

}
.twitter img{
filter: invert(100%) sepia(23%) saturate(1684%) hue-rotate(178deg) brightness(102%) contrast(90%);
height: 1.4rem;
padding: 0.3rem;
}



footer{
  width: 100%;

  z-index: 4;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #011638;
  opacity: 0.9;
  box-shadow: -5px -5px 100px rgba(238, 240, 242, 0.1);
}

/* ------------------------- */

footer{
  height: 0; /* 100% Full-height */
  width: 100%; /* 0 width - change this with JavaScript */
  position: fixed; /* Stay in place */
  z-index: 1; /* Stay on top */
  bottom: 0;
  left: 0;
   /* Disable horizontal scroll */
  transition: 0.5s; /* 0.5 second transition effect to slide in the sidenav */
}


.footerContainer{
  transition: 0.5s;
  gap: 10%;
  height: 100%;
  width: 80%;
  justify-content: space-between;

}
/* The navigation menu links */








/* Style page content - use this if you want to push the page content to the right when you open the side navigation */


/* On smaller screens, where height is less than 450px, change the style of the sidenav (less padding and a smaller font size) */
@media screen and (max-height: 450px) {
  .sidenav {padding-top: 15px;}
  .sidenav a {font-size: 18px;}
}





</style>
