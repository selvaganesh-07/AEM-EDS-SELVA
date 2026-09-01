export default function decorate(block) {
  const slides = [...block.children];

  if (!slides.length) return;

  block.classList.add('carousel');

  // Get the first image and set it as the fixed background image
  const firstImage = block.querySelector('img');

  if (firstImage) {
    block.style.backgroundImage = `url("${firstImage.src}")`;
    block.style.backgroundSize = 'cover';
    block.style.backgroundPosition = 'center';
    block.style.backgroundRepeat = 'no-repeat';
  }

  // Remove all images from the content
  block.querySelectorAll('img').forEach((image) => {
    image.remove();
  });

  // Prepare slides
  slides.forEach((slide, index) => {
    slide.classList.add('carousel__slide');

    const title = slide.querySelector(
      'h1, h2, h3, h4, h5, h6',
    );

    const description = [
      ...slide.querySelectorAll('p'),
    ].find(
      (paragraph) => !paragraph.querySelector('a'),
    );

    const links = slide.querySelectorAll('a');

    // Add classes
    if (title) {
      title.classList.add('carousel__title');
    }

    if (description) {
      description.classList.add(
        'carousel__description',
      );
    }

    // Create content wrapper
    const content = document.createElement('div');

    content.classList.add('carousel__content');

    // Move title
    if (title) {
      content.appendChild(title);
    }

    // Move description
    if (description) {
      content.appendChild(description);
    }

    // Move links
    if (links.length) {
      const linkWrapper =
        document.createElement('div');

      linkWrapper.classList.add(
        'carousel__links',
      );

      links.forEach((link) => {
        link.classList.add('carousel__link');
        linkWrapper.appendChild(link);
      });

      content.appendChild(linkWrapper);
    }

    // Add content to slide
    slide.appendChild(content);

    // First slide active
    if (index === 0) {
      slide.classList.add('is-active');
    }
  });

  // Previous button
  const previousButton =
    document.createElement('button');

  previousButton.className =
    'carousel__button carousel__button--prev';

  previousButton.type = 'button';

  previousButton.setAttribute(
    'aria-label',
    'Previous slide',
  );

  previousButton.innerHTML = '&#10094;';

  // Next button
  const nextButton =
    document.createElement('button');

  nextButton.className =
    'carousel__button carousel__button--next';

  nextButton.type = 'button';

  nextButton.setAttribute(
    'aria-label',
    'Next slide',
  );

  nextButton.innerHTML = '&#10095;';

  // Add buttons
  block.append(
    previousButton,
    nextButton,
  );

  let currentSlide = 0;
  let autoPlay;

  // Change slide
  const showSlide = (
    newIndex,
    direction = 'next',
  ) => {
    const current =
      slides[currentSlide];

    const nextIndex =
      (newIndex + slides.length) %
      slides.length;

    const next =
      slides[nextIndex];

    if (current === next) return;

    const currentContent =
      current.querySelector(
        '.carousel__content',
      );

    const nextContent =
      next.querySelector(
        '.carousel__content',
      );

    if (!currentContent || !nextContent) {
      return;
    }

    // Set starting position
    nextContent.style.transform =
      direction === 'next'
        ? 'translateX(100%)'
        : 'translateX(-100%)';

    // Show next slide
    next.classList.add('is-active');

    // Force repaint
    void nextContent.offsetWidth;

    // Move current content out
    currentContent.style.transform =
      direction === 'next'
        ? 'translateX(-100%)'
        : 'translateX(100%)';

    // Move new content in
    nextContent.style.transform =
      'translateX(0)';

    // Finish animation
    setTimeout(() => {
      current.classList.remove(
        'is-active',
      );

      currentContent.style.transform = '';

      nextContent.style.transform = '';

      currentSlide = nextIndex;
    }, 600);
  };

  // Next
  const nextSlide = () => {
    showSlide(
      currentSlide + 1,
      'next',
    );
  };

  // Previous
  const previousSlide = () => {
    showSlide(
      currentSlide - 1,
      'prev',
    );
  };

  // Start autoplay
  const startAutoPlay = () => {
    clearInterval(autoPlay);

    autoPlay = setInterval(
      nextSlide,
      5000,
    );
  };

  // Previous click
  previousButton.addEventListener(
    'click',
    () => {
      previousSlide();
      startAutoPlay();
    },
  );

  // Next click
  nextButton.addEventListener(
    'click',
    () => {
      nextSlide();
      startAutoPlay();
    },
  );

  // Start automatically
  startAutoPlay();
}