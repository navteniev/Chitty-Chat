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

function sendChatAction(value){
    socket.emit('chat message', value);
}


export default function Store(props){

    const [allChats, dispatch] = React.useReducer(reducer, initState);


    if (!socket){
        socket = io(':3001');
        socket.on('chat message', function(msg){
            dispatch({type:'RECEIVE_MESSAGE', payload: msg});
            console.log(msg);
        });
    }

    // const user = 'hyder';
    const user = 'user' + Math.floor((Math.random() * 1000));


    return(
        <CTX.Provider value = {{allChats, sendChatAction, user}}>
            {props.children}
        </CTX.Provider>
    )
}   