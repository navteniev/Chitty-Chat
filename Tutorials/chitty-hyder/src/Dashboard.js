import React from 'react'

// material.ui imports
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

// lists
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

// chip 
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';

// button
import Button from '@material-ui/core/Button';

// textField
import TextField from '@material-ui/core/TextField';


// use the context from store
import {CTX} from './Store'


// inline css
const useStyles = makeStyles(theme => ({
    root: {
        margin: '50px',
        padding: theme.spacing(3, 2)
    },

    flex: {
        display: 'flex',
        alignItems: 'center'
    },

    topicsWindow: {
        width: '30%',
        height: '300px',
        borderRight: '1px solid grey'
    },

    chatWindow: {
        width: '70%',
        padding: '20px',
        height: '300px'
    },

    chatBox: {
        width: '85%'

    },

    button: {
        width: '15%',

    }


    }));

export default function Dashboard(){

    const classes = useStyles();

    // CTX store
    const {allChats} = React.useContext(CTX);
    const topics = Object.keys(allChats);

    // some local state with the sate hook
    const [activeTopic, changeActiveTopic] = React.useState(topics[0]);
    const [textValue, changeTextValue] = React.useState('');

    return (
        <div>
            <Paper className={classes.root}>
                <Typography variant="h4" component="h4">
                    <h3>Chitty Chat</h3>
                </Typography>
                <Typography variant="h5" component="h5">
                    {activeTopic}
                </Typography>

                <div className={classes.flex}>
                    {/* map over the topics */}
                    

                    <div className={classes.topicsWindow}>
                        <List>
                        {
                            topics.map(topic =>(
                                <ListItem onClick={e => changeActiveTopic(e.target.innerText)} key={topic} button>
                                <ListItemText primary={topic} />
                                </ListItem>
                            ))
                        }
                        </List>
            
                    </div>

                    <div className={classes.chatWindow}>

                        {
                            allChats[activeTopic].map((chat, i) =>(
                                <div className={classes.flex} key={i}>
                                    <Chip label={chat.from} className={classes.chip}/>

                                    <Typography variant='body1 gutterBottom'>{chat.msg}</Typography>
                                </div>

                            ))
                        }


                    </div>

                </div>


                
                <div className={classes.flex}>

                    <TextField
                        id="standard-name"
                        label="Send a chat"
                        className={classes.chatBox}
                        value={textValue}
                        onChange={e => changeTextValue(e.target.value)}
                        margin="normal"
                    />

                    <Button variant="contained" color="primary" className={classes.button}>
                        Send
                    </Button>




                </div>

 

            </Paper>

        </div>
    )

}