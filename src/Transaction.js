import * as THREE from 'three';

class Transaction{

  ctrl1;
  ctrl2;
  x1;
  x2;
  y1;
  y2;
  z1;
  z2;
  amount;
  transaction;
  k;
  curveObject;
  setRange;

  constructor(x1, y1, z1, x2, y2, z2, amount){

    this.x1 = x1
    this.x2 = x2
    this.y1 = y1
    this.y2 = y2
    this.z1 = z1
    this.z2 = z2

    this.amount=amount

    let transaction;
    let distance = Math.sqrt((this.x1-this.x2)**2 + (this.y1-this.y2)**2 + (this.x1-this.z2)**2)

    console.log(distance)

    if(distance>50){
      this.k = 1.8;
    }
    else{
      this.k = 1.3;
    }



  }


  sendTransactionAnimation(){


    this.ctrl1 = new THREE.Vector3( this.x1*this.k, this.y1*this.k , this.z1*this.k)
    this.ctrl2 = new THREE.Vector3( this.x2*this.k , this.y2*this.k , this.z2*this.k)



    var curve = new THREE.CubicBezierCurve3(
              new THREE.Vector3(this.x1,  this.y1, this.z1),
              this.ctrl1,
              this.ctrl2,
              new THREE.Vector3( this.x2, this.y2 , this.z2)
            );

            var points = curve.getPoints(100);


            this.transaction = new THREE.BufferGeometry().setFromPoints(points);

            this.transaction.setDrawRange(0, 0)


            var linematerial = new THREE.LineBasicMaterial( { color: 0xECA72C, linewidth: 1} )

            this.curveObject  = new THREE.Line(this.transaction, linematerial);
            this.curveObject.name = 'line'
            this.curveObject.userData = { lifetime : 100, amount: this.amount}

            return this.curveObject;


  }


}


export { Transaction }
