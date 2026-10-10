
        document.addEventListener('DOMContentLoaded', () => {
            
            const bgCanvas = document.getElementById('bg-canvas');
            const bgCtx = bgCanvas.getContext('2d');
            
            const interactiveCanvas = document.getElementById('interactive-canvas');
            const intCtx = interactiveCanvas.getContext('2d');
            
            let width = bgCanvas.width = interactiveCanvas.width = window.innerWidth;
            let height = bgCanvas.height = interactiveCanvas.height = window.innerHeight;
            
            window.addEventListener('resize', () => {
                width = bgCanvas.width = interactiveCanvas.width = window.innerWidth;
                height = bgCanvas.height = interactiveCanvas.height = window.innerHeight;
            });

            const dustParticles = [];
            const dustCount = 28;
            const colors = ['#f3e5ab', '#d4af37', '#ff7597', '#8e44ad'];
            
            class Dust {
                constructor() {
                    this.reset();
                    this.y = Math.random() * height;
                }
                
                reset() {
                    this.x = Math.random() * width;
                    this.y = height + Math.random() * 20;
                    this.size = Math.random() * 2.5 + 0.5;
                    this.speedY = -(Math.random() * 0.4 + 0.2);
                    this.speedX = (Math.random() - 0.5) * 0.3;
                    this.color = colors[Math.floor(Math.random() * colors.length)];
                    this.alpha = Math.random() * 0.5 + 0.1;
                    this.fadeSpeed = Math.random() * 0.005 + 0.002;
                    this.oscillateSpeed = Math.random() * 0.02 + 0.005;
                    this.oscillateRange = Math.random() * 1.5;
                    this.angle = Math.random() * Math.PI;
                }
                
                update() {
                    this.y += this.speedY;
                    this.angle += this.oscillateSpeed;
                    this.x += this.speedX + Math.sin(this.angle) * this.oscillateRange * 0.1;
                    
                    if (this.alpha < 0.8 && this.fadeSpeed > 0) {
                        this.alpha += this.fadeSpeed;
                        if (this.alpha >= 0.8) this.fadeSpeed = -this.fadeSpeed;
                    } else {
                        this.alpha += this.fadeSpeed;
                    }
                    
                    if (this.y < 0 || this.alpha <= 0 || this.x < 0 || this.x > width) {
                        this.reset();
                    }
                }
                
                draw() {
                    bgCtx.save();
                    bgCtx.globalAlpha = this.alpha;
                    bgCtx.shadowBlur = this.size * 3;
                    bgCtx.shadowColor = this.color;
                    bgCtx.fillStyle = this.color;
                    bgCtx.beginPath();
                    bgCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    bgCtx.fill();
                    bgCtx.restore();
                }
            }
            
            for (let i = 0; i < dustCount; i++) {
                dustParticles.push(new Dust());
            }

            const fireworkLaunchers = [];
            const fireworks = [];
            const confetti = [];
            const floatingHearts = [];
            
            let isSurpriseActive = false;

            class FireworkLauncher {
                constructor() {
                    this.x = Math.random() * (width * 0.6) + width * 0.2;
                    this.y = height + 10;
                    this.targetY = Math.random() * (height * 0.4) + height * 0.15;
                    this.speed = Math.random() * 3 + 6;
                    this.color = colors[Math.floor(Math.random() * colors.length)];
                    this.size = 3;
                }
                
                update() {
                    this.y -= this.speed;
                    this.x += (Math.random() - 0.5) * 0.5;
                    if (this.y <= this.targetY) {
                        explodeFirework(this.x, this.y, this.color);
                        return false; // remove launcher
                    }
                    return true;
                }
                
                draw() {
                    intCtx.save();
                    intCtx.fillStyle = this.color;
                    intCtx.shadowBlur = 10;
                    intCtx.shadowColor = this.color;
                    intCtx.beginPath();
                    intCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    intCtx.fill();
                    intCtx.restore();
                }
            }
            
            class FireworkSpark {
                constructor(x, y, color) {
                    this.x = x;
                    this.y = y;
                    this.color = color;
                    this.angle = Math.random() * Math.PI * 2;
                    this.speed = Math.random() * 5 + 2;
                    this.friction = 0.95;
                    this.gravity = 0.08;
                    this.alpha = 1.0;
                    this.decay = Math.random() * 0.015 + 0.008;
                    this.size = Math.random() * 2 + 1;
                }
                
                update() {
                    this.speed *= this.friction;
                    this.x += Math.cos(this.angle) * this.speed;
                    this.y += Math.sin(this.angle) * this.speed + this.gravity;
                    this.alpha -= this.decay;
                    return this.alpha > 0;
                }
                
                draw() {
                    intCtx.save();
                    intCtx.globalAlpha = this.alpha;
                    intCtx.fillStyle = this.color;
                    intCtx.shadowBlur = this.size * 4;
                    intCtx.shadowColor = this.color;
                    intCtx.beginPath();
                    intCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    intCtx.fill();
                    intCtx.restore();
                }
            }

            function explodeFirework(x, y, color) {
                const sparksCount = Math.floor(Math.random() * 28) + 26;
                for (let i = 0; i < sparksCount; i++) {
                    fireworks.push(new FireworkSpark(x, y, color));
                }
            }

            class ConfettiPiece {
                constructor() {
                    this.reset();
                    this.y = Math.random() * height * 0.7;
                }
                
                reset() {
                    this.x = Math.random() * width;
                    this.y = -20;
                    this.size = Math.random() * 6 + 4;
                    this.color = colors[Math.floor(Math.random() * colors.length)];
                    this.speedY = Math.random() * 2 + 1.5;
                    this.speedX = (Math.random() - 0.5) * 1;
                    this.rotation = Math.random() * 360;
                    this.rotationSpeed = (Math.random() - 0.5) * 3;
                    this.opacity = Math.random() * 0.5 + 0.5;
                }
                
                update() {
                    this.y += this.speedY;
                    this.x += this.speedX + Math.sin(this.y * 0.02) * 0.2;
                    this.rotation += this.rotationSpeed;
                    
                    if (this.y > height) {
                        if (isSurpriseActive) {
                            this.reset();
                        } else {
                            return false; 
                        }
                    }
                    return true;
                }
                
                draw() {
                    intCtx.save();
                    intCtx.globalAlpha = this.opacity;
                    intCtx.fillStyle = this.color;
                    intCtx.translate(this.x, this.y);
                    intCtx.rotate(this.rotation * Math.PI / 180);

                    intCtx.fillRect(-this.size/2, -this.size/2, this.size, this.size);
                    intCtx.restore();
                }
            }

            class FloatingHeart {
                constructor() {
                    this.reset();
                }
                
                reset() {
                    this.x = Math.random() * width;
                    this.y = height + Math.random() * 50;
                    this.size = Math.random() * 12 + 8;
                    this.speedY = -(Math.random() * 1.5 + 1.0);
                    this.speedX = (Math.random() - 0.5) * 0.5;
                    this.alpha = 1.0;
                    this.decay = Math.random() * 0.005 + 0.003;
                    this.color = ['#ff7597', '#ffb3c6', '#ff4d6d'][Math.floor(Math.random() * 3)];
                }
                
                update() {
                    this.y += this.speedY;
                    this.x += this.speedX + Math.sin(this.y * 0.01) * 0.5;
                    this.alpha -= this.decay;
                    
                    if (this.alpha <= 0 || this.y < -20) {
                        if (isSurpriseActive) {
                            this.reset();
                        } else {
                            return false;
                        }
                    }
                    return true;
                }
                
                draw() {
                    intCtx.save();
                    intCtx.globalAlpha = this.alpha;
                    intCtx.fillStyle = this.color;
                    intCtx.shadowBlur = 8;
                    intCtx.shadowColor = this.color;
                    
                    intCtx.beginPath();
                    const topCurveHeight = this.size * 0.3;
                    intCtx.moveTo(this.x, this.y + topCurveHeight);
                    
                    intCtx.bezierCurveTo(
                        this.x - this.size / 2, this.y, 
                        this.x - this.size, this.y + this.size / 3, 
                        this.x, this.y + this.size
                    );
                    
                    intCtx.bezierCurveTo(
                        this.x + this.size, this.y + this.size / 3, 
                        this.x + this.size / 2, this.y, 
                        this.x, this.y + topCurveHeight
                    );
                    
                    intCtx.fill();
                    intCtx.restore();
                }
            }

            let fireworkInterval;
            function startInteractiveEffects() {
                isSurpriseActive = true;
                interactiveCanvas.style.display = 'block';
                
                for (let i = 0; i < 32; i++) confetti.push(new ConfettiPiece());
                for (let i = 0; i < 12; i++) floatingHearts.push(new FloatingHeart());
                
                fireworkInterval = setInterval(() => {
                    if (fireworkLaunchers.length < 3) {
                        fireworkLaunchers.push(new FireworkLauncher());
                    }
                }, 700);
            }

            function stopInteractiveEffects() {
                isSurpriseActive = false;
                clearInterval(fireworkInterval);
            }

            function animate() {
                bgCtx.clearRect(0, 0, width, height);
                
                dustParticles.forEach(d => {
                    d.update();
                    d.draw();
                });
                
                intCtx.clearRect(0, 0, width, height);
                
                for (let i = fireworkLaunchers.length - 1; i >= 0; i--) {
                    const active = fireworkLaunchers[i].update();
                    if (active) {
                        fireworkLaunchers[i].draw();
                    } else {
                        fireworkLaunchers.splice(i, 1);
                    }
                }
                
                for (let i = fireworks.length - 1; i >= 0; i--) {
                    const active = fireworks[i].update();
                    if (active) {
                        fireworks[i].draw();
                    } else {
                        fireworks.splice(i, 1);
                    }
                }
                
                for (let i = confetti.length - 1; i >= 0; i--) {
                    const active = confetti[i].update();
                    if (active) {
                        confetti[i].draw();
                    } else {
                        confetti.splice(i, 1);
                    }
                }
                
                for (let i = floatingHearts.length - 1; i >= 0; i--) {
                    const active = floatingHearts[i].update();
                    if (active) {
                        floatingHearts[i].draw();
                    } else {
                        floatingHearts.splice(i, 1);
                    }
                }
                
                if (!isSurpriseActive && fireworkLaunchers.length === 0 && fireworks.length === 0 && confetti.length === 0 && floatingHearts.length === 0) {
                    interactiveCanvas.style.display = 'none';
                }
                
                requestAnimationFrame(animate);
            }
            
            animate();

            const btnSurprise = document.getElementById('btn-surprise-trigger');
            const surpriseModal = document.getElementById('surprise-modal');
            const btnSurpriseClose = document.getElementById('btn-surprise-close');
            
            const bgAudio = document.getElementById('bg-audio');
            const btnPlayPause = document.getElementById('music-play-btn');
            const playIcon = document.getElementById('play-icon');
            const pauseIcon = document.getElementById('pause-icon');
            const audioVisualizer = document.getElementById('audio-visualizer');
            
            bgAudio.volume = 0.35;

            btnSurprise.addEventListener('click', () => {
                if (bgAudio.paused) {
                    playMusic();
                }
                
                startInteractiveEffects();
                surpriseModal.classList.add('show');
            });

            btnSurpriseClose.addEventListener('click', () => {
                surpriseModal.classList.remove('show');
                stopInteractiveEffects();
            });

            const triggerCelebAgain = document.querySelector('.trigger-celebration-again');
            triggerCelebAgain.addEventListener('click', () => {
                if (!isSurpriseActive) {
                    startInteractiveEffects();
                    setTimeout(() => {
                        stopInteractiveEffects();
                    }, 6000);
                }
            });

            function playMusic() {
                bgAudio.play()
                    .then(() => {
                        playIcon.style.display = 'none';
                        pauseIcon.style.display = 'block';
                        audioVisualizer.classList.add('playing');
                    })
                    .catch(error => {
                        console.log("Audio autoplay prevented. Interaction required first.", error);
                    });
            }

            function pauseMusic() {
                bgAudio.pause();
                playIcon.style.display = 'block';
                pauseIcon.style.display = 'none';
                audioVisualizer.classList.remove('playing');
            }

            btnPlayPause.addEventListener('click', () => {
                if (bgAudio.paused) {
                    playMusic();
                } else {
                    pauseMusic();
                }
            });

            const revealElements = document.querySelectorAll('.reveal');
            
            const revealObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                        
                        if (entry.target.id === 'memories') {
                            animateCounters();
                        }
                    }
                });
            }, {
                threshold: 0.15,
                rootMargin: "0px 0px -50px 0px"
            });

            revealElements.forEach(el => revealObserver.observe(el));

            let countersAnimated = false;
            
            function animateCounters() {
                if (countersAnimated) return;
                countersAnimated = true;
                
                const counters = document.querySelectorAll('.counter-number');
                
                counters.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-target'), 10);
                    const duration = 2500; 
                    const startTime = performance.now();
                    
                    function updateCount(currentTime) {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        
                        const easeProgress = progress * (2 - progress);
                        const currentVal = Math.floor(easeProgress * target);
                        
                        if (target >= 1000) {
                            counter.innerText = currentVal.toLocaleString('id-ID') + "+";
                        } else {
                            counter.innerText = currentVal;
                        }
                        
                        if (progress < 1) {
                            requestAnimationFrame(updateCount);
                        } else {
                            counter.innerText = target >= 1000 ? target.toLocaleString('id-ID') + "+" : target;
                        }
                    }
                    
                    requestAnimationFrame(updateCount);
                });
            }

            const galleryItems = document.querySelectorAll('.gallery-item');
            const lightboxModal = document.getElementById('lightbox-modal');
            const lightboxImg = document.getElementById('lightbox-img');
            const lightboxCaption = document.getElementById('lightbox-caption');
            const btnLightboxClose = document.getElementById('btn-lightbox-close');

            galleryItems.forEach(item => {
                item.addEventListener('click', () => {
                    const img = item.querySelector('.gallery-img');
                    const desc = item.getAttribute('data-caption');
                    
                    lightboxImg.src = img.src;
                    lightboxCaption.textContent = desc;
                    lightboxModal.classList.add('show');
                });
            });

            btnLightboxClose.addEventListener('click', () => {
                lightboxModal.classList.remove('show');
            });

            lightboxModal.addEventListener('click', (e) => {
                if (e.target === lightboxModal) {
                    lightboxModal.classList.remove('show');
                }
            });
        });
    