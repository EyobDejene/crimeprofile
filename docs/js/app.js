barba.init({
  transitions: [
    {
      name: 'fade',
      once({current, next, trigger}) {

        return new Promise(resolve => {


          const timeline = gsap.timeline({
            onComplete() {
              resolve();

            }
          });

          timeline
            // .set('nav a', {opacity: 0, y: '-100%'})
            // .set('.github-button-section', {opacity: 0, y: '-100%'})

            // .to('nav a', {opacity: 1, stagger: .1, y: '0%', delay: .15}, 0)
            // .to('.github-button-section', {opacity: 1, y: '0%', duration: 1}, 0)
            .to('.page', {opacity: 1});
        });


      },

      enter({current, next, trigger}) {


        return new Promise(resolve => {

          const timeline = gsap.timeline({
            onComplete() {
              resolve();
            }
          });

          timeline
            // .from(next.container, {opacity: 0, y: 50})
            // .to(next.container, {opacity: 1, y: 0, ease: 'power4.out', duration: .25});
              .to('.page', {opacity: 1});
        });


      },
      leave({current, next, trigger}) {
        return new Promise(resolve => {

          const timeline = gsap.timeline({
            onComplete() {
              resolve();
              current.container.remove();
            }
          })

          timeline
            // .to(current.container, {opacity: 0, y: 50});
              .set('.page', {opacity: 0})
        })
      }
    },
  ],
  debug: true
});



barba.hooks.once((data) => {
  //console.log(data.next.namespace);
  if(data.next.namespace == "analyzer"){
    runDetection(true);
  }
});

barba.hooks.enter((data) => {
  //console.log(data.next.namespace);
  if(data.next.namespace == "analyzer"){
    runDetection(true);
  }
});



barba.hooks.leave((data) => {
  console.log("leave " + data.current.namespace);
  if(data.current.namespace == "analyzer"){
    let id = window.setInterval(() => {}, 0);
    console.log(id);
    while (id) {
      window.clearInterval(id);
      id--;
    }

    console.log('disable camera ');

  }
});




