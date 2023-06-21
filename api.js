
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

          return appComments;
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
            alert ("Поле должно содержать хотя бы 3 символа");
            throw new Error ("Пользователь ввел меньше 3 символов");          
          } 
          else {
            alert ("Кажется, что - то пошло не так, попробуйте позже");
            throw new Error ("У пользователя пропал интернет");
          }
          
        })
    }