import React, { useEffect } from 'react';
import './App.css';
import Box from '@mui/material/Box';
import { AppBar, Container, List, ListItem, ListItemText, Toolbar, Typography } from '@mui/material';
import FcmNotification from './components/FcmNotification';

function App() {
  const todos:string[] = ["todo1","todo2","todo3"];

  useEffect(() => {
    
  },[])
  
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

      <FcmNotification />
    </Box>
  );
}

export default App;
