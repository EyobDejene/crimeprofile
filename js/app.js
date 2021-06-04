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
           .to('.page', {opacity: 1,  ease: 'power4.in', duration: 1})
           .from('.page-loader',{opacity:1})
           .to('.page-loader',{opacity:0,ease: 'power4.in', duration: 0})
              .to('.page-loader',{display:'none',ease: 'power4.in', duration: 1})
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
              .to('.page', {opacity: 1, ease: 'power4.in', duration: 1});
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
              //.current.container.remove();
        })
      }
    },
  ],
  debug: true
});



barba.hooks.once((data) => {
  //console.log(data.next.namespace);
  if(data.next.namespace == "analyzer"){
    //runDetection(true);
    recognizer()
  }
});

barba.hooks.enter((data) => {
  //console.log(data.next.namespace);

  if(data.next.namespace == "analyzer"){
   // setTimeout(function() {
   //   runDetection(true);
   // },1000)

    recognizer()

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



let helper = document.querySelectorAll('.helper');
for(let i =0; i < helper.length; i++){
  helper[i].addEventListener('click', notify);
}

let button = document.querySelectorAll('.buttonOptions');
for(let i =0; i < button.length; i++){
  button[i].addEventListener('click', notify);
}




function notify(msg){
  let frame = document.querySelector('.overlay');
  frame.querySelector('p').innerHTML = "";


  if(msg.type == "click"){
    frame.classList.add('manual');
    msg = msg.srcElement.getAttribute('data-msg');


  }else{
    frame.querySelector('.options').classList.add('not-visible');
    frame.classList.add('auto');
  }
  frame.classList.remove('not-visible');
  frame.querySelector('p').innerHTML = msg;
}


function closeNotifyAuto(){
  let frame = document.querySelector('.overlay');
  if(frame.classList.contains('manual') === false){
    frame.classList.remove('manual');
    frame.querySelector('p').innerHTML = "";
    document.querySelector('.overlay').classList.add('not-visible');
  }

  if(frame.classList.contains('auto')){
    frame.classList.remove('auto');
    frame.querySelector('p').innerHTML = "";
    document.querySelector('.overlay').classList.add('not-visible');
  }


}

function closeNotify() {
  let frame = document.querySelector('.overlay');
  if (frame.classList.contains('manual')) {
      frame.classList.remove('manual');
      document.querySelector('.overlay').classList.add('not-visible');
  }
  if (!frame.classList.contains('manual')) {
    document.querySelector('.overlay').classList.add('not-visible');
  }

}



$(window).load(function() {
  $( window ).resize(function() {
    if($('#myChart')) {
      //let width =  $('#myChart').css('width');
      let width = $('#myChart').closest('.content').css('width');
      console.log(width)
      $('#myChart').css('width', '100%');
      $('#myChart').css('height', 'auto');
    }
  });
});


function clickedButton() {
  let frame = document.querySelector('.overlay');
  frame.querySelector('p').innerHTML = "";

  frame.querySelector('.options').classList.remove('not-visible');
  frame.classList.add('manual');
  let msg = msg.srcElement.getAttribute('data-msg');

  frame.classList.remove('not-visible');
  frame.querySelector('p').innerHTML = msg;
}