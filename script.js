const pages = document.querySelectorAll(".page");
let current = 0;

function showPage(index) {
  pages.forEach((page, i) => {
    page.style.zIndex = i === index ? 1 : 0;
    page.classList.toggle("hidden", i !== index);
  });
}

document.getElementById("prev").onclick = () => {
  if (current > 0) current--;
  showPage(current);
};

document.getElementById("next").onclick = () => {
  if (current < pages.length - 1) current++;
  showPage(current);
};

showPage(current);
