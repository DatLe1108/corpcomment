//global
const MAX_CHARS = 150;
const API_URL = "https://bytegrad.com/course-assets/js/1/api/feedbacks";

const formEl = document.querySelector(".form");
const textareaEl = document.querySelector(".form__textarea");
const counterEl = document.querySelector(".counter");
const feedbackListEl = document.querySelector(".feedbacks");
const submitBtnEl = document.querySelector(".submit-btn");
const spinnerEl = document.querySelector(".spinner");
const hashtagListEl = document.querySelector(".hashtags");

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

  const feedbackItem = {
    hashtag,
    text,
    company,
    badgeLetter,
    upvoteCount,
    daysAgo,
  };

  renderFeedbackItem(feedbackItem);

  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(feedbackItem),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        console.log("st went wrong");
        return;
      }

      console.log("done!");
    })
    .catch((error) => {
      console.log(error);
    });

  textareaEl.value = "";

  submitBtnEl.blur();

  counterEl.textContent = MAX_CHARS;
};

formEl.addEventListener("submit", submitHandler);

//feedback list component
const clickHandler = (event) => {
  const clickEl = event.target;

  const upvoteIntention = clickEl.className.includes("upvote");

  if (upvoteIntention) {
    const upvoteBtnEl = clickEl.closest(".upvote");
    upvoteBtnEl.disabled = true;

    const upvoteCountEl = upvoteBtnEl.querySelector(".upvote__count");

    let upvoteCount = +upvoteBtnEl.textContent;

    upvoteCount = upvoteCount + 1;

    upvoteCountEl.textContent = upvoteCount;
  } else {
    clickEl.closest(".feedback").classList.toggle("feedback--expand");
  }
};

feedbackListEl.addEventListener("click", clickHandler);

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

//hashtag list component
const clickHandler2 = (event) => {
  const clickedEl = event.target;

  if (clickedEl.className === "hashtags") {
    return;
  }

  const companyFromHashtag = clickedEl.textContent
    .substring(1)
    .toLowerCase()
    .trim();

  const loopingNode = Array.from(feedbackListEl.childNodes);

  loopingNode.forEach((childNode) => {
    if (childNode.nodeType === 3) return;

    const companyNameFromFeedbackItem = childNode
      .querySelector(".feedback__company")
      .textContent.toLowerCase()
      .trim();

    if (companyFromHashtag !== companyNameFromFeedbackItem) {
      childNode.remove();
    }
  });
};

hashtagListEl.addEventListener("click", clickHandler2);
