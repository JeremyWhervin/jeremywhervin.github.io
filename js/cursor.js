const coords = { x: 0, y: 0 };
const circles = document.querySelectorAll(".circle");

const colors = [
    "#FFA500",
    "#FFA200",
    "#FF9E00",
    "#FF9B00",
    "#FF9700",
    "#FF9400",
    "#FF9000",
    "#FF8D00",
    "#FF8900",
    "#FF8600",
    "#FF8200",
    "#FF7F00",
    "#FF7B00",
    "#FF7800",
    "#FF7400",
    "#FF7000",
    "#FF6D00",
    "#FF6900",
    "#FF6600",
    "#FF6200",
    "#FF5F00",
    "#FF5B00"
];

circles.forEach(function (circle, index) {
  circle.x = 0;
  circle.y = 0;
  circle.style.backgroundColor = colors[index % colors.length];
});

window.addEventListener("mousemove", function(e){
  coords.x = e.clientX;
  coords.y = e.clientY;
  
});

function animateCircles() {
  
  let x = coords.x;
  let y = coords.y;
  
  circles.forEach(function (circle, index) {
    circle.style.left = x - 12 + "px";
    circle.style.top = y - 12 + "px";
    
    circle.style.scale = (circles.length - index) / circles.length;
    
    circle.x = x;
    circle.y = y;

    const nextCircle = circles[index + 1] || circles[0];
    x += (nextCircle.x - x) * 0.3;
    y += (nextCircle.y - y) * 0.3;
  });
 
  requestAnimationFrame(animateCircles);
}

animateCircles();
