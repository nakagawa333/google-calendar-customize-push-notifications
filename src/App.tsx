import React, { useEffect } from 'react';
import './App.css';
import Box from '@mui/material/Box';
import { AppBar, Container, List, ListItem, ListItemText, Toolbar, Typography } from '@mui/material';
import { getRequestToken, onMessageEvent } from './firebase';
import {  onMessage } from "firebase/messaging";

function App() {
  const todos:string[] = ["todo1","todo2","todo3"];

  useEffect(() => {
    (async() => {
      //トークン取得    
      let token = await getRequestToken();
      console.info(token);
    })()
  },[])

  onMessageEvent().then(payload => {
    console.log(payload);
  }).catch(err => console.log('failed: ', err));

  return (

    <Box>

      <AppBar position="static">
        <Toolbar>
          <Typography>
            Google Calendar Batch todos
          </Typography>
        </Toolbar>
      </AppBar>
      <Container>
        <Box>
          <List sx={{width:"100%",maxWidth:360}}>
            {
              todos.map((todo:string,index:number) => {
                return(
                  <ListItem
                    key={index}
                  >
                    <ListItemText primary={todo} />
                  </ListItem>
                )
              })
            }
          </List>
        </Box>
      </Container>
    </Box>
  );
}

export default App;
