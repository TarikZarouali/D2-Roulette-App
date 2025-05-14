    // Canvas setup
    const canvas = document.getElementById("wheel");
    const ctx = canvas.getContext("2d");
    const selected = document.getElementById("selected");
    const spinButton = document.getElementById("spinButton");
    const muteButton = document.getElementById("muteButton");
    const spinSound = document.getElementById("spinSound");
    const winSound = document.getElementById("winSound");
    const starsContainer = document.getElementById("stars");
    const particlesContainer = document.getElementById("particles");

    let isMuted = false;
    let isSpinning = false;

    // Destiny 2 activities
    const activities = [
        "GRANDMASTER NIGHTFALL",
        "LAST WISH RAID",
        "DEEP STONE CRYPT",
        "PROPHECY DUNGEON",
        "GRASP OF AVARICE",
        "DUALITY DUNGEON",
        "LEGEND LOST SECTOR",
        "Vault of Glass",
        "Crota's End",
        "King's Fall",
        "Garden of Salvation",
        "Vow of the Disciple",
        "Root of Nightmares",
        "Salvation's Edge",
        "Warlord's Ruin",
        "Ghost of the Deep",
        "Spire of the Watcher",
        "Sundered Doctrine",
        "Shattered Throne",
        "Vespers Host"
        ];

    // Colors matching Destiny 2 theme
    const colors = [
      "#4ea8de", "#72efdd", "#9d4edd", "#f8961e", "#00ffff",
      "#4ea8de", "#72efdd", "#9d4edd", "#f8961e", "#00ffff",
      "#4ea8de", "#72efdd", "#9d4edd", "#f8961e", "#00ffff",
      "#4ea8de", "#72efdd", "#9d4edd", "#f8961e", "#00ffff"
    ];

    const segmentCount = activities.length;
    const anglePerSegment = (2 * Math.PI) / segmentCount;
    let currentRotation = 0;

    // Create stars for background
    function createStars() {
      for (let i = 0; i < 200; i++) {
        const star = document.createElement("div");
        star.classList.add("star");
        star.style.width = `${Math.random() * 3}px`;
        star.style.height = star.style.width;
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.setProperty("--duration", `${Math.random() * 5 + 3}s`);
        star.style.setProperty("--opacity", `${Math.random() * 0.7 + 0.3}`);
        starsContainer.appendChild(star);
      }
    }

    // Draw the wheel
    function drawWheel() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      
      // Draw outer glow
      const gradient = ctx.createRadialGradient(300, 300, 120, 300, 300, 300);
      gradient.addColorStop(0, "rgba(0, 255, 255, 0.3)");
      gradient.addColorStop(1, "rgba(0, 255, 255, 0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(300, 300, 300, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw segments
      for (let i = 0; i < segmentCount; i++) {
        const startAngle = i * anglePerSegment;
        const endAngle = startAngle + anglePerSegment;
        
        // Draw segment
        ctx.beginPath();
        ctx.moveTo(300, 300);
        ctx.arc(300, 300, 290, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = colors[i];
        ctx.fill();
        
        // Add segment border
        ctx.strokeStyle = "rgba(0, 0, 0, 0.3)";
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Add text
        ctx.save();
        ctx.translate(300, 300);
        ctx.rotate(startAngle + anglePerSegment / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "#111";
        ctx.font = "bold 16px 'Orbitron', sans-serif";
        ctx.fillText(activities[i], 270, 10);
        ctx.restore();
      }
      
      // Draw center circle
      ctx.beginPath();
      ctx.arc(300, 300, 60, 0, Math.PI * 2);
      ctx.fillStyle = "#0d0d15";
      ctx.fill();
      
      // Draw Destiny logo in center
      ctx.beginPath();
      ctx.arc(300, 300, 50, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
      ctx.fill();
      ctx.strokeStyle = "rgba(0, 255, 255, 0.5)";
      ctx.lineWidth = 2;
      ctx.stroke();
      
      ctx.restore();
    }

    // Create celebration particles
    function createParticles(x, y, color) {
      for (let i = 0; i < 50; i++) {
        const particle = document.createElement("div");
        particle.classList.add("particle");
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.width = `${Math.random() * 8 + 2}px`;
        particle.style.height = particle.style.width;
        particle.style.backgroundColor = color;
        
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 5 + 2;
        const lifetime = Math.random() * 2000 + 1000;
        
        particlesContainer.appendChild(particle);
        
        const startTime = Date.now();
        
        function updateParticle() {
          const elapsed = Date.now() - startTime;
          const progress = elapsed / lifetime;
          
          if (progress >= 1) {
            particle.remove();
            return;
          }
          
          const currentX = x + Math.cos(angle) * velocity * elapsed * 0.1;
          const currentY = y + Math.sin(angle) * velocity * elapsed * 0.1;
          
          particle.style.left = `${currentX}px`;
          particle.style.top = `${currentY}px`;
          particle.style.opacity = 1 - progress;
          
          requestAnimationFrame(updateParticle);
        }
        
        requestAnimationFrame(updateParticle);
      }
    }

    // Spin the wheel
    function spinWheel() {
      if (isSpinning) return;
      
      isSpinning = true;
      spinButton.disabled = true;
      selected.classList.remove("celebrate");
      selected.querySelector(".result-text").textContent = "SPINNING...";
      
      if (!isMuted) {
        spinSound.currentTime = 0;
        spinSound.play();
      }
      
      const spins = Math.random() * 3 + 5;
      const finalAngle = spins * 2 * Math.PI + Math.random() * anglePerSegment;
      const duration = 4000;
      const startTime = performance.now();
      
      function animate(timestamp) {
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutCubic(progress);
        currentRotation = finalAngle * easedProgress;
        
        ctx.save();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.translate(300, 300);
        ctx.rotate(currentRotation);
        ctx.translate(-300, -300);
        drawWheel();
        ctx.restore();
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          finishSpin();
        }
      }
      
      requestAnimationFrame(animate);
    }

    // Easing function
    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    // Finish spinning
    function finishSpin() {
      // Adjust rotation to select the segment at the top (under the arrow)
      const normalizedRotation = ((currentRotation % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
      const pickedIndex = Math.floor((2 * Math.PI - normalizedRotation + anglePerSegment / 2) / anglePerSegment) % segmentCount;
      const selectedActivity = activities[pickedIndex];
      const selectedColor = colors[pickedIndex];
      
      selected.querySelector(".result-text").textContent = `🔥 ${selectedActivity} 🔥`;
      selected.classList.add("celebrate");
      
      if (!isMuted) {
        winSound.currentTime = 0;
        winSound.play();
      }
      
      // Create celebration particles
      const resultBoxRect = selected.getBoundingClientRect();
      createParticles(
        resultBoxRect.left + resultBoxRect.width / 2,
        resultBoxRect.top + resultBoxRect.height / 2,
        selectedColor
      );
      
      isSpinning = false;
      spinButton.disabled = false;
    }

    // Toggle mute
    function toggleMute() {
      isMuted = !isMuted;
      if (isMuted) {
        muteButton.innerHTML = '<i class="fas fa-volume-mute"></i>';
        spinSound.pause();
        winSound.pause();
      } else {
        muteButton.innerHTML = '<i class="fas fa-volume-up"></i>';
      }
    }

    // Initialize
    function init() {
      createStars();
      drawWheel();
      
      // Add hover effect to spin button
      spinButton.addEventListener("mouseenter", () => {
        if (!isSpinning) {
          spinButton.style.boxShadow = `0 0 30px ${colors[Math.floor(Math.random() * colors.length)]}`;
        }
      });
      
      spinButton.addEventListener("mouseleave", () => {
        spinButton.style.boxShadow = "0 0 25px var(--destiny-blue), 0 0 10px var(--destiny-orange)";
      });
    }

    // Start the app
    window.onload = init;
