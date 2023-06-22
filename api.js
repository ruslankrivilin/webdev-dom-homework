import { renderComments } from "./renderComments.js";

    export function fetchPromise() {
      return fetch('https://webdev-hw-api.vercel.app/api/v1/ruslankrivilin/comments',
      {
      method: "GET"
      })
        .then((res) => res.json())
        .then((responseData) => {
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
            };
          });

          renderComments(appComments);
        });
    }

    export function postPromise(text, name) {
    return fetch('https://webdev-hw-api.vercel.app/api/v1/ruslankrivilin/comments', {
        method: "POST",
        body: JSON.stringify({
          text:text, name:name,
          forceError: true,
        }),
      }).then ((response) => {
          console.log(response);
          if (response.status === 201) {
            return response.json();
          } 
          else if(response.status === 400) {
            throw new Error ("Неверный запрос");          
          } 
          else if(response.status === 500) {
            throw new Error ("Пропал интернет");
          }
          else {
            throw new Error ("Неизвестная ошибка");
          }
          
        })
    }
    