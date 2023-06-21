
import { fetchPromise, postPromise } from "./api.js";
import { renderComments } from "./renderComments.js";
const buttonWritter = document.getElementById("writter");
const textInputElement = document.getElementById("add-text");
const textareaInputElement = document.getElementById("add-textarea");
const listElement = document.getElementById("list");


let comments = [];


fetchPromise().then (data => {
  renderComments(data);
})
  

// export const likes = () => {
// const likeButtons = document.querySelectorAll('.like-button');
//     for (const likeButton of likeButtons) {
//         likeButton.addEventListener('click', (e) => {
//         e.stopPropagation()
//         const index = likeButton.dataset.index;
//     if (likeButton.classList.contains('-active-like')) {
//       comments[index].like = Number(comments[index].like) -1;
//       comments[index].isActiveLike = false;
//     } else {
//       comments[index].like = Number(comments[index].like) +1;
//       comments[index].isActiveLike = true;
//     }
//         renderComments(comments);
//         });
//     };
// };

export const edit = () => {
const editButtons = document.querySelectorAll('.edit-button');
const commentBody = document.querySelectorAll('.comment-body');



editButtons.forEach((button, index) => {
  button.addEventListener('click', () => {
    const commentBodyElem = commentBody[index];
    const comment = comments[index];

    if (comment.isEdit) {
      const textarea = document.querySelector('.edit-textarea');
      const newComment = textarea.value;
      comment.text = newComment;
    }

    comment.isEdit = !comment.isEdit;
    renderComments(comments);
    })
  });

}

export const answerComment = () => {
  const comentsElement = document.querySelectorAll('.comment')
  for (const comentElement of comentsElement) {
    comentElement.addEventListener("click", () => {
      textareaInputElement.value = `>${comentElement.querySelector('.comment-text').innerHTML
          .replaceAll("&amp;", "&")
          .replaceAll("&lt;", "<")
          .replaceAll("&gt;", ">")
          .replaceAll("&quot;", '"')}`
    + `\n\n${comentElement.querySelector('.comment-header').children[0].innerHTML
          .replaceAll("&amp;", "&")
          .replaceAll("&lt;", "<")
          .replaceAll("&gt;", ">")
          .replaceAll("&quot;", '"')},`
  })
}
}


fetchPromise();

buttonWritter.addEventListener ('click',() => {
  textInputElement.style.backgroundColor = "";
  textareaInputElement.style.backgroundColor = "";
  if (textInputElement.value === "" || textareaInputElement.value === "") {
    textInputElement.style.backgroundColor = "red";
    textareaInputElement.style.backgroundColor = "red"
    return;
  }
  const date = new Date();
  const formattedDate =
  date.getDate().toString().padStart(2, '0') + '.' + 
  (date.getMonth() + 1).toString().padStart(2, '0') + '.' +
  date.getFullYear().toString().slice(-2) + ' ' +
  date.getHours().toString().padStart(2, '0') + ':' +
  date.getMinutes().toString().padStart(2, '0');
  const oldlistElement = listElement.innerHTML
  listElement.innerHTML = oldlistElement + `<li class="comment">
      <div class="comment-all">
      <div class="comment-header">
        <div>${textInputElement.value}
        </div>
        <div> ${formattedDate}
        </div>
      </div>
      <div class="comment-body">
        <div class="comment-text">
          ${textareaInputElement.value}
        </div>
      </div>
      </div>
      <div class="comment-footer">
        <div class="likes">
          <span class="likes-counter">0</span>
          <button class="like-button"></button>
        </div>
      </div>
    </li>`;

buttonWritter.disabled = true;
buttonWritter.textContent = "Элемент добавляется...";
const text = textareaInputElement.value;
const name = textInputElement.value;
postPromise(text, name)
  .then (() =>{
    return fetchPromise(text, name);
  })
  .then ((data) => {
    buttonWritter.disabled = false;
    buttonWritter.textContent = "Написать";
    textInputElement.value = "";
    textareaInputElement.value = "";
  })
  .catch ((error) => {
    console.log(error);

  })
  .finally (()=> {
    buttonWritter.disabled = false;
    buttonWritter.textContent = "Написать";
  })
  renderComments(comments);

});