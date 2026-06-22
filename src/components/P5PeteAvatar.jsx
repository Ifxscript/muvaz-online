import { useEffect, useRef } from 'react';

const CANVAS_SIZE = 300;

function hashUserId(uid) {
  let h = 0;
  const s = String(uid || 'default');
  for (let i = 0; i < s.length; i++) h = Math.imul(31, h) + s.charCodeAt(i) | 0;
  return Math.abs(h);
}

function traitsFromUser(uid) {
  const h = hashUserId(uid);
  return {
    id:     h % 1000,
    hat:    h % 7,
    ear:    (h >> 3) % 6,
    eye:    (h >> 6) % 6,
    mouth:  (h >> 9) % 6,
    body:   1,           // always body02
    clr:    (h >> 12) % 6,
    textxH: (h >> 15) % 7,
    textxB: (h >> 18) % 7,
  };
}

export default function P5PeteAvatar({ displaySize = 64, userId = null, style = {} }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    let inst;

    import('p5').then(({ default: p5 }) => {
      inst = new p5((p) => {
        let texs = [];
        let tex1, tex2, tex3, tex4, tex5, graphics, buffer;
        let col2, col2b;
        const col1 = 'white';
        const col3 = 'black';
        const wid = 100, heigh = 100;
        const minCanvasSizetwo = 301;
        const texcol = '#253C59';
        const primB = ['#60BF81','#D9AE89','#BE8FBF','#BBB452','#A9A9A9','#BF9393'];
        const primC = ['#347355','#A67F5D','#694573','#807B38','#515151','#8C5D5D'];
        const traitIndices = traitsFromUser(userId);

        p.setup = () => {
          const cnv = p.createCanvas(CANVAS_SIZE, CANVAS_SIZE, p.WEBGL);
          cnv.style('display', 'block');
          tex1 = p.createGraphics(300, 300);
          tex2 = p.createGraphics(180, 180);
          tex3 = p.createGraphics(300, 300);
          tex4 = p.createGraphics(300, 300);
          tex5 = p.createGraphics(300, 300);
          graphics = p.createGraphics(200, 200);
          buffer = p.createGraphics(200, 250);
        };

        p.draw = () => {
          p.background(primB[traitIndices.clr]);
          col2 = primC[traitIndices.clr];
          col2b = 20;
          drawComp();
          drawShadows();
        };

        // ── textures ──────────────────────────────────────────────────────────
        function drawTexs() {
          texs = [];
          graphics.background(col2);
          graphics.fill(texcol);
          graphics.textSize(15);
          graphics.textAlign(p.CENTER);
          for (let x = 0; x < 201; x += 30) graphics.text('PeteBot', x, x);
          texs.push(graphics);

          const maxX = 300, spacing = 10;
          tex1.fill(col2); tex1.stroke(0); tex1.rect(0, 0, maxX, maxX); tex1.fill(texcol);
          for (let i = 0; i < maxX; i += spacing) {
            const y = p.map(i, 0, maxX, 0, maxX);
            if (i < maxX / 2) tex1.quad(i, y, i+spacing, y, 0, i+i+spacing, 0, i+i);
            else tex1.quad(i, y, i+spacing, y, p.map(i,maxX/2,maxX,0,maxX)+spacing, maxX, p.map(i,maxX/2,maxX,0,maxX), maxX);
          }
          for (let i = 0; i < maxX; i += spacing*2)
            tex1.quad(i, 0, i+spacing, 0, i+maxX-i, maxX-i-spacing, i+maxX-i, maxX-i);
          texs.push(tex1);

          const BW = 50;
          tex2.blendMode(p.BLEND); tex2.background(col2); tex2.fill(texcol); tex2.stroke(texcol);
          const off = -((p.frameCount % 30) / 30) * BW * 2;
          for (let h = off; h < tex2.height; h += BW*2) tex2.rect(0, h, tex2.width, BW);
          tex2.blendMode(p.DIFFERENCE);
          texs.push(tex2);

          tex3.rectMode(p.CENTER); tex3.background(col2);
          for (let x = 10; x < tex3.width; x += 10)
            for (let y = 10; y < tex3.height; y += 10) { tex3.stroke(texcol); tex3.fill(col2); tex3.ellipse(x, y, 10); }
          texs.push(tex3);

          tex4.background(col2); tex4.fill(texcol); tex4.textSize(15); tex4.textAlign(p.CENTER);
          for (let x = 30; x < tex4.width; x += 30) tex4.text('◆ ● ■ ▲ ◇ ○ □ △', x, x);
          texs.push(tex4);

          tex5.rectMode(p.CENTER); tex5.background(col2);
          for (let x = 15; x < tex5.width; x += 20)
            for (let y = 15; y < tex5.height; y += 20) {
              tex5.stroke(texcol); tex5.fill(col2); tex5.rect(x, y, 15);
              tex5.fill(texcol); tex5.rect(x, y, 7);
            }
          texs.push(tex5);
          texs.push(buffer);
        }

        // ── bot ───────────────────────────────────────────────────────────────
        function drawComp() {
          p.translate(0, 25, 0); // shift bot down so head sits centred in viewport
          if (p.width < minCanvasSizetwo || p.height < minCanvasSizetwo) drawBot(0.6);
          else drawBot(1);
        }

        function drawBot(sv) {
          drawTexs();
          p.scale(sv);
          p.push();
          p.rotateY(p.sin(p.frameCount * 0.02) * 0.3);
          p.push(); drawHead(); p.pop();
          drawHat();
          p.push(); drawEyes(); p.pop();
          drawMouth();
          drawEars();
          drawBody();
          p.pop();
        }

        // ── head ──────────────────────────────────────────────────────────────
        function drawHead() {
          p.noStroke(); p.fill(col2);
          p.translate(0, -65, 10);
          p.texture(texs[traitIndices.textxH]);
          p.box(80, 80, 80);
        }

        // ── hats ──────────────────────────────────────────────────────────────
        const hats = [constHat1,constHat2,constHat3,constHat4,constHat5,constHat6,constHat7];
        function drawHat() { hats[traitIndices.hat](); }

        function constHat1() {
          p.noStroke(); p.fill(0); p.texture(texs[3]);
          p.push(); p.translate(30,-115,0); p.box(20,20,100); p.pop();
          p.push(); p.translate(-30,-115,0); p.box(20,20,100); p.pop();
        }
        function constHat2() {
          p.noStroke(); p.fill(0);
          p.push(); p.texture(texs[0]); p.translate(0,-155,20); p.box(40,40,40); p.pop();
          p.push(); p.texture(texs[2]); p.translate(0,-120,20); p.box(50,30,60); p.pop();
        }
        function constHat3() {
          p.noStroke(); p.fill(0);
          p.push(); p.translate(0,-150,10); p.rotateX(p.PI/2); p.texture(texs[traitIndices.textxH]); p.torus(40,6); p.pop();
        }
        function constHat4() {
          p.noStroke();
          p.push(); p.texture(texs[traitIndices.textxH]); p.translate(0,-130,10); p.box(50,10,60); p.pop();
        }
        function constHat5() {
          p.noStroke();
          p.push(); p.translate(0,-125,0); p.texture(texs[traitIndices.textxB]); p.box(20,40,100); p.pop();
        }
        function constHat6() {
          p.noStroke();
          p.push(); p.translate(0,-125,10); p.texture(texs[traitIndices.textxB]); p.box(60,40,60); p.pop();
        }
        function constHat7() {
          p.noStroke(); p.fill(0); p.texture(texs[traitIndices.textxH]);
          p.push(); p.translate(30,-125,-40); p.box(20,40,20); p.pop();
          p.push(); p.translate(-30,-125,-40); p.box(20,40,20); p.pop();
        }

        // ── ears ──────────────────────────────────────────────────────────────
        const ears = [ear01,ear02,ear03,ear04,ear05,ear06];
        function drawEars() { ears[traitIndices.ear](); }
        function drawEar(x1,y1,z1,x,y,z) { p.push(); p.translate(x,y,z); p.box(x1,y1,z1); p.pop(); }
        function earmaker(x,y,z,ang,scl) { p.push(); p.translate(x,y,z); p.rotateZ(ang); p.scale(scl); Pyramid(); p.pop(); }

        function ear01() { p.noStroke(); p.texture(texs[0]); drawEar(15,10,10,-60,-75,10); drawEar(15,10,10,-60,-45,10); drawEar(15,10,10,60,-75,10); drawEar(15,10,10,60,-45,10); }
        function ear02() { p.noStroke(); p.texture(texs[traitIndices.textxH]); drawEar(15,10,10,-50,-75,10); drawEar(15,10,10,50,-75,10); }
        function ear03() { p.noStroke(); earmaker(-50,-75,10,-p.PI/2,0.1); earmaker(50,-75,10,p.PI/2,0.1); }
        function ear04() { p.push(); p.texture(texs[traitIndices.textxH]); drawEar(15,50,10,50,-55,10); drawEar(15,50,10,-50,-55,10); p.pop(); }
        function ear05() { p.push(); p.texture(texs[traitIndices.textxH]); drawEar(40,40,10,62.5,-55,10); drawEar(40,40,10,-62.5,-55,10); p.pop(); }
        function ear06() {
          p.texture(texs[traitIndices.textxH]); drawEar(15,10,10,-50,-55,10); drawEar(15,10,10,50,-55,10);
          p.push(); p.texture(texs[traitIndices.textxB]); drawEar(15,80,10,-65,-90,10); drawEar(15,80,10,65,-90,10); p.pop();
        }

        // ── eyes ──────────────────────────────────────────────────────────────
        const eyes = [draweye01,draweye02,draweye03,draweye04,draweye05,draweye06];
        function drawEyes() { eyes[traitIndices.eye](); }
        function drawEye(x,y,z,xb1,xb2,yb1,yb2,z1) {
          p.push(); p.translate(x,y,z);
          p.fill(250,250,250); p.box(xb1,yb1,z1);
          p.push(); p.translate(0,0,2); p.fill(0,0,0); p.box(xb2,yb2,z1); p.pop();
          p.pop();
        }
        function draweye01() { p.noStroke(); drawEye(-30,-65,55,20,15,80,75,15); drawEye(30,-65,55,20,15,80,75,15); }
        function draweye02() { p.noStroke(); drawEye(0,-65,55,80,70,80,75,15); }
        function draweye03() {
          p.noStroke(); drawEye(20,-65,55,20,10,40,35,15);
          p.push(); p.translate(-20,-65,67); p.fill(255,255,255); p.rotateX(p.PI/2); p.box(30,20,50);
          p.push(); p.translate(0,10,10); p.fill(0); p.box(10,15,10); p.pop(); p.pop();
        }
        function draweye04() {
          p.noStroke(); drawEye(-20,-65,55,20,10,40,5,15);
          p.push(); p.translate(20,-65,67); p.fill(255,255,255); p.rotateX(p.PI/2); p.box(30,20,50);
          p.push(); p.translate(8,10,10); p.fill(0); p.box(15,10,15); p.pop(); p.pop();
        }
        function draweye05() {
          p.noStroke();
          p.push(); p.translate(20,-65,67); p.fill(255,255,255); p.rotateX(p.PI/2); p.box(30,20,20);
          p.push(); p.translate(0,10,10); p.fill(0); p.box(10,15,10); p.pop(); p.pop();
          p.push(); p.translate(-20,-65,67); p.fill(255,255,255); p.rotateX(p.PI/2); p.box(30,20,20);
          p.push(); p.translate(0,10,10); p.fill(0); p.box(10,15,10); p.pop(); p.pop();
        }
        function draweye06() {
          p.noStroke();
          p.push(); p.translate(20,-85,57); p.fill(255,255,255); p.rotateX(p.PI/2); p.box(30,20,20);
          p.push(); p.translate(0,10,10); p.fill(0); p.box(10,15,10); p.pop(); p.pop();
          p.push(); p.translate(-20,-55,57); p.fill(255,255,255); p.rotateX(p.PI/2); p.box(30,20,50);
          p.push(); p.translate(0,10,10); p.fill(0); p.box(10,15,10); p.pop(); p.pop();
        }

        // ── mouths ────────────────────────────────────────────────────────────
        const mouths = [mouth1,mouth2,mouth3,mouth4,mouth5,mouth6];
        function drawMouth() { mouths[traitIndices.mouth](); }
        function drawMouthPart(x,y,z,xs,ys,zs) { p.push(); p.translate(x,y,z); p.box(xs,ys,zs); p.pop(); }

        function mouth1() {
          p.translate(0,-10,0); p.noStroke(); p.fill(col1);
          drawMouthPart(0,-15,30,120,5,150); drawMouthPart(0,-3,30,120,5,150);
          p.push(); p.translate(0,-9,110); p.box(120,11,10); p.pop();
        }
        function mouth2() {
          p.translate(0,-10,0); p.noStroke(); p.fill(col1);
          drawMouthPart(0,-15,30,120,5,150);
          p.push(); p.translate(0,-9,105); p.box(120,16.5,5); p.pop();
          p.push(); p.rotateX(p.PI/2); p.torus(20,4); p.pop();
        }
        function mouth3() {
          p.translate(0,-4,0); p.noStroke(); p.fill(col1);
          drawMouthPart(0,-15,15,100,20,100);
          p.fill(0); p.push(); p.rotateX(p.PI/2); p.torus(20,4); p.pop();
        }
        function mouth4() {
          p.translate(0,-4,0); p.noStroke(); p.fill(col2b);
          p.push(); p.translate(0,-10,15); p.texture(texs[traitIndices.textxH]); p.box(100,30,100); p.pop();
        }
        function mouth5() {
          p.fill(col1);
          p.push(); p.texture(texs[traitIndices.textxH]);
          drawMouthPart(40,0,120,10,50,2.5); drawMouthPart(-40,0,120,10,50,5);
          drawMouthPart(-25,0,120,10,50,5); drawMouthPart(25,0,120,10,50,5); p.pop();
          drawMouthPart(0,-15,35,100,20,170);
        }
        function mouth6() {
          p.fill(col1); drawMouthPart(0,-15,35,100,20,170);
          p.fill('#8C4A6F'); drawMouthPart(65,-15,105,30,10,10);
        }

        // ── bodies ────────────────────────────────────────────────────────────
        const bodies = [body01,body02,body03,body04,body05,body06];
        function drawBody() { bodies[traitIndices.body](); }

        function bodyConst(x,y,z,xsize,ysize,zsize,bol,legarm) {
          if (legarm==='yes') drawArms();
          p.push(); p.fill(col2); p.translate(x,y,z);
          p.push(); p.texture(texs[traitIndices.textxB]); p.box(xsize,ysize,zsize); p.pop();
          if (bol==='yes') { p.stroke(0); drawGrids(10,xsize,ysize,zsize); }
          p.pop();
          if (legarm==='yes') { p.translate(0,40,0); drawLegs(); }
        }
        function body01() {
          Spid(70); drawArms();
          p.push(); p.translate(0,61,0); p.texture(texs[6]); p.box(140,100,70); p.stroke(0); drawGrids(10,140,100,70); p.pop();
          p.translate(0,40,0); drawLegs();
        }
        function body02() {
          p.push(); p.translate(0,-30,0);
          p.texture(texs[0]); drawEar(55,10,10,100,105,10); drawEar(10,160,10,125,70,10);
          p.translate(126,-40,10); p.sphere(30); p.pop();
          Spid(70); bodyConst(0,78.1,0,140,150,70,'no');
        }
        function body03() {
          p.push(); p.translate(0,-30,0);
          p.texture(texs[traitIndices.textxB]); drawEar(60,10,10,-115,95,10);
          p.texture(texs[2]); drawEar(15,80,10,-150,70,10); p.pop();
          Spid(175);
          p.push(); p.translate(0,85,0); p.texture(texs[6]); p.box(160,155,170); p.stroke(0); drawGrids(10,160,155,170); p.pop();
        }
        function body04() {
          p.push(); p.translate(0,-30,0);
          p.texture(texs[traitIndices.textxB]); drawEar(60,10,10,-115,95,10);
          p.texture(texs[2]); drawEar(15,80,10,-150,70,10); p.pop();
          p.push(); p.translate(0,-30,0);
          p.texture(texs[traitIndices.textxB]); drawEar(28,10,10,100,105,10);
          p.texture(texs[2]); drawEar(25,100,10,105,70,10); p.pop();
          Spid(175); bodyConst(0,80,0,160,155,170,'n0');
        }
        function body05() {
          p.noStroke(); p.fill(col3);
          drawArm(-90,70,50); drawArm(90,70,50);
          bodyConst(0,65,0,120,125,170,'no');
          p.translate(0,40,0); drawLegs();
        }
        function body06() {
          p.push(); p.translate(0,-30,0);
          p.texture(texs[traitIndices.textxB]); drawEar(15,10,10,-70,105,10); drawEar(15,10,10,70,105,10);
          p.texture(texs[2]); drawEar(15,80,10,-85,70,10); drawEar(15,80,10,85,70,10); p.pop();
          bodyConst(0,85,0,120,165,140,'');
        }

        // ── arms & legs ───────────────────────────────────────────────────────
        function drawArms() { p.noStroke(); p.texture(texs[0]); drawArm(-100,50,0); drawArm(100,50,0); }
        function drawArm(x,y,z) { p.push(); p.translate(x,y,z); p.rotateX(p.PI/3); p.cylinder(20,80); p.pop(); }
        function drawLegs() { p.noStroke(); p.texture(texs[0]); drawLeg(-40,120,0); drawLeg(40,120,0); }
        function drawLeg(x,y,z) { p.push(); p.translate(x,y,z); p.rotateX(p.PI/2.5); p.cylinder(20,100); p.pop(); }

        // ── spider / shapes ───────────────────────────────────────────────────
        function drawSpider(bol) {
          p.fill(0); p.stroke(col3); p.strokeWeight(2);
          if (bol==='yes') { drawSpiderLegs(); drawSpiderBody(); }
          if (bol==='no') { shapes(); }
        }
        function drawSpiderLegs() {
          const pos=[[0.5,0.5,0.25,0.25,0.05,0.5],[0.5,0.5,0.75,0.25,0.95,0.5],[0.5,0.5,0.25,0.4,0.05,0.7],[0.5,0.5,0.75,0.4,0.95,0.7],[0.5,0.5,0.25,0.6,0.05,0.9],[0.5,0.5,0.75,0.6,0.95,0.9],[0.5,0.5,0.25,0.75,0.4,0.9],[0.5,0.5,0.75,0.75,0.6,0.9]];
          for (let q of pos) { p.line(q[0]*wid,q[1]*heigh,q[2]*wid,q[3]*heigh); p.line(q[2]*wid,q[3]*heigh,q[4]*wid,q[5]*heigh); }
        }
        function drawSpiderBody() {
          p.ellipse(0.5*wid,0.5*heigh,0.15*wid,0.15*heigh);
          p.fill(255); p.ellipse(0.5*wid-0.04*wid,0.5*heigh-0.025*heigh,0.05*wid,0.05*heigh);
          p.ellipse(0.5*wid+0.04*wid,0.5*heigh-0.025*heigh,0.05*wid,0.05*heigh);
          p.noFill(); p.stroke(255); p.arc(0.5*wid,0.525*heigh,0.075*wid,0.05*heigh,0,p.PI);
        }
        function Spid(depth) {
          p.push(); p.scale(0.5); p.translate(-46,50,depth); drawSpider(); p.pop();
          p.push(); p.scale(0.5); p.fill(col2); p.translate(-46,50,-depth); drawSpider(); p.pop();
        }
        function shapes() {
          p.push(); p.scale(0.5);
          const gs=2, cs=200/gs;
          const sl=['triangle','circle','cross','square'];
          for (let i=0;i<gs;i++) for (let j=0;j<gs;j++) Dconst(sl[i*gs+j],j*cs+cs/2,i*cs+cs/2,cs*0.6);
          p.pop();
        }
        function Dconst(shape,x,y,size) {
          p.strokeWeight(5); p.stroke(0); p.noFill();
          if (shape==='triangle') { const h=(p.sqrt(3)/2)*size; p.beginShape(); p.vertex(x,y-h/2); p.vertex(x-size/2,y+h/2); p.vertex(x+size/2,y+h/2); p.endShape(p.CLOSE); }
          else if (shape==='circle') p.ellipse(x,y,size,size);
          else if (shape==='cross') { p.line(x-size/2,y-size/2,x+size/2,y+size/2); p.line(x+size/2,y-size/2,x-size/2,y+size/2); }
          else if (shape==='square') { p.rectMode(p.CENTER); p.rect(x,y,size,size,10,10); }
        }

        // ── grid & shadow ─────────────────────────────────────────────────────
        function drawGrids(cs,w,h,d) {
          for (let x=-w/2;x<=w/2;x+=cs) for (let y=-h/2;y<=h/2;y+=cs) for (let z=-d/2;z<=d/2;z+=cs) {
            p.push(); p.strokeWeight(0.25); p.translate(x,y,z); p.noFill(); p.stroke(0); p.box(cs); p.pop();
          }
        }
        function drawShadows() {
          p.push(); p.noStroke(); p.rectMode(p.CENTER); p.fill(0,40);
          p.translate(0,200,-150); p.rotateX(180); p.rotateZ(p.sin(p.frameCount*0.02)*0.3);
          p.rect(0,0,150,150); p.pop();
        }

        // ── pyramid ───────────────────────────────────────────────────────────
        function Pyramid() {
          const v=[p.createVector(0,-100,0),p.createVector(-100,100,-100),p.createVector(100,100,-100),p.createVector(100,100,100),p.createVector(-100,100,100)];
          p.beginShape(); p.fill(col2b);
          p.vertex(v[1].x,v[1].y,v[1].z); p.vertex(v[2].x,v[2].y,v[2].z); p.vertex(v[3].x,v[3].y,v[3].z); p.vertex(v[4].x,v[4].y,v[4].z);
          p.endShape(p.CLOSE);
          for (let i=1;i<=4;i++) {
            p.beginShape(); p.fill(col2b);
            p.vertex(v[0].x,v[0].y,v[0].z); p.vertex(v[i].x,v[i].y,v[i].z);
            p.vertex(v[(i%4)+1].x,v[(i%4)+1].y,v[(i%4)+1].z); p.endShape(p.CLOSE);
          }
        }

      }, containerRef.current);
    });

    return () => { if (inst) inst.remove(); };
  }, []);

  const scale = displaySize / CANVAS_SIZE;

  return (
    <div style={{ width: displaySize, height: displaySize, overflow: 'hidden', borderRadius: '50%', flexShrink: 0, ...style }}>
      <div
        ref={containerRef}
        style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: CANVAS_SIZE, height: CANVAS_SIZE, lineHeight: 0 }}
      />
    </div>
  );
}
