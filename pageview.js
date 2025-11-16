(function(){
  document.addEventListener('DOMContentLoaded', () => {
    console.log('pageview: DOMContentLoaded');
    const track = document.querySelector('.page-track');
    if(!track){ console.warn('pageview: .page-track not found'); return; }
    const dots = Array.from(document.querySelectorAll('.page-dots .dot'));
    const pageEls = Array.from(track.querySelectorAll('.page'));
    const pages = pageEls.length;
    let index = 0;
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let dragging = false;
    let isSwipingHorizontal = false;
    // threshold in pixels to consider a swipe
    const threshold = 50; // px

  function setIndex(i){
    index = Math.max(0, Math.min(pages-1, i));
    // hide all pages, show active
    pageEls.forEach((p, idx) => {
      p.classList.toggle('active', idx === index);
    });
    dots.forEach(d=>d.classList.toggle('active', Number(d.dataset.index)===index));
  }

    function onPointerDown(e){
      dragging = true;
      isSwipingHorizontal = false;
      startX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      startY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
    }

    function onPointerMove(e){
      if(!dragging) return;
      currentX = e.clientX || (e.touches && e.touches[0].clientX) || currentX;
      const currentY = e.clientY || (e.touches && e.touches[0].clientY) || startY;
      const dx = currentX - startX;
      const dy = currentY - startY;
      // determine if user is performing a horizontal swipe
      if(!isSwipingHorizontal){
        if(Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy)){
          isSwipingHorizontal = true;
        }
      }
      // if horizontal swipe, prevent vertical scroll
      if(isSwipingHorizontal && e.cancelable){
        e.preventDefault();
      }
    }

    function onPointerUp(e){
      if(!dragging) return;
      dragging = false;
      const endX = e.clientX || (e.changedTouches && e.changedTouches[0].clientX) || startX;
      const dx = endX - startX;
      if(Math.abs(dx) > threshold){
        if(dx < 0) setIndex(index + 1);
        else setIndex(index - 1);
      }
      isSwipingHorizontal = false;
    }

  // pointer/touch events (simple start/end swipe)
    // pointer events (mouse/pen)
    track.addEventListener('pointerdown', onPointerDown, {passive:true});
    window.addEventListener('pointerup', onPointerUp, {passive:true});
    window.addEventListener('pointermove', onPointerMove, {passive:true});

    // touch events (mobile) - allow preventDefault on move to block vertical scroll when swiping
    track.addEventListener('touchstart', onPointerDown, {passive:true});
    window.addEventListener('touchend', onPointerUp, {passive:true});
    // touchmove must be non-passive to allow preventDefault
    window.addEventListener('touchmove', onPointerMove, {passive:false});

  // dots
  dots.forEach(d=> d.addEventListener('click', ()=> setIndex(Number(d.dataset.index)) ));

    // init
    setIndex(0);

    // Desktop Prev/Next buttons
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    if(prevBtn) prevBtn.addEventListener('click', ()=> setIndex(index - 1));
    if(nextBtn) nextBtn.addEventListener('click', ()=> setIndex(index + 1));

    // expose API for debugging
    window.__pageView = { setIndex };
  });
})();
