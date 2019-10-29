// this funcion is kinda like a wrapper
// that holds all our chats

import React from 'react'

const CTX = React.createContext();


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
    topic2: [
        {from: 'ali', msg:'hello'},
        {from: 'may', msg:'hola'},
        {from: 'june', msg:'merci'},
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

export default function Store(props){

    const reducerHook = React.useReducer(reducer, initState);

    return(
        <CTX.Provider value ={reducerHook}>
            {props.children}
        </CTX.Provider>
    )
}