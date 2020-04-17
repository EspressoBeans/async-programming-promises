import setText, { appendText } from "./results.mjs";

export function timeout() {
    // THEN THE PROMISE IS INSTANTIATED IT IS IN PENDING STATE, 
    //      THE CONSTRUCTOR TAKES A FUNCTION WHICH IS CALLED THE EXECUTOR FUNCTION

    // THE PROMISE
    const wait = new Promise(
        // THE EXECUTOR FUNCTION, THIS CODE GETS EXECUTED IMMEDIATELY WHEN PROMISE IS "NEW UPPED" (INSTANTIATED)
        (resolve) => {  // RESOLVE IS A PREDEFINED NAMED PARAMETER FUNCTION USED TO CALL AND RESOLVE ITS STATE
            setTimeout(() => {
                resolve("Timeout!");  //HERE WE'RE PASSING THE STRING TO THE RESOLVE FUNCTION
            }, 1500);
        }
    );  

    // FULFILLED STATE DEFINITION
    wait.then(text => setText(text));  //FULFILLED STATE
}

export function interval() {
    let counter = 0;
    const wait = new Promise((resolve) => {
        setInterval(() => {
            console.log("INTERVAL");
            resolve(`Timeout! ${++counter}`);
        }, 1000);
    });

    wait.then((text) => {setText(text)})
    .finally(() => {appendText(` -- Done ${counter}`)});

}

export function clearIntervalChain() {
    let interval;
    let counter = 0;
    const wait = new Promise((resolve) => {
        interval = setInterval(() => {
            console.log("INTERVAL");
            resolve(`Timeout! ${++counter}`);
        }, 1000);
    });

    wait.then((text) => {setText(text)})
    .finally(() => {clearInterval(interval)});
}

export function xhr() {
    let request = new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", "http://localhost:3000/users/1");
        xhr.onload = () => {
            // THIS COVERS ANY RESPONSE RETURNED
            if(xhr.status === 200){
                resolve(xhr.responseText)
            } else {
                reject(xhr.statusText);
            }  
        };
        // THIS COVERS ONLY NETWORK ERRORS
        xhr.onerror = () => {reject("Request Failed")};
        xhr.send();
    });

    request.then((result) =>{setText(result)})
    .catch((reason) => {setText(reason)});
}

export function allPromises() {
    let categories = axios.get("http://localhost:3000/itemCategories");
    let statuses = axios.get("http://localhost:3000/orderStatuses");
    let userTypes = axios.get("http://localhost:3000/userTypes");
    let addressTypes = axios.get("http://localhost:3000/addressTypes");

    // THE PROMISE.ALL FUNCTION WILL WAIT UNTIL EITHER ALL PROMISES ARE FULFILLED OR ONE IS REJECTS
    Promise.all([categories, statuses, userTypes, addressTypes])
    .then(([cat, stat, type, add]) => {
        setText("");
        appendText(JSON.stringify(cat.data));
        appendText(JSON.stringify(stat.data));
        appendText(JSON.stringify(type.data));
        appendText(JSON.stringify(add.data));
    }).catch(reasons => {
        setText(reasons);
    })
}

export function allSettled() {
    let categories = axios.get("http://localhost:3000/itemCategories");
    let statuses = axios.get("http://localhost:3000/orderStatuses");
    let userTypes = axios.get("http://localhost:3000/userTypes");
    let addressTypes = axios.get("http://localhost:3000/addressTypes");

    // THE PROMISE.SETTLED FUNCTION WILL WAIT UNTIL EITHER ALL PROMISES ARE FULFILLED OR ONE IS REJECTS
    Promise.allSettled([categories, statuses, userTypes, addressTypes])
    .then((values) => {
        let results = values.map(v =>{
            if(v.status === 'fulfilled') {
                return `FULFILLED: ${JSON.stringify(v.value.data[0])}`;
            }
            return `REJECTED: ${v.reason.message}`;
        });
        setText(results);
    }).catch(reasons => {
        setText(reasons);
    })
}

export function race() {
    let users = axios.get("http://localhost:3000/users");
    let backup = axios.get("http://localhost:3001/users");

    Promise.race([users, backup])
        .then(users => setText(JSON.stringify(users.data)))
        .catch(reason => setText(reason));
}
