import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import dynamic from 'next/dynamic'
import React, { useEffect, useState, } from "react"
const inter = Inter({ subsets: ['latin'] })

const Sketch = dynamic(() => import('react-p5').then((mod) => mod.default), {
  ssr: false,
})

export default function Home() {

  let [windowWidth, setWindowWidth] = useState<number>(500)
  let [windowHeight, setWindowHeight] = useState<number>(500)

  let [pixelScale, setPixelScale] = useState<number>(50)
  
  useEffect(() => {
    setWindowWidth(window.innerWidth)
    setWindowHeight(window.innerHeight)

  }, [])

  let movePoint1: boolean = false
  let movePoint2: boolean = false
  let movePoint3: boolean = false
  let width: number = windowWidth
  let height: number = 1080
  let point1x: number = 8
  let point1y: number = 10
  let point2x: number = 18.81
  let point2y: number = 10
  let point3x: number =  10
  let point3y: number = 14
  let selectRadius: number = 30
  let increase: boolean = false
  let showBubbles: boolean = true
  let A: number, B: number, C: number, a: number, b: number, c: number

  const randomise = () => {
    showBubbles = false

    point1x = Number((Math.random() * (8 - 0.5 + 1) + 0.5).toFixed(2))
    point1y = Number((Math.random() * (8 - 0.5 + 1) + 0.5).toFixed(2))
    point2x = Number((Math.random() * (8 - 0.5 + 1) + 0.5).toFixed(2))
    point2y = Number((Math.random() * (8 - 0.5 + 1) + 0.5).toFixed(2))
    point3x = Number((Math.random() * (8 - 0.5 + 1) + 0.5).toFixed(2))
    point3y = Number((Math.random() * (8 - 0.5 + 1) + 0.5).toFixed(2))

    let valuesToShow = Math.round(Math.random() * 3)

    interface Case {
      sideA: boolean;
      sideB: boolean;
      sideC: boolean;
      angleA: boolean;
      angleB: boolean;
      angleC: boolean;
    }
    

    const cases: Record<number, Case> = {
      0: { sideA: true, sideB: false, sideC: false, angleA: true, angleB: false, angleC: true },
      1: { sideA: false, sideB: false, sideC: true, angleA: true, angleB: true, angleC: false },
      2: { sideA: false, sideB: true, sideC: false, angleA: true, angleB: false, angleC: true },
      3: { sideA: false, sideB: true, sideC: false, angleA: false, angleB: true, angleC: true },
    };
    

    const currentCase = cases[valuesToShow];
    if (currentCase) {
      for (const key in currentCase) {
        const element: HTMLInputElement | null = document.getElementById(`hide${key}`) as HTMLInputElement;
        if (element) {
          element.checked = currentCase[key as keyof Case];
        }
      }
      
    }
  }

  const setup = (p5: any, canvasParentRef: any) => {
    p5.createCanvas(width, height).parent(canvasParentRef)
    p5.stroke('#000000')

  };

  const draw = (p5: any) => {

    a = p5.dist(point1x, point1y, point3x, point3y)
    b = p5.dist(point1x, point1y, point2x, point2y)
    c = p5.dist(point2x, point2y, point3x, point3y)

    C = Math.acos((Math.pow(a, 2) + Math.pow(b, 2) - Math.pow(c, 2)) / (2 * a * b))
    B = Math.acos((Math.pow(a, 2) + Math.pow(c, 2) - Math.pow(b, 2)) / (2 * a * c))
    A = Math.acos((Math.pow(b, 2) + Math.pow(c, 2) - Math.pow(a, 2)) / (2 * b * c))
    let area: number = Number((0.5 * a * b * Math.sin(C)).toFixed(2))



    p5.background('#fff');
    p5.stroke('black')
    p5.translate(0, height)
    p5.scale(1, -1)
    p5.strokeWeight(4)
    p5.noFill()
    p5.triangle(point1x * pixelScale, point1y * pixelScale, point2x * pixelScale, point2y * pixelScale, point3x * pixelScale, point3y * pixelScale)

    p5.strokeWeight(6)
    p5.stroke('#303030')
    p5.rect(0, 0, width, height)
    
    p5.strokeWeight(3)
    p5.stroke('#000')
    // corner bubbles
    if (increase == true) selectRadius += 0.2;
    if (increase == false) selectRadius -= 0.2;
    if (selectRadius >= 30) increase = false;
    if (selectRadius <= 20) increase = true;
    if (showBubbles == true) {
      p5.ellipse(point1x * pixelScale, point1y * pixelScale, selectRadius)
      p5.ellipse(point2x * pixelScale, point2y * pixelScale, selectRadius)
      p5.ellipse(point3x * pixelScale, point3y * pixelScale, selectRadius)


      p5.push()
      p5.scale(1, -1); // reverse the global flip
      p5.strokeWeight(1);
      p5.textStyle(p5.BOLD)
      p5.textSize(17);
      p5.noStroke()
      p5.fill('#000')
      p5.text('Click to drag', (point3x * pixelScale) - 50, -(point3y * pixelScale) - 25)
      p5.pop()



    }

    p5.push();
    p5.scale(1, -1); // reverse the global flip
    p5.strokeWeight(1);
    p5.textStyle(p5.BOLD)

    p5.textSize(17);
    p5.noStroke()

    p5.fill('#ec9c33') // side text color
    if (!((document.getElementById('hideSideA') as HTMLInputElement)?.checked == true))
      p5.text(`a: ${parseFloat(p5.dist(point1x, point1y, point3x, point3y).toFixed(2))}`, ((point3x * pixelScale + point1x * pixelScale) / 2), -(((point3y * pixelScale + point1y * pixelScale) / 2)));

    if (!((document.getElementById('hideSideB') as HTMLInputElement)?.checked == true)) p5.text(`b: ${parseFloat(p5.dist(point1x, point1y, point2x, point2y).toFixed(2))}`, ((point1x * pixelScale + point2x * pixelScale) / 2), -(((point1y * pixelScale + point2y * pixelScale) / 2)));

    if (!((document.getElementById('hideSideC') as HTMLInputElement)?.checked == true)) p5.text(`c ${parseFloat(p5.dist(point2x, point2y, point3x, point3y).toFixed(2))}`, ((point2x * pixelScale + point3x * pixelScale) / 2), -(((point2y * pixelScale + point3y * pixelScale) / 2)));

    p5.fill('#ec3333')  // angle text color

    if (!((document.getElementById('hideAngleA') as HTMLInputElement)?.checked == true))
     p5.text(`A: ${(((document.getElementById('degrees') as HTMLInputElement)?.checked) ? A * (180 / Math.PI) : A).toFixed(2)}`, (point2x * pixelScale), -(point2y * pixelScale));

    if (!((document.getElementById('hideAngleB') as HTMLInputElement)?.checked == true)) p5.text(`B : ${(((document.getElementById('degrees') as HTMLInputElement)?.checked) ? B * (180 / Math.PI) : B).toFixed(2)}`, (point3x * pixelScale), -(point3y * pixelScale));

    if (!((document.getElementById('hideAngleC') as HTMLInputElement)?.checked == true)) p5.text(`C: ${(((document.getElementById('degrees') as HTMLInputElement)?.checked) ? C * (180 / Math.PI) : C).toFixed(2)}`, (point1x * pixelScale), -(point1y * pixelScale));


    p5.text(`Area: ${area}`, 50, -1000)
    p5.pop();
      for (var x = 0; x < width / pixelScale; x++) {
        p5.strokeWeight(0.1)
        p5.line(x * pixelScale, 0, x * pixelScale, height)
        p5.strokeWeight(0.1)
        p5.line(0, x * pixelScale, width, x * pixelScale)
      }
  };

  const mousePressed = (p5: any) => {

    if (p5.mouseX >= point1x * pixelScale - 15 &&
      p5.mouseX <= point1x * pixelScale + 15 &&
      p5.mouseY >= height - point1y * pixelScale - 15 &&
      p5.mouseY <= height - point1y * pixelScale + 15) {
      movePoint1 = true
    } else if (p5.mouseX >= point2x * pixelScale - 15 &&
      p5.mouseX <= point2x * pixelScale + 15 &&
      p5.mouseY >= height - point2y * pixelScale - 15 &&
      p5.mouseY <= height - point2y * pixelScale + 15) {
      movePoint2 = true
    } else if (p5.mouseX >= point3x * pixelScale - 15 &&
      p5.mouseX <= point3x * pixelScale + 15 &&
      p5.mouseY >= height - point3y * pixelScale - 15 &&
      p5.mouseY <= height - point3y * pixelScale + 15) {
      movePoint3 = true
    }
  }

  const mouseDragged = (p5: any): void => {
    if (movePoint1 == true && p5.mouseY < width - 20 && p5.mouseY > 20 && p5.mouseX < width - 20 && p5.mouseX > 20) {
      point1x = p5.mouseX / pixelScale
      point1y = (height - p5.mouseY) / pixelScale
      showBubbles = false

    } else if (movePoint2 == true && p5.mouseY < width - 20 && p5.mouseY > 20 && p5.mouseX < width - 20 && p5.mouseX > 20) {
      point2x = p5.mouseX / pixelScale
      point2y = (height - p5.mouseY) / pixelScale
      showBubbles = false

    } else if (movePoint3 == true && p5.mouseY < width - 20 && p5.mouseY > 20 && p5.mouseX < width - 20 && p5.mouseX > 20) {
      point3x = p5.mouseX / pixelScale
      point3y = (height - p5.mouseY) / pixelScale
      showBubbles = false

    }
  }

  const mouseReleased = (): void => {
    movePoint1 = false
    movePoint2 = false
    movePoint3 = false
  }

  const windowResized = (p5: any): void => {
    setWindowWidth(window.innerWidth)
    //setWindowHeight(window.innerHeight)
    p5.resizeCanvas(window.innerWidth, height);
  }

  return (
    <>
      <Head>
        <title>Trigonometry Calculator</title>
        <meta name="description" content="Trigonometry Calculator" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
      <>
    <br></br>
    <div className={styles['p5-container']} >


        <>
          <div className={styles['p5-options']} style={{ width: width }}>
            <div className={styles['misc-options']}>
              <div className={styles['checkbox-container']}>
                <div>Degrees</div>
                <div>
                  <input className={styles['input-switch']} type="checkbox" id="degrees" />
                  <label className={styles['input-switch-label']} htmlFor="degrees">Toggle</label>
                </div>
              </div>
            </div>
            <div className={styles['selections-container']} id='angle-container'>
              <div className={styles['checkbox-container']}>
                <div>Hide angle A</div>
                <input className={styles['input-switch']} type="checkbox" id="hideAngleA" />
                <label className={styles['input-switch-label']} htmlFor="hideAngleA">Toggle</label>
              </div>
              <div className={styles['checkbox-container']}>
                <div>Hide angle B</div>
                <input className={styles['input-switch']} type="checkbox" id="hideAngleB" />
                <label className={styles['input-switch-label']} htmlFor="hideAngleB">Toggle</label>
              </div>
              <div className={styles['checkbox-container']}>
                <div>Hide angle C</div>
                <input className={styles['input-switch']} type="checkbox" id="hideAngleC" />
                <label className={styles['input-switch-label']} htmlFor="hideAngleC">Toggle</label>
              </div>

            </div>
            <div className={styles['selections-container']} id='side-container'>

              <div className={styles['checkbox-container']}>
                <div>Hide side A</div>
                <input className={styles['input-switch']} type="checkbox" id="hideSideA" />
                <label className={styles['input-switch-label']} htmlFor="hideSideA">Toggle</label>
              </div>
              <div className={styles['checkbox-container']}>
                <div>Hide side B</div>
                <input className={styles['input-switch']} type="checkbox" id="hideSideB" />
                <label className={styles['input-switch-label']} htmlFor="hideSideB">Toggle</label>
              </div>
              <div className={styles['checkbox-container']}>
                <div>Hide side C</div>
                <input className={styles['input-switch']} type="checkbox" id="hideSideC" />
                <label className={styles['input-switch-label']} htmlFor="hideSideC">Toggle</label>
              </div>

            </div>


          </div>
        </>

      <span id={styles[`custom-triangle`]}>
        <Sketch
          setup={setup}
          draw={draw}
          windowResized={windowResized}
          mousePressed={mousePressed}
          mouseDragged={mouseDragged}
          mouseReleased={mouseReleased} /></span>
    </div>
    <br></br></>
      </main>
    </>
  )
}
