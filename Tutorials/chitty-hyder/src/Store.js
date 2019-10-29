// this funcion is kinda like a wrapper
// that holds all our chats

import React from 'react'
import io from 'socket.io-client';
export const CTX = React.createContext();


/*
expect

        there will be arrays of msgs, that we need to read from
        {
            from:   'user'
            msg:    'hi'
            topic:  'general'
        }

        state{
            topic1: [{msg},{msg}{msg}],
            topic2: [{msg},{msg}{msg}]
        }
*/ 


const initState = {
    general : [
        {from: 'ali', msg:'hello'},
        {from: 'may', msg:'hola'},
        {from: 'june', msg:'merci'},
    ],
    'cats are best': [
        {from: 'ali', msg:'meow'},
        {from: 'may', msg:'meowwww'},
        {from: 'june', msg:'meowwwwwww'},
    ]
}

function reducer(state, action){

    const {from, msg, topic} = action.payload;
    switch(action.type){
        case 'RECEIVE_MESSAGE':
            return{
                ...state,
                [action.payload.topic]:[
                    ...state[action.payload.topic],
                    {
                        from,
                        msg
                    }
                ]
            }
        default:
            return state
    }
}

let socket;

export default function Store(props){

    if (!socket){
        socket = io(':3001');
    }

    const [allChats] = React.useReducer(reducer, initState);

    return(
        <CTX.Provider value = {{allChats}}>
            {props.children}
        </CTX.Provider>
    )
}