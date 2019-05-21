import { SEARCHING_START, SEARCHING_STOP, MATCH_FOUND, MATCH_REJECTED, CHAT_ON, CHAT_END, ACCEPT_FRIEND, ADD_MESSAGE, CLEAR_MATCH, LOAD_FRIENDS, UPDATE_ALL_MESSAGES, UPDATE_ALL_FRIENDS, ADD_NEW_UNREAD_MESSAGE } from '../actions/chat'

const initialState = {
    searching: false,
    match: null,
    chatOn: false,
    messages: [],
    canShowModal: false,
    addPersonModal: false,
    acceptFriend: null,
    friends: [],
    allMessages: [],
    friendsMessages: {},

    // kryteria wyszukiwania osoby
    age: null,
    gps: null,

}
// szukanie, 
// znalezienie
// rozpoczecie chatu / niet


export function chat(state = initialState, action) {
    switch (action.type) {
        case SEARCHING_START:
            return {
                ...state,
                searching: true,
                match: null,
                chatOn: false,
                messages: [],
                addPersonModal: false,
                canShowModal: false,
                acceptFriend: null,
            };

        case CLEAR_MATCH:
            return {
                ...state,
                match: null,
                canShowModal: false,
            };
        case SEARCHING_STOP:
            return {
                ...state,
                searching: false,
                chatOn: false,
                addPersonModal: false,
                canShowModal: false,
                acceptFriend: null,
            };

        case MATCH_FOUND:
            return  {
                ...state,
                searching: false,
                match: action.match,
                canShowModal: true,
            };

        case MATCH_REJECTED:
            return {
                ...state,
                searching: true,
                match: null,
                canShowModal: false,
            };

        case ADD_MESSAGE:
            return {
                ...state,
                messages: [...state.messages, action.message]
            };

        case CHAT_ON:
            return {
                ...state,
                searching: false,
                chatOn: true,
            };

        case CHAT_END:
            return {
                ...state,
                addPersonModal: true,
                chatOn: false,
            };

        case ACCEPT_FRIEND:
            return {
                ...state,
                addPersonModal: false,
                chatOn: false,
            };

            case LOAD_FRIENDS:
                return {
                    ...state,
                    friends: action.friends,
                    allMessages: action.allMessages,
                    friendsMessages: action.friendsMessages
                };

            case UPDATE_ALL_MESSAGES:
                return {
                    ...state,
                    allMessages: action.allMessages,
                };

            case UPDATE_ALL_FRIENDS:
                return {
                    ...state,
                    friends: action.friends,
                };

            case ADD_NEW_UNREAD_MESSAGE:
                return {
                    ...state,
                    friendsMessages: {...state.friendsMessages, [action.email]: action.hasMessages}
                };

        default: 
            return state;
    }
}