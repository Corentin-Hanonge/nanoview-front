
<script>


import {Transaction} from "./Transaction.js"

import { onMount } from 'svelte';

import * as THREE from 'three'

import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

//import textureVertexShader from "/shaders/textureVertexShader.glsl"
import { nodes } from './nodeStore.js';

import { listenAccounts } from './listenAccountStore.js';


let textureVertexShader = "varying vec2 vertexUV;varying vec3 vertexNormal;void main() {vertexUV = uv;vertexNormal = normalize(normalMatrix * normal);gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );}"

let textureFragmentShader = "uniform sampler2D globeTexture;varying vec3 vertexNormal;varying vec2 vertexUV;void main() {  float intensity = 1.05 - dot(vertexNormal, vec3(0.0, 0.0, 1.0));vec3 atmosphere = vec3(0.3, 0.6, 1.0) * pow(intensity, 1.5);gl_FragColor = vec4(atmosphere +  texture2D(globeTexture, vertexUV ).xyz, 1.0);}"

let atmVertexShader = "varying vec3 vertexNormal;void main() {  vertexNormal = normalize(normalMatrix * normal);  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );}"

let atmFragmentShader = "varying vec3 vertexNormal;void main() {float intensity = pow(0.77 - dot(vertexNormal, vec3(0,0,1.0)), 1.0);gl_FragColor = vec4(0, 0.1, 0.5 , 1.0) * intensity;}"

let canvas;

let handleClick;

let group = new THREE.Group();

let nodelist;

let listenAcc;

let width;

let height;

let renderer;

let camera;



let WSS_SERVER = 'wss://coco-node.fr:9953/proxy'

nodes.subscribe(value => {
     nodelist = value;
  })


   width = window.innerWidth;

   height = window.innerHeight;


onMount(() => {






  console.log(width, height)
  //scene
  var scene = new THREE.Scene();
  scene.background = new THREE.Color(0x141414);


    //camera
  camera = new THREE.PerspectiveCamera( 60, width / height, 1, 300 );
  camera.position.z= 140;



  renderer = new THREE.WebGLRenderer(
    {canvas,
      antialias : true
    }
  );
   renderer.setSize( width, height);
   renderer.setPixelRatio(window.devicePixelRatio)

   //LIGHTS

   const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.8 );
   directionalLight.castShadow = true;
   directionalLight.position.set(100,0,100);
   scene.add( directionalLight );

   const ambientlight = new THREE.AmbientLight( 0xffffff, 0.5 ); // soft white light
   scene.add( ambientlight );

   //ORBIT CONTROLE
   const controls = new OrbitControls( camera, renderer.domElement );

   //TEXTUREFILES

  const canvasCloud = new THREE.TextureLoader().load("/images/fair_clouds.png")
  const texture = new THREE.TextureLoader().load("/images/betterimage.jpg");
  const bumpTexture = new THREE.TextureLoader().load("/images/earthtexture.jpg")
  const specularTexture = new THREE.TextureLoader().load("/images/earthspec1k.jpg")

  //GROUP



  // GROUP - EARTH - CUSTOM SHADER

      let geometry = new THREE.SphereGeometry( 42, 100, 100 );
      //let material = new THREE.MeshPhongMaterial( { map: texture } );

      let customEarthShader = new THREE.ShaderMaterial({
        vertexShader : textureVertexShader,
        fragmentShader : textureFragmentShader,
        lights:true,
        uniforms : {
          globeTexture : {
            value: texture},
            ambientLightColor:{value:new THREE.Color('#ffffff')},
                lightProbe:{value:1},
                directionalLights:{value: directionalLight},
                directionalLightShadows:{value:false},
                spotLights:{value:false},
                spotLightShadows:{value:false},
                spotShadowMap:{value:false},
                spotShadowMatrix:{value:false},
                rectAreaLights:{value:false},
                ltc_1:{value:false},
                ltc_2:{value:false},
                pointLights:{value:false},
                pointLightShadows:{value:false},
                pointShadowMap:{value:false},
                pointShadowMatrix:{value:false},
                hemisphereLights:{value:false},
                directionalShadowMap:{value:false},
                directionalShadowMatrix:{value:false}
        }
      })
      let sphere = new THREE.Mesh( geometry, customEarthShader );

      //earth specular map
         customEarthShader.specular = specularTexture
         customEarthShader.specular  = new THREE.Color(0x111111)


         customEarthShader.bumpMap = bumpTexture;
         customEarthShader.bumpScale = 0.05


         group.add(sphere);


      //clouds
      var cloudgeometry   = new THREE.SphereGeometry(42.5, 32, 32)
      var cloudmaterial  = new THREE.MeshPhongMaterial({
        map     : canvasCloud,
        side        : THREE.DoubleSide,
        opacity     : 0.9,
        transparent : true,
        depthWrite  : false,
      })
      var cloudMesh = new THREE.Mesh(cloudgeometry, cloudmaterial)


        group.add(cloudMesh)

      //atmosphere
      let atmosphereMat = new THREE.SphereBufferGeometry( 45, 100, 100 );

      let customAtmShader = new THREE.ShaderMaterial({
        vertexShader : atmVertexShader,
        fragmentShader : atmFragmentShader,
        blending : THREE.AdditiveBlending,
        side : THREE.BackSide
        })


      let atmosphere = new THREE.Mesh( atmosphereMat, customAtmShader );

      group.add(atmosphere)


      //add nodes

      let nodematerial = new THREE.MeshPhongMaterial( { color: 0x4A90E2, opacity: 0.95, emissive: 0x000024, transparent: true, emissive: 0x4A90E2, emissiveIntensity:1 } );
      let nodegeometry = new THREE.SphereBufferGeometry( 0.15, 10, 10 );

	let backAPI = "https://lime-nutty-catfish.cyclic.app/nano-nodes"

      fetch(backAPI, {
        method: 'GET'
      })
      .then((response) => { return response.json() })
      .then(async (data) =>  {

        nodes.set(data)

        data.forEach((element) => {


          let nodesphere = new THREE.Mesh( nodegeometry, nodematerial );

          nodesphere.position.set(element.XYZcoordinates[0].x, element.XYZcoordinates[0].y, element.XYZcoordinates[0].z);
          group.add(nodesphere);


        });



    })


  reportWindowSize()


  scene.add(group)


  function animate() {

  	requestAnimationFrame( animate );
  	renderer.render( scene, camera );
    group.rotation.y +=0.00005;
    cloudMesh.rotation.y -=0.000005;
    controls.update()
    updateTransactions()


  }
  function updateTransactions(){

      for (let i=0; i < group.children.length; i++){
        if (group.children[i].name == 'line'){

          let lifetime = group.children[i].userData.lifetime
          let amount = group.children[i].userData.amount

          group.children[i].geometry.setDrawRange((100-lifetime)-amount,100-lifetime)

          lifetime = lifetime - 0.95;
          group.children[i].userData.lifetime = lifetime;

            if(lifetime < -amount){

                group.children[i].geometry.dispose()

                group.remove(group.children[i]);

          //      delete group.children[i]

                console.log("child removed");
              }
        }
      }
  }



  animate()


}
)

function reportWindowSize() {
  width = window.innerWidth;
  height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize( width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

}

window.onresize = reportWindowSize;





function addTransaction(x1, y1, z1, x2, y2, z2, amount) {
group.add(new Transaction(x1, y1, z1, x2, y2, z2, amount).sendTransactionAnimation())
console.log("transaction")
}


//let WSS_SERVER='wss://nanolooker.com/ws';



// let NANO_ADDRESS =[
//           "nano_1bx6jd1xiai7kgnxdybu7uf4dbo4uy4gu3jzorc87jh9jjjm5yxwdgz34xmp",
//           "nano_1ez77pixkfdt81bxia7swf1zy9a3d9uubptbtsoqxxhdg7zd3149xt1e91gk",
//           "nano_1tipnanogsu7q59pnie3qfc4w378wm43fg4ksqc8wmnnfnizrq1xrpt5geho",
//           "nano_1pnano998q35p4i87hw5xdydtecubijdkaxba89wwpmhfcb9a43e3tbngwsq",
//           "nano_3jwrszth46rk1mu7rmb4rhm54us8yg1gw3ipodftqtikf5yqdyr7471nsg1k",
//           "nano_3cpz7oh9qr5b7obbcb5867omqf8esix4sdd5w6mh8kkknamjgbnwrimxsaaf",
//           "nano_3pnano4hfk1unhuxr4sfcodkcbhqrjf5fbkzq87cdhtz46z685hmuxe5zdeb",
//           "nano_14uzbiw1euwicrt3gzwnpyufpa8td1uw8wbhyyrz5e5pnqitjfk1tb8xwgg4",
//           "nano_3pnano8teayshbgdn4ubmg7rnh6sbph65s4hwpcsfmphmkabi8yg1bphko7r",
//           "nano_3pnano5gxofoct8w9jfbj4p5qho1qiz4esu471kt8kwuwqjz967p78sqk43b",
//           "nano_1niabkx3gbxit5j5yyqcpas71dkffggbr6zpd3heui8rpoocm5xqbdwq44oh",
//           "nano_3top1ao59iks4hdctz5jyn5hr7d6zr3wogyxj9qzc1wc7e8w9gotr6unwr4p"
//         ]


let socket = new WebSocket(WSS_SERVER)
  setup()



function setup(){
    // Setup WebSocket

    // Called when WebSocket is opened successfully
    socket.onopen = function() {
        console.log('WebSocket is now open');

        subscribe_addresses();
    //    console.log(NANO_ADDRESS);
    }

    // Called when WebSocket fails to open
    socket.onerror = function(e) {
    	console.error('Unable to set up WebSocket');
        console.error(e);
    }


    // Called with each new inbound WebSocket message
    socket.onmessage = async function(response) {


    	let data = JSON.parse(response.data);
    //  console.log(data)

    //  console.log(data)
    //  let interval = (5000/data.blocks.length)

      console.log(data)
    if (data.message){


      if(data.message.block.subtype=="send"){

        let senderRepAcc = data.message.block.representative;
        let senderAcc = data.message.block.account;
        let receiveNode = await getRep(data.message.block.link_as_account)

        let amount = await ponderateAmount(data.message.amount)

        console.log("receivenodePrmise is "+ receiveNode)

        let receiveNodeRep = nodelist.find(element2 => element2.nanoAddress == receiveNode)



        let senderNode = nodelist.find(element => element.nanoAddress == senderRepAcc);

		      if (typeof senderNode !== "undefined"|| typeof receiveNodeRep !=="undefined"){

	console.log("detected transaction from" + senderRepAcc + "to node :"+ receiveNode)


        addTransaction(senderNode.XYZcoordinates[0].x, senderNode.XYZcoordinates[0].y, senderNode.XYZcoordinates[0].z, receiveNodeRep.XYZcoordinates[0].x, receiveNodeRep.XYZcoordinates[0].y,receiveNodeRep.XYZcoordinates[0].z, amount)
			      } else {
					      console.log("Transaction detected but node " + senderRepAcc + "OR" + receiveNode + "   is not a PR")

			      }

      //    console.log(receiveNodeRep.nanoAddress+"_"+senderNode.nanoAddress)

        }

    }





      }


        //  console.log("detected send : from : " + senderAcc + " | represented by : " + senderRepAcc + ", to : " + data.message.block.link_as_account + " | represented by : " + receiveNodeRep + '|| BLOCK : '  )
        //  console.log(data.message)
  //      }
  }


    // Action to subscribe to a particular address
    const subscribe_addresses = function() {
        let input = {
            action: 'subscribe',
            topic: 'confirmation',
             ack: true
        //      options: {
        //          accounts: NANO_ADDRESS
        //          accounts : ["nano_3ri76dkykh9uquhzxehrhk95sintz4r5dgxehfst63fiwf35qmp9ogz79nnm", "nano_1ez77pixkfdt81bxia7swf1zy9a3d9uubptbtsoqxxhdg7zd3149xt1e91gk"]
        //      }
        //
         }


        return socket.send(JSON.stringify(input));
    }

    // Action to send ping
    const ping = function() {
        let input = {
            action: 'ping'
        }

        return socket.send(JSON.stringify(input));
    }


let proxyRPC = 'https://coco-node.fr:443/proxy'
//let proxyRPC = "https://mynano.ninja/api/node"
//let proxyRPC = 'https://backend-nanonetmon.herokuapp.com/proxy'

async function getRep(fetchaddress){

  let res =  fetch(proxyRPC, {
      method: 'POST',
      headers :{
	 'Accept': 'application/json',
         'Content-Type': 'application/json'},
      body: JSON.stringify({action: "account_representative", account: fetchaddress})
	  })
			  .then((response) => { return response.json() })
    .then((data) =>  {
      return data.representative

  })
		

		console.log("asked for rep of "+fetchaddress+" -  got as answer:"+ res)
		if (res !== "undefined"){
				return res
			}else {
console.log("tried to fetch undefined rep")
				}
}


async function ponderateAmount(amount) {

  if (amount < 0.01 * 10**30){
    return 0.01
  }
  else if(amount > 1000 * 10**30 ){
    return 1000
  }
  else{
    return amount/10**30
  }

}

</script>




<canvas bind:this={canvas}>
</canvas>


<!-- <button on:click={simulateTransaction}>
	Test
</button> -->






<style>
canvas{
  z-index: 1;
  overflow-x: hidden;
  overflow-y: hidden;
  width:100%;
}


</style>
