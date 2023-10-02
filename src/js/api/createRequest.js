const createRequest = async (options = {
    sendMethod, method, id, data, callback,
}) => {

    let strRequest = `http://localhost:3000/${options.method}`;
    
    if (options.sendMethod === 'POST') {
        fetch(strRequest, {
          method: 'POST',
          body: JSON.stringify(options.data),
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            options.callback(data);
          })
          .catch((error) => {
            console.error(`Error: ${error}`);
            options.callback(error);
          });
      }
};

export default createRequest;
