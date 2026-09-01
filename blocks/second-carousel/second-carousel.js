export default function decorate(block) {
  const row = block.firstElementChild;
  if (!row) return;
  const imageColumn = row.children[0];
  const contentColumn = row.children[1];
  if (!imageColumn || !contentColumn) return;
  const image = imageColumn.querySelector('img');
  if (!image) return;
  const backgroundImage = image.currentSrc || image.src;
  const headings = [
    ...contentColumn.querySelectorAll('h2'),
  ];
  if (!headings.length) return;
  const testimonials = [];
  headings.forEach((heading) => {
    const testimonial = {
      title: heading.textContent.trim(),
      description: '',
      name: '',
      role: '',
    };
    let element = heading.nextElementSibling;
    const paragraphs = [];
    while (
      element
      && element.tagName !== 'H2'
    ) {
      if (element.tagName === 'P') {
        paragraphs.push(element);
      }
      element = element.nextElementSibling;
    }
    if (paragraphs[0]) {
      testimonial.description = paragraphs[0].textContent.trim();
    }

    if (paragraphs[1]) {
      testimonial.name = paragraphs[1].textContent.trim();
    }

    if (paragraphs[2]) {
      testimonial.role = paragraphs[2].textContent.trim();
    }

    testimonials.push(testimonial);
  });
  block.innerHTML = '';

  block.classList.add('second-carousel');

  block.style.setProperty(
    '--carousel-background',
    `url("${backgroundImage}")`,
  );

  // --------------------------------------------------
  // Slides wrapper
  // --------------------------------------------------

  const slidesWrapper = document.createElement('div');

  slidesWrapper.className = 'second-carousel__slides';

  // --------------------------------------------------
  // Create testimonial slides
  // --------------------------------------------------

  testimonials.forEach(
    (testimonial, index) => {
      const slide = document.createElement('div');

      slide.className = 'second-carousel__slide';

      if (index === 0) {
        slide.classList.add('is-active');
      }

      // ----------------------------------------------
      // Text wrapper
      // ----------------------------------------------

      const textWrapper = document.createElement('div');

      textWrapper.className = 'second-carousel__text';

      // ----------------------------------------------
      // Title
      // ----------------------------------------------

      const title = document.createElement('h2');

      title.className = 'second-carousel__title';

      title.textContent = testimonial.title;

      // ----------------------------------------------
      // Description
      // ----------------------------------------------

      const description = document.createElement('p');

      description.className = 'second-carousel__description';

      description.textContent = testimonial.description;

      // ----------------------------------------------
      // Name
      // ----------------------------------------------

      const name = document.createElement('p');

      name.className = 'second-carousel__name';

      name.textContent = testimonial.name;

      // ----------------------------------------------
      // Role
      // ----------------------------------------------

      const role = document.createElement('p');

      role.className = 'second-carousel__role';

      role.textContent = testimonial.role;

      // ----------------------------------------------
      // Append text
      // ----------------------------------------------

      textWrapper.append(
        title,
        description,
        name,
        role,
      );

      slide.appendChild(textWrapper);

      slidesWrapper.appendChild(slide);
    },
  );

  block.appendChild(slidesWrapper);

  // --------------------------------------------------
  // Previous button
  // --------------------------------------------------

  const previousButton = document.createElement('button');

  previousButton.className = 'second-carousel__button second-carousel__button--prev';

  previousButton.setAttribute(
    'type',
    'button',
  );

  previousButton.setAttribute(
    'aria-label',
    'Previous testimonial',
  );

  previousButton.innerHTML = '&#10094;';

  // --------------------------------------------------
  // Next button
  // --------------------------------------------------

  const nextButton = document.createElement('button');

  nextButton.className = 'second-carousel__button second-carousel__button--next';

  nextButton.setAttribute(
    'type',
    'button',
  );

  nextButton.setAttribute(
    'aria-label',
    'Next testimonial',
  );

  nextButton.innerHTML = '&#10095;';

  // --------------------------------------------------
  // Dots
  // --------------------------------------------------

  const dots = document.createElement('div');

  dots.className = 'second-carousel__dots';

  testimonials.forEach(
    (_, index) => {
      const dot = document.createElement('button');

      dot.className = 'second-carousel__dot';

      dot.setAttribute(
        'type',
        'button',
      );

      dot.setAttribute(
        'aria-label',
        `Go to testimonial ${index + 1}`,
      );

      if (index === 0) {
        dot.classList.add('is-active');
      }

      dots.appendChild(dot);
    },
  );

  // --------------------------------------------------
  // Append controls
  // --------------------------------------------------

  block.appendChild(previousButton);
  block.appendChild(nextButton);
  block.appendChild(dots);

  // --------------------------------------------------
  // Get slides
  // --------------------------------------------------

  const slides = [
    ...block.querySelectorAll(
      '.second-carousel__slide',
    ),
  ];

  const dotItems = [
    ...dots.querySelectorAll(
      '.second-carousel__dot',
    ),
  ];

  if (!slides.length) return;

  // --------------------------------------------------
  // Carousel state
  // --------------------------------------------------

  let currentSlide = 0;
  let autoSlide = null;

  // --------------------------------------------------
  // Show slide
  // --------------------------------------------------

  function showSlide(index, direction = 'next') {
    if (!slides.length) return;

    const previousIndex = currentSlide;
    const nextIndex = (index + slides.length) % slides.length;

    const currentSlideNode = slides[previousIndex];
    const nextSlideNode = slides[nextIndex];

    if (!currentSlideNode || !nextSlideNode || currentSlideNode === nextSlideNode) return;

    const currentText = currentSlideNode.querySelector('.second-carousel__text');
    const nextText = nextSlideNode.querySelector('.second-carousel__text');

    currentSlideNode.classList.remove('is-active');
    nextSlideNode.classList.add('is-active');

    if (dotItems[previousIndex]) {
      dotItems[previousIndex].classList.remove('is-active');
    }

    if (dotItems[nextIndex]) {
      dotItems[nextIndex].classList.add('is-active');
    }

    if (currentText) {
      currentText.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 0.6s ease';
      currentText.style.opacity = '0';
      currentText.style.transform = direction === 'next' ? 'translateX(-120px)' : 'translateX(120px)';
    }

    if (nextText) {
      nextText.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 0.6s ease';
      nextText.style.opacity = '0';
      nextText.style.transform = direction === 'next' ? 'translateX(120px)' : 'translateX(-120px)';
    }

    requestAnimationFrame(() => {
      if (nextText) {
        nextText.style.opacity = '1';
        nextText.style.transform = 'translateX(0)';
      }
    });

    window.setTimeout(() => {
      currentSlide = nextIndex;

      if (currentText) {
        currentText.style.transform = '';
        currentText.style.opacity = '';
      }

      if (nextText) {
        nextText.style.transform = '';
        nextText.style.opacity = '';
      }
    }, 800);
  }

  // --------------------------------------------------
  // Start auto slide
  // --------------------------------------------------

  function startAutoSlide() {
    clearInterval(autoSlide);

    autoSlide = setInterval(
      () => {
        showSlide(currentSlide + 1);
      },
      5000,
    );
  }

  // --------------------------------------------------
  // Restart auto slide
  // --------------------------------------------------

  function restartAutoSlide() {
    clearInterval(autoSlide);

    startAutoSlide();
  }

  // --------------------------------------------------
  // Next button
  // --------------------------------------------------

  nextButton.addEventListener(
    'click',
    () => {
      showSlide(currentSlide + 1, 'next');

      restartAutoSlide();
    },
  );

  // --------------------------------------------------
  // Previous button
  // --------------------------------------------------

  previousButton.addEventListener(
    'click',
    () => {
      showSlide(currentSlide - 1, 'prev');

      restartAutoSlide();
    },
  );

  // --------------------------------------------------
  // Dot buttons
  // --------------------------------------------------

  dotItems.forEach(
    (dot, index) => {
      dot.addEventListener(
        'click',
        () => {
          const direction = index > currentSlide ? 'next' : 'prev';
          showSlide(index, direction);

          restartAutoSlide();
        },
      );
    },
  );

  // --------------------------------------------------
  // Start carousel
  // --------------------------------------------------

  startAutoSlide();

  // --------------------------------------------------
  // Pause on hover
  // --------------------------------------------------

  block.addEventListener(
    'mouseenter',
    () => {
      clearInterval(autoSlide);
    },
  );

  // --------------------------------------------------
  // Resume after hover
  // --------------------------------------------------

  block.addEventListener(
    'mouseleave',
    () => {
      startAutoSlide();
    },
  );

  // --------------------------------------------------
  // Keyboard accessibility
  // --------------------------------------------------

  block.addEventListener(
    'keydown',
    (event) => {
      if (event.key === 'ArrowLeft') {
        showSlide(currentSlide - 1, 'prev');

        restartAutoSlide();
      }

      if (event.key === 'ArrowRight') {
        showSlide(currentSlide + 1, 'next');

        restartAutoSlide();
      }
    },
  );

  block.setAttribute(
    'tabindex',
    '0',
  );
}
