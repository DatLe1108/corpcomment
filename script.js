//global
const MAX_CHARS = 150;
const API_URL = "https://bytegrad.com/course-assets/js/1/api/feedbacks";

const formEl = document.querySelector(".form");
const textareaEl = document.querySelector(".form__textarea");
const counterEl = document.querySelector(".counter");
const feedbackListEl = document.querySelector(".feedbacks");
const submitBtnEl = document.querySelector(".submit-btn");
const spinnerEl = document.querySelector(".spinner");

const renderFeedbackItem = (feedbackItem) => {
  const feedBackItemHTML = `<li class="feedback">
  <button class="upvote">
      <i class="fa-solid fa-caret-up upvote__icon"></i>
      <span class="upvote__count">${feedbackItem.upvoteCount}</span>
  </button>
  <section class="feedback__badge">
      <p class="feedback__letter">${feedbackItem.badgeLetter}</p>
  </section>
  <div class="feedback__content">
      <p class="feedback__company">${feedbackItem.company}</p>
      <p class="feedback__text">${feedbackItem.text}</p>
  </div>
  <p class="feedback__date">${
    feedbackItem.daysAgo === 0 ? "NEW" : `${feedbackItem.daysAgo}d`
  }</p>
</li>`;

  feedbackListEl.insertAdjacentHTML("beforeend", feedBackItemHTML);
};

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

  renderFeedbackItem({ hashtag, company, badgeLetter, upvoteCount, daysAgo });

  textareaEl.value = "";

  submitBtnEl.blur();

  counterEl.textContent = MAX_CHARS;
};

formEl.addEventListener("submit", submitHandler);

//feedback list component

fetch(API_URL)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    spinnerEl.remove();

    data.feedbacks.forEach((feedbackItem) => {
      renderFeedbackItem(feedbackItem);
    });
  })
  .catch((error) => {
    feedbackListEl.textContent = `Failed to fetch feedback items. Error message: ${error.message}`;
  });
