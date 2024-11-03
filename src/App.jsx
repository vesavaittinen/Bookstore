import { useState, useEffect } from 'react'
import { AgGridReact } from 'ag-grid-react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import AddBook from './AddBook';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import './App.css'

function App() {
  const [books, setBooks] = useState([]);

  const columnDefs = [
    { field: 'title', sortable: true, filter: true},
    { field: 'author', sortable: true, filter: true},
    { field: 'year', sortable: true, filter: true},
    { field: 'isbn', sortable: true, filter: true},
    { field: 'price', sortable: true, filter: true},
    { 
      headerName: '',
      field: 'id',
      width: 90,
      cellRenderer: params => 
      <IconButton onClick={() => deleteBook(params.value)} size="small" color="error">
        <DeleteIcon />
      </IconButton> 
    }
  ]

  useEffect(() => {
    fetchItems(); // fetchataan kerran laittamalla taulukko toiseksi argumentiksi
  }, [])

  const fetchItems = () => {
    fetch('https://bookstore-20f29-default-rtdb.europe-west1.firebasedatabase.app/books/.json')
    .then(response => response.json()) // muutetaan .jsonista tavalliseksi olioksi
    .then(data => addKeys(data))
    .catch(err => console.error(err));
  }

    // Add keys to the todo objects
  const addKeys = (data) => {
    const keys = Object.keys(data);
    const valueKeys = Object.values(data).map((book, index) => 
    Object.defineProperty(book, 'id', {value: keys[index]}));
    setBooks(valueKeys);
  }

  const addBook = (newBook) => {
    fetch('https://bookstore-20f29-default-rtdb.europe-west1.firebasedatabase.app/books/.json',
    {
      method: 'POST',
      body: JSON.stringify(newBook)
    })
    .then(response => fetchItems())
    .catch(err => console.error(err))
  }

  const deleteBook = (id) => {
    fetch(`https://bookstore-20f29-default-rtdb.europe-west1.firebasedatabase.app/books/${id}.json`,
    {
      method: 'DELETE',
    })
    .then(response => fetchItems())
    .catch(err => console.error(err))
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5">
            Bookstore
          </Typography>
        </Toolbar>
      </AppBar> 
      <AddBook addBook={addBook} />
      <div className="ag-theme-material" style={{height: 400, width: 1150}}> 
        <AgGridReact 
          rowData={books}
          columnDefs={columnDefs}
        />
      </div>
    </>
  )
}

export default App