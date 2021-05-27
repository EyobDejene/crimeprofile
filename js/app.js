barba.init({
  sync: true,

  transitions: [
    {
      name: 'fade',
      async once({current, next, trigger}) {

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
           .from('.page', {opacity: 0})
           .to('.page', {opacity: 1,  ease: 'power4.in', duration: 2});
        });


      },

      async enter({current, next, trigger}) {


        return new Promise(resolve => {

          const timeline = gsap.timeline({
            onComplete() {
              resolve();
            }
          });

          timeline
            // .from(next.container, {opacity: 0, y: 50})
            // .to(next.container, {opacity: 1, y: 0, ease: 'power4.out', duration: .25});
              .from('.page', {opacity: 0, ease: 'power4.out', duration: 1})
              .to('.page', {opacity: 1, ease: 'power4.in', duration: 2});
        });


      },
      async leave({current, next, trigger}) {
        return new Promise(resolve => {

          const timeline = gsap.timeline({
            onComplete() {
              resolve();

            }
          })

          timeline
              .from('.page', {opacity: 1})
              .to('.page', {opacity: 0, ease: 'power4.out', duration: 1})
              .current.container.remove();
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






