
export const SEARCHING_START = 'SEARCHING_START';
export const SEARCHING_STOP = 'SEARCHING_STOP';
export const MATCH_FOUND = 'MATCH_FOUND';
export const MATCH_REJECTED = 'MATCH_REJECTED';
export const CHAT_ON = 'CHAT_ON';
export const CHAT_END = 'CHAT_END';
export const ACCEPT_FRIEND = 'ACCEPT_FRIEND';
export const ADD_MESSAGE = 'ADD_MESSAGE';

export const CLEAR_MATCH = 'CLEAR_MATCH';
export const LOAD_FRIENDS = 'LOAD_FRIENDS';
export const UPDATE_ALL_MESSAGES = 'UPDATE_ALL_MESSAGES';
export const UPDATE_ALL_FRIENDS = 'UPDATE_ALL_FRIENDS';
export const ADD_NEW_UNREAD_MESSAGE = 'ADD_NEW_UNREAD_MESSAGE';


export const searchingStart = () => {
    return {
        type: SEARCHING_START
    }
}

export const searchingStop = () => {
    return {
        type: SEARCHING_STOP
    }
}

export const matchFound = (match) => {
    return {
        type: MATCH_FOUND,
        match
    }
}

export const matchRejected = () => {
    return {
        type: MATCH_REJECTED
    }
}

export const addMessage = (message) => {
    return {
        type: ADD_MESSAGE,
        message
    }
}

export const chatOn = () => {
    return {
        type: CHAT_ON
    }
}

export const chatEnd = () => {
    return {
        type: CHAT_END
    }
}

export const acceptFriend = () => {
    return {
        type: ACCEPT_FRIEND
    }
}

export const clearMatch = () => {
    return {
        type: CLEAR_MATCH
    }
}

export const loadFriends = (friends, allMessages, friendsMessages) => {
    return {
        type: LOAD_FRIENDS,
        friends,
        allMessages,
        friendsMessages
    }
}

export const updateAllMessages = (allMessages) => {
    return {
        type: UPDATE_ALL_MESSAGES,
        allMessages
    }
}

export const updateAllFriends = (friends) => {
    return {
        type: UPDATE_ALL_FRIENDS,
        friends
    }
}

export const addNewUnreadMessage = (email, hasMessages) => {
    return {
        type: ADD_NEW_UNREAD_MESSAGE,
        email,
        hasMessages
    }
}