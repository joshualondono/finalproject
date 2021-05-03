import React, { useState, useEffect } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import TextField from '@material-ui/core/TextField';
import './App.css';
import { API } from 'aws-amplify';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { listNotes } from './graphql/queries';
import { createNote as createNoteMutation, deleteNote as deleteNoteMutation } from './graphql/mutations';
import { DataStore } from '@aws-amplify/datastore'
import { ReactTinyLink } from "react-tiny-link";
import Fab from '@material-ui/core/Fab';



const initialFormState = { name: '', description: '' }

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    listStyle: 'none',
    padding: theme.spacing(0.5),
    margin: 0,
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '0%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
}));

function App() {
  const classes = useStyles();
  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState(initialFormState);

  const [chipData, setChipData] = React.useState([
    { key: 0, label: 'Angular' },
    { key: 4, label: 'Vue.js' },
  ]);

  const handleDelete = (chipToDelete) => () => {
    setChipData((chips) => chips.filter((chip) => chip.key !== chipToDelete.key));
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    const apiData = await API.graphql({ query: listNotes });
    setNotes(apiData.data.listNotes.items);
  }

 

  async function createNote() {
    if (!formData.name || !formData.description) return;
    await API.graphql({ query: createNoteMutation, variables: { input: formData } });
    setNotes([ ...notes, formData ]);
    setFormData(initialFormState);
  }

  async function deleteNote({ id }) {
    const newNotesArray = notes.filter(note => note.id !== id);
    setNotes(newNotesArray);
    await API.graphql({ query: deleteNoteMutation, variables: { input: { id } }});
  }
  const validUrl = require('valid-url');


  return (
    <div className="App">
       <AmplifySignOut />

       


      <Button onClick={createNote}>Create Note</Button>
      <h1>My Tutorials Journal 🗒️</h1>

      <TextField 
          id="standard-basic" 
          label="Tutorial Url"
          onChange={e => setFormData({ ...formData, 'name': e.target.value})}
          placeholder="Add link to tutorial"
          value={formData.name} 
        />
      <h1></h1>

      <TextField 
          id="standard-basic" 
          label="Notes"
          onChange={e => setFormData({ ...formData, 'description': e.target.value})}
          placeholder="Notes about tutorial"
          value={formData.description}
        />

      <Container className={classes.cardGrid} maxWidth="md">

          {/* End hero unit */}
          <Grid container spacing={4}>
            {notes.map((card) => (
              <Grid item key={card} xs={12} sm={6} md={4}>
                <Card className={classes.card}>
                <Typography component="h2">
                    </Typography>
                <ReactTinyLink
                    cardSize="small"
                    showGraphic={true}
                    maxLine={3}
                    minLine={1}
                    url={validUrl.isUri(card.name)  ? card.name : "https://www.digitalocean.com/community/tutorials/how-to-deploy-a-react-application-with-nginx-on-ubuntu-20-04"}
      />
      
                  <CardMedia
                    className={classes.cardMedia}
                    title={card.title}
                    
                  />
                  <CardContent className={classes.cardContent}>

                    <Typography>
                    {card.description}
                    </Typography>
                  </CardContent>

                  <Paper component="ul" className={classes.root}>
      {chipData.map((data) => {
        let icon;

        if (data.label === 'React') {
        
        }

        return (
          <li key={data.key}>
            <Chip
              icon={icon}
              label={data.label}
              onDelete={data.label === 'React' ? undefined : handleDelete(data)}
              className={classes.chip}
            />
          </li>
        );
      })}
    </Paper>
    <CardActions>
                  <Button 
                      onClick={() => deleteNote(card)} 
                      size="small" 
                      color="primary"
                    >
                      Delete 🗑️
                    </Button>
                  </CardActions>
                </Card>

   
              </Grid>
            ))}
          </Grid>
        </Container>

    </div>
  );
}

export default withAuthenticator(App);