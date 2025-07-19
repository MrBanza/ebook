const pages = document.querySelectorAll(".page");
let current = 0;
let isAnimating = false; // Prevent multiple clicks during animation

function animatePageChange(oldIndex, newIndex, direction) {
  if (isAnimating || oldIndex === newIndex) return;
  isAnimating = true;

  const oldPage = pages[oldIndex];
  const newPage = pages[newIndex];

  // If going forward (next)
  if (direction === 'next') {
    // Bring new page to front instantly, but keep it rotated back for flip-in
    newPage.style.zIndex = 1;
    newPage.classList.remove("hidden");
    newPage.style.transform = 'rotateY(180deg)'; // Start rotated for 'flip-in'
    newPage.style.opacity = '0';

    // Flip the old page out (this will effectively hide it by rotating away)
    oldPage.style.zIndex = 2; // Ensure old page is on top during its flip
    oldPage.classList.add("flipping-out");

    // After the old page finishes flipping out, hide it and start new page flip-in
    oldPage.addEventListener('transitionend', function handler() {
      oldPage.removeEventListener('transitionend', handler);
      oldPage.classList.add("hidden");
      oldPage.classList.remove("flipping-out");
      oldPage.style.zIndex = 0; // Reset z-index for hidden pages

      // Now flip the new page in
      newPage.classList.add("flipping-in");

      newPage.addEventListener('transitionend', function newPageHandler() {
        newPage.removeEventListener('transitionend', newPageHandler);
        newPage.classList.remove("flipping-in");
        newPage.style.zIndex = 1; // Ensure it stays on top as the current page
        isAnimating = false;
      });
    });
  }
  // If going backward (prev)
  else if (direction === 'prev') {
    // The new page needs to be visible and correctly positioned *before* old page flips back
    newPage.style.zIndex = 1;
    newPage.classList.remove("hidden");
    newPage.style.transform = 'rotateY(0deg)'; // Ensure new page is not rotated
    newPage.style.opacity = '1';

    // Flip the old page (which is currently visible) back to its "hidden" state
    oldPage.style.zIndex = 2; // Ensure old page is on top during its flip
    oldPage.classList.add("flipping-out"); // Use flipping-out to rotate it out of view

    oldPage.addEventListener('transitionend', function handler() {
      oldPage.removeEventListener('transitionend', handler);
      oldPage.classList.add("hidden");
      oldPage.classList.remove("flipping-out");
      oldPage.style.zIndex = 0; // Reset z-index
      isAnimating = false;
    });
  }
}

// Initial setup to display the first page and hide others
function showPage(index) {
  pages.forEach((page, i) => {
    if (i === index) {
      page.classList.remove("hidden");
      page.style.zIndex = 1;
      page.style.transform = 'rotateY(0deg)';
      page.style.opacity = '1';
    } else {
      page.classList.add("hidden");
      page.style.zIndex = 0;
      page.style.transform = 'rotateY(0deg)'; // Reset transform for hidden pages
      page.style.opacity = '0';
    }
  });
}


document.getElementById("prev").onclick = () => {
  if (current > 0 && !isAnimating) {
    const oldIndex = current;
    current--;
    animatePageChange(oldIndex, current, 'prev');
  }
};

document.getElementById("next").onclick = () => {
  if (current < pages.length - 1 && !isAnimating) {
    const oldIndex = current;
    current++;
    animatePageChange(oldIndex, current, 'next');
  }
};

// Call showPage initially to set up the first page
showPage(current);