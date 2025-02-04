const URL = "http://localhost:3000/accounts/fetchProfileDetails";

export async function fetchProfileDetails(id = "" ) { 

let user;
let userId ;

if(id != "") {
    userId = id;
}else { 

    user = localStorage.getItem("user-token");
     if(user) { 

        const parsedUser = JSON.parse(user);
        userId = parsedUser.id;
}

}

console.log(userId);

const response = await fetch(`${URL}/${userId}` , { method : "POST" });
const result  = await response.json();

if(response.ok) { 
    const profile = result.userProfile;
    return profile;
}
if(!response.ok) {
     return null;
}


}


export async function fetchOtherUserDetails(id : string) {
     
    const response = await fetch(`http://localhost:3000/accounts/fetchOtherUser/${id}` , { method : "POST" });
    const result  = await response.json();
    
    if(response.ok) { 
        const profile = result.userProfile;
        return profile;
    }
    if(!response.ok) {
         return null;
    }
    
}

export async function GenerateId(combinedString : string) { 

    const response = await fetch(`http://localhost:3000/Personal-chat/generate-chatId/${combinedString}`);
    const result = await response.json();

    if(response.ok) { 
        const chatId  = result.chatId;

        return chatId;
    }
    if(!response.ok) {
         return new Error("error generating chat id");
    }

}


export async function fetchChattedUserDetails(id : string) {
     
    const response = await fetch(`http://localhost:3000/Personal-chat/fetch-chatted-users/${id}` , { method  : "POST" });

    const result = await response.json();

    if(response.ok) {

         return result.users;
    }

    if(!response.ok) { 
        console.log("no users")
        return;
    }
}


export async function fetchSearchUser(searchValue : string) { 

    const response = await fetch(`http://localhost:3000/accounts/searchUser/?username=${searchValue}`, {
        method: "POST"
    });

    const result = await response.json();

    if (response.ok) {

        console.log(result.searchedAccounts);
        return result.searchedAccounts;
        
    }
    if (!response.ok) {

         return null;
    }


}


export async function fetchCommunicationID(userId : string) {
     
    if(userId == "") return;


    const response  = await fetch(`http://localhost:3000/accounts/communication-id/${userId}` , {method : "POST"});

    const result = await response.json();

    if(response.ok){ 
        return result.commId;
    }
    if(!response.ok) {
         return null;
    }

}  
