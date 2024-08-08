function generateRandomColor() {
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#F333FF', '#FF33A8', '#33FFF0'];
    return colors[Math.floor(Math.random() * colors.length)];
}