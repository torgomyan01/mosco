const {
  active,
  none,
  all,
  one,
  show
} = {
  active: 'active',
  none: 'd-none',
  one: 'one',
  all: 'all',
  show: 'show'
}

AOS.init();


function BodyOverflow(status){
    if(status){
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
}

function $(className) {
  return document.querySelectorAll(className)
}

function $elem(className) {
  return document.querySelector(className)
}

const titleAnimation = $('.title-animation');

titleAnimation.forEach((item) => {
  const arr = item.dataset.titles.split(',');
  let index = 0;
  PrintItemsAnim(arr[index].split(''), item);

  setInterval(() => {
    index += 1;
    const strArray = arr[index].split('');

    PrintItemsAnim(strArray, item);

    if (index === arr.length - 1) {
      index = 0
    }
  }, 6000)
})

function PrintItemsAnim(array, elem, count = 7) {

  if(count === 7){

    const reversArray = [];

    const newArr = Array.from({length: 7}).map((letter, i) =>  {
      if(array[i]){
        return array[i];
      } else {
        reversArray.push('')
      }
    }).filter((e) => e)

    newArr.forEach((l) => {
      reversArray.push(l)
    })


    elem.innerHTML = '';
    reversArray.forEach((i) => {
        const span = `<span style="--letter: '${i}'"></span>`
        elem.insertAdjacentHTML('beforeend', span)
    })
  } else {
    array.forEach((letter) => {
      const span = `<span style="--letter: '${letter}'"></span>`
      elem.insertAdjacentHTML('beforeend', span)
    })
  }

}

const icons = document.querySelectorAll('.content-item');

icons.forEach((icon, index) => {
  icon.addEventListener('mouseover', () => {
    for (let i = 0; i <= index; i++) {
      icons[i].querySelector('.checkboxIcon').classList.remove('icon-Frame-393');
      icons[i].querySelector('.checkboxIcon').classList.add('icon-Frame-394');
    }
  });

  icon.addEventListener('mouseout', () => {
    for (let i = 0; i <= index; i++) {
      icons[i].querySelector('.checkboxIcon').classList.remove('icon-Frame-394');
      icons[i].querySelector('.checkboxIcon').classList.add('icon-Frame-393');
    }
  });
});


paper.install(window);

const canvasMenu = $elem('#CanvasMenu');

window.onload = function () {
  paper.setup('CanvasMenu');

  const burgerIcon = document.getElementById('burgerIcon');
  const menu = document.querySelector('.menu');
  const menuColumns = $('.menu-column');
  let menuTimeout = 0;
  let animatedButton;

  let bg_points = 8;
  let bg_color = '#dbdee9';
  let strokeColor = '#354787';
  let strokeWidth = 1;
  let burgerHoverColor = '#354787';


  class CAnimates {

    // быстр + прыжки мячика
    easeOutBounce(t) {
      const n1 = 7.5625;
      const d1 = 2.75;

      if (t < 1 / d1) {
        return n1 * t * t;
      } else if (t < 2 / d1) {
        return n1 * (t -= 1.5 / d1) * t + 0.75;
      } else if (t < 2.5 / d1) {
        return n1 * (t -= 2.25 / d1) * t + 0.9375;
      } else {
        return n1 * (t -= 2.625 / d1) * t + 0.984375;
      }
    }

    // замедление медленное ^2
    easeOutQuad(t) {
      return 1 - (1 - t) * (1 - t);
    }

    // замедление среднее ^3
    easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
      ;
    }

    // замедление быстрое ^5
    easeOutQuint(t) {
      return 1 - Math.pow(1 - t, 5);
    }

    // ускорение среднее ^3
    easeInCubic(t) {
      return t * t * t;
    }

    // плавный замах
    easeInBack(t) {
      const c1 = 1.70158;
      const c3 = c1 + 1;
      return c3 * t * t * t - c1 * t * t;
    }

    // резкий замах и быстрое движение
    easeOutElastic(t) {
      const p = 0.3;
      return Math.pow(2, -10 * t) * Math.sin((t - p / 4) * (2 * Math.PI) / p) + 1;
    }

    // перелёт
    easeOutBack(t) {
      const c1 = 1.70158;
      const c3 = c1 + 1;
      return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    }

    // плавный замах и плавный перелет
    easeInOutBack(t) {
      const c1 = 1.70158;
      const c2 = c1 * 1.525;
      return t < 0.5
        ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
        : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
    }
  }

  class CAnimatedButton {
    constructor(id, label, center, startRadius, finishRadius, numPoints, _color) {
      this.id = id;
      this.ani = new CAnimates();
      this.color = _color;
      this.center = center;
      this.startRadius = startRadius;
      this.finishRadius = finishRadius;
      this.maxOutpaintRadius = finishRadius / 4;
      this.numPoints = numPoints;
      this.burger_circle = new Path();
      this.isAnimating = false;
      this.isExpanded = false;
      this.isHovering = false;

      this.isHover = false;
      this.isUnhover = false;

      this.animationProgress = 0;
      this.animationDurationExpand = 900; // ms
      this.animationDurationCollapse = 800; // ms
      this.hoverAnimationDuration = 150; // ms
      this.hoveringAnimationDuration = 500; // ms
      this.hoveringAnimationDirectionExpand = true;

      this.menuShowing = false;

      this.initialPoints = [];
      this.animationStartPoints = [];
      this.currentPoints = [];

      this.initButton();
      this.lastFrameTime = 0;
    }

    initButton() {
      for (let i = 0; i < this.numPoints; i++) {
        let angle = (i / this.numPoints) * Math.PI * 2;
        let point = new Point(
          this.center.x + Math.cos(angle) * this.startRadius * 0.01,
          this.center.y + Math.sin(angle) * this.startRadius * 0.01
        );
        let point_hover = new Point(
          this.center.x + Math.cos(angle) * this.startRadius,
          this.center.y + Math.sin(angle) * this.startRadius
        );
        this.burger_circle.add(point);
        this.initialPoints.push(point_hover);
        this.currentPoints.push(this.center.clone());
      }
      this.burger_circle.closed = true;
      this.burger_circle.fillColor = this.color;
      this.burger_circle.strokeWidth = strokeWidth;
      this.burger_circle.strokeColor = strokeColor;
      this.burger_circle.smooth({type: 'continuous'});
    }

    startAnimation() {
      console.log("START")

      if (this.isAnimating) {
        this.isExpanded = !this.isExpanded;
        if (this.isExpanded) {
          resetMenuColumns();
        } else {
          animateMenuColumns();
        }
      }
      this.fillAnimationStartPoints();
      this.isAnimating = true;
      this.isUnhover = false;
      this.isHover = false;
      this.animationProgress = 0;
      this.lastFrameTime = Date.now();
      // fillAnimationEndPoints(this.isExpanded ? this.finishRadius : this.finishRadius);
    }

    fillAnimationStartPoints() {
      this.animationStartPoints = this.currentPoints.map(point => point.clone());
    }

    // fillAnimationEndPoints(targetRadius) {
    //     this.animationEndPoints = this.currentPoints.map(point => point.clone());
    //     for(let index=0;index<numPoints;index++) {
    //         this.animationEndPoints[index] = this.getPointByRadius(targetRadius, index);
    //     });
    // }

    getRadiusByPoint(point) {
      return Math.sqrt(Math.pow(point.x - this.center.x, 2) + Math.pow(point.y - this.center.y, 2));
    }

    getPointByRadius(r, index) {
      let angle = (index / this.numPoints) * Math.PI * 2;
      return new Point(
        this.center.x + Math.cos(angle) * r,
        this.center.y + Math.sin(angle) * r
      );
    }

    animate(deltaTime) {
      if (this.isAnimating) {
        const duration = !this.isExpanded ? this.animationDurationExpand : this.animationDurationCollapse;
        this.animationProgress += deltaTime;

        let t = Math.min(this.animationProgress / duration, 1);

        let collapseAnim = !this.isExpanded ? this.ani.easeOutQuint(t) : this.ani.easeOutQuint(t); // easeOutCubic

        let easedT = !this.isExpanded ? t : collapseAnim;

        this.burger_circle.segments.forEach((segment, index) => {
          let currentPoint = this.currentPoints[index];
          let newPoint;

          if (!this.isExpanded) {
            let currentRadius = currentPoint.getDistance(this.center);
            let idealRadius = this.startRadius + easedT * (this.finishRadius - this.startRadius);
            let maxRadius = idealRadius + this.maxOutpaintRadius;

            let randomOffset = Math.random() * (this.finishRadius - this.startRadius) / duration * deltaTime * 1.4;
            currentRadius += randomOffset
            currentRadius = Math.max(currentRadius, idealRadius)
            let newRadius = Math.min(currentRadius + randomOffset, maxRadius);

            let angle = (index / this.numPoints) * Math.PI * 2;
            newPoint = new Point(
              this.center.x + Math.cos(angle) * newRadius,
              this.center.y + Math.sin(angle) * newRadius
            );
          } else {
            let initialPoint = this.initialPoints[index];
            let startPoint = this.animationStartPoints[index];

            newPoint = new Point(
              startPoint.x + (initialPoint.x - startPoint.x) * easedT,
              startPoint.y + (initialPoint.y - startPoint.y) * easedT
            );
          }

          segment.point = newPoint;
          this.currentPoints[index] = newPoint;
        });

        this.burger_circle.smooth({type: 'continuous'});

        if (!this.menuShowing) {
          if (!this.isExpanded && this.animationProgress >= duration / 3) {
            this.menuShowing = true;
            animateMenuColumns();
          } else if (this.isExpanded && this.animationProgress >= duration / 15) {
            this.menuShowing = true;
            resetMenuColumns();
          }
        }

        if (this.animationProgress >= duration) {
          console.log("FINISH")

          if (!this.isExpanded) {
            let pixels = "";
            this.burger_circle.segments.forEach((segment, index) => {
              let currentPoint = this.currentPoints[index].clone();
              let currentRadius = this.getRadiusByPoint(currentPoint);
              pixels += currentRadius + " ";
            })
            // alert(pixels)
          }
          this.isAnimating = false;
          this.animationProgress = 0;
          this.isExpanded = !this.isExpanded;
          this.menuShowing = false;
        }
      } else if (this.isHovering && !this.isExpanded) {
        this.animationProgress += deltaTime;

        const t = (Math.sin(this.animationProgress / this.hoveringAnimationDuration * Math.PI * 2) + 1) / 2;

        this.burger_circle.segments.forEach((segment, index) => {

          let currentPoint = this.currentPoints[index].clone();
          let currentRadius = this.getRadiusByPoint(currentPoint);

          let randomOffset = (this.hoveringAnimationDirectionExpand ? 1 : -1) * Math.random() * 0.5;
          let newRadius = Math.max(currentRadius + randomOffset, this.startRadius * 1);
          let newPoint = this.getPointByRadius(newRadius, index);

          segment.point = newPoint.clone();
          this.currentPoints[index] = newPoint;

        });

        this.burger_circle.smooth({type: 'continuous'});

        if (this.animationProgress >= this.hoveringAnimationDuration) {
          // console.log("FINISH HOVERING")
          this.animationProgress = 0;
          this.hoveringAnimationDirectionExpand = !this.hoveringAnimationDirectionExpand;
        }
      }
    }

    animateHover(deltaTime) {
      const progress = Math.min(this.animationProgress + deltaTime, this.hoverAnimationDuration);
      if (this.animationProgress === 0) {
        console.log((this.isUnhover ? "UN" : "") + "HOVER START")
      }
      if (progress === this.hoverAnimationDuration) {
        if (this.isUnhover) {
          console.log("UNHOVER FINISH")

          // удаление кнопки
          this.id = null;
          this.burger_circle.remove();
        } else {
          console.log("HOVER FINISH");
          this.lastFrameTime = Date.now();
          this.animationProgress = 0;
          this.isHover = false;
          this.isHovering = true;
          return;
        }

      }
      // const t = this.ani.easeOutQuint(progress / this.hoverAnimationDuration);
      // определяем направление анимации
      const t = this.isUnhover ? (1 - progress / this.hoverAnimationDuration) : (progress / this.hoverAnimationDuration);

      this.burger_circle.segments.forEach((segment, index) => {
        let newRadius = this.startRadius * t;
        let newPoint = this.getPointByRadius(newRadius, index);
        segment.point = newPoint.clone();
        this.currentPoints[index] = newPoint;
      });

      this.burger_circle.smooth({type: 'continuous'});

      this.animationProgress = progress;
    }
  }

  function createAnimatedButton() {
    const burgerRect = burgerIcon.getBoundingClientRect();
    const centerX = burgerRect.left + burgerRect.width / 2;
    const centerY = burgerRect.top + burgerRect.height / 2;
    const startRadius = burgerRect.width / 1.4;
    // const maxRadius = Math.max(view.size.width, view.size.height) * 2.1;

    maxRadius = Math.sqrt(view.size.width * view.size.width + view.size.height * view.size.height);
    animatedButton = new CAnimatedButton('main', "", new Point(centerX, centerY), startRadius, maxRadius, bg_points, bg_color);
    return animatedButton;
  }

  function animateMenuColumns() {
    clearTimeout(menuTimeout);
    menu.classList.add(show);

      canvasMenu.style.zIndex = '2';
      burgerIcon.classList.add(show);
      BodyOverflow(true);
    Array.from(menuColumns).forEach((column, index) => {
      setTimeout(() => {
        column.classList.add(show);
      }, index * 100); // 250ms delay between each column
    });
  }

  function resetMenuColumns() {
      canvasMenu.style.zIndex = '-1';
      burgerIcon.classList.remove(show);
      BodyOverflow(false);
    Array.from(menuColumns).forEach(column => {
      column.classList.remove('show');

    });
    menuTimeout = setTimeout(() => {
      menu.classList.remove('show')
    }, 200)
  }


  function onBurgerHover() {
    // console.log(!animatedButton, (animatedButton ? !animatedButton.id : null));
    if (!animatedButton || animatedButton && !animatedButton.id) {
      animatedButton = createAnimatedButton();
      animatedButton.isHover = true;
      animatedButton.lastFrameTime = Date.now();
    }
  }

  function onBurgerLeave() {
    if (animatedButton && animatedButton.id && !animatedButton.isExpanded && !animatedButton.isAnimating) {
      animatedButton.isHovering = false;
      animatedButton.isHover = false;
      animatedButton.isUnhover = true;
      animatedButton.lastFrameTime = Date.now();
      animatedButton.animationProgress = 0;
    }
  }

  function onBurgerClick() {
    if (animatedButton && animatedButton.id) {
      animatedButton.startAnimation();
    }
  }

  burgerIcon.addEventListener('mouseenter', onBurgerHover);
  burgerIcon.addEventListener('mouseleave', onBurgerLeave);
  burgerIcon.addEventListener('click', onBurgerClick);


  view.onFrame = function (event) {

    if (animatedButton && animatedButton.id) {

      const currentTime = Date.now();
      const deltaTime = currentTime - animatedButton.lastFrameTime;
      animatedButton.lastFrameTime = currentTime;

      if (!animatedButton.isExpanded && (animatedButton.isHover || animatedButton.isUnhover) && animatedButton.animationProgress < animatedButton.hoverAnimationDuration) {
        animatedButton.animateHover(deltaTime);
      } else {
        animatedButton.animate(deltaTime);
      }
    }
  }
}
