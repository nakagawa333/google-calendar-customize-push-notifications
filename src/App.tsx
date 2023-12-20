import React, { useEffect } from 'react';
import './App.css';
import Box from '@mui/material/Box';
import { AppBar, Container, List, ListItem, ListItemText, Toolbar, Typography } from '@mui/material';
import { getRequestToken,onMessageListener } from './firebase';
import "./firebase";
import { requestNotificationPermission,showNotification } from './Notification/notification';

function App() {
  const todos:string[] = ["todo1","todo2","todo3"];

  useEffect(() => {
    (async() => {
      //トークン取得    
      let token = await getRequestToken();
      console.info(token);

      if("Notification" in window){
        const permission = Notification.permission;
        if(permission === "denied" || permission === "granted"){
          return;
        }
  
        try{
          await requestNotificationPermission();
        } catch(e){
          console.error(e);
        }
      }
    })()
  },[])

  onMessageListener()
   .then(async(payload:any) => {
      //通知を作成
      let notification = new Notification(
        payload.notification.title,
        {
          body:payload.notification.body,
          tag:"",
          data:payload.data
        }
      );

      await showNotification(notification);
   })

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
