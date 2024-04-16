//global
const MAX_CHARS = 150;

const formEl = document.querySelector(".form");
const textareaEl = document.querySelector(".form__textarea");
const counterEl = document.querySelector(".counter");
const feedbackListEl = document.querySelector(".feedbacks");
const submitBtnEl = document.querySelector(".submit-btn");

const inputHandler = () => {
  const maxNurChars = MAX_CHARS;
  const nrCharsTyped = textareaEl.value.length;
  const charLeft = maxNurChars - nrCharsTyped;
  counterEl.textContent = charLeft;
};

textareaEl.addEventListener("input", inputHandler);

//form component
const showVisualIndicator = (className) => {
  formEl.classList.add(className);
  setTimeout(() => {
    formEl.classList.remove(className);
  }, 2000);
};

const submitHandler = (event) => {
  event.preventDefault();

  // get text from tex area
  const text = textareaEl.value;

  // validate text

  if (text.includes("#") && text.length >= 5) {
    showVisualIndicator("form--valid");
  } else {
    showVisualIndicator("form--invalid");
    textareaEl.focus();
    return;
  }

  const hashtag = text.split(" ").find((word) => word.includes("#"));
  const company = hashtag.substring(1);
  const badgeLetter = company.substring(0, 1).toUpperCase();
  const upvoteCount = 0;
  const daysAgo = 0;

  const feedBackItemHTML = `<li class="feedback">
  <button class="upvote">
      <i class="fa-solid fa-caret-up upvote__icon"></i>
      <span class="upvote__count">${upvoteCount}</span>
  </button>
  <section class="feedback__badge">
      <p class="feedback__letter">${badgeLetter}</p>
  </section>
  <div class="feedback__content">
      <p class="feedback__company">${company}</p>
      <p class="feedback__text">${text}</p>
  </div>
  <p class="feedback__date">${daysAgo === 0 ? "NEW" : `${daysAgo}d`}</p>
</li>`;

  feedbackListEl.insertAdjacentHTML("beforeend", feedBackItemHTML);

  textareaEl.value = "";

  submitBtnEl.blur();

  counterEl.textContent = MAX_CHARS;
};

formEl.addEventListener("submit", submitHandler);
