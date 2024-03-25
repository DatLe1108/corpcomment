const textareaEl = document.querySelector(".form__textarea");
const counterEl = document.querySelector(".counter");

const inputHandler = () => {
  const maxNurChars = 150;
  const nrCharsTyped = textareaEl.value.length;
  const charLeft = maxNurChars - nrCharsTyped;
  counterEl.textContent = charLeft;
};

textareaEl.addEventListener("input", inputHandler);
