export default function decorate(block) {
  const slides = [...block.children];
  if (!slides.length) return;
  block.classList.add('carousel');
  const firstImage = block.querySelector('img');
  if (firstImage) {
    block.style.backgroundImage = `url("${firstImage.src}")`;
    firstImage.remove();
  }
  slides.forEach((slide, index) => {
    slide.classList.add('carousel-slide');
    const title = slide.querySelector('h1, h2, h3, h4, h5, h6');
    const description = [...slide.querySelectorAll('p')].find(
      (paragraph) => !paragraph.querySelector('a'),
    );
    const links = slide.querySelectorAll('a');
    title?.classList.add('carousel-title');
    description?.classList.add('carousel-description');
    const content = document.createElement('div');
    content.classList.add('carousel-content');
    if (title) {
      content.appendChild(title);
    }
    if (description) {
      content.appendChild(description);
    }
    if (links.length) {
      const linkWrapper = document.createElement('div');
      linkWrapper.classList.add('carousel-links');
      links.forEach((link) => {
        link.classList.add('carousel-link');
        linkWrapper.appendChild(link);
      });
      content.appendChild(linkWrapper);
    }
    slide.appendChild(content);
    if (index === 0) {
      slide.classList.add('is-active');
    }
  });
  const previousButton = document.createElement('button');
  previousButton.className = 'carousel-button carousel-button-prev';
  previousButton.setAttribute('aria-label', 'Previous slide');
  previousButton.innerHTML = '&#10094;';
  const nextButton = document.createElement('button');
  nextButton.className = 'carousel-button carousel-button-next';
  nextButton.setAttribute('aria-label', 'Next slide');
  nextButton.innerHTML = '&#10095;';
  block.append(previousButton, nextButton);
  let currentSlide = 0;
  let autoPlay;
  const showSlide = (newIndex, direction = 'next') => {
    const current = slides[currentSlide];
    const nextIndex = (newIndex + slides.length) % slides.length;
    const next = slides[nextIndex];
    if (current === next) return;
    const currentContent = current.querySelector('.carousel-content');
    const nextContent = next.querySelector('.carousel-content');
    nextContent.style.transform = direction === 'next' ? 'translateX(100%)' : 'translateX(-100%)';
    next.classList.add('is-active');
    const forceRepaint = () => next.offsetWidth;
    forceRepaint();
    currentContent.style.transform = direction === 'next' ? 'translateX(-100%)' : 'translateX(100%)';
    nextContent.style.transform = 'translateX(0)';
    setTimeout(() => {
      current.classList.remove('is-active');
      currentContent.style.transform = '';
      currentSlide = nextIndex;
    }, 600);
  };
  const nextSlide = () => {
    showSlide(currentSlide + 1, 'next');
  };
  const previousSlide = () => {
    showSlide(currentSlide - 1, 'prev');
  };
  const startAutoPlay = () => {
    autoPlay = setInterval(nextSlide, 5000);
  };
  const resetAutoPlay = () => {
    clearInterval(autoPlay);
    startAutoPlay();
  };
  previousButton.addEventListener('click', () => {
    previousSlide();
    resetAutoPlay();
  });
  nextButton.addEventListener('click', () => {
    nextSlide();
    resetAutoPlay();
  });
  startAutoPlay();
}
