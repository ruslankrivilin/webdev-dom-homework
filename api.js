    
    export const fetchPromise = () => {
      return fetch ('https://webdev-hw-api.vercel.app/api/v1/ruslankrivilin/comments',
      {
        method: "GET"
      })
      .then ((response) => {
        return response.json();
      })
      .then ((responseData) => {
            const appComments = responseData.comments.map((comment) => {
            const dateComment = new Date(comment.date);
            return {
              name: comment.author.name,
              date: dateComment.getDate().toString().padStart(2, '0') + '.' + 
                (dateComment.getMonth() + 1).toString().padStart(2, '0') + '.' +
                dateComment.getFullYear().toString().slice(-2) + ' ' +
                dateComment.getHours().toString().padStart(2, '0') + ':' +
                dateComment.getMinutes().toString().padStart(2, '0'),
            text: comment.text,
            like: comment.likes,
            isActiveLikes: false,

            }
          })
          comments = appComments;
          renderComents();
      })
    }
    fetchPromise()

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
  fetch('https://webdev-hw-api.vercel.app/api/v1/ruslankrivilin/comments', {
        method: "POST",
        body: JSON.stringify({
          text: textareaInputElement.value, name: textInputElement.value,
          forceError: true,
        }),
      }).then ((response) => {
          console.log(response);
          if (response.status === 201) {
            return response.json();
          } 
          else if(response.status === 400) {
            alert ("Поле должно содержать хотя бы 3 символа");
            throw new Error ("Пользователь ввел меньше 3 символов");          
          } 
          else {
            alert ("Кажется, что - то пошло не так, попробуйте позже");
            throw new Error ("У пользователя пропал интернет");
          }
          
        })
      .then (() =>{
        return fetchPromise();
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
      renderComents();

    });