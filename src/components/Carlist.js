import React, { useState, useEffect } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar'; // Extra
import IconButton from '@material-ui/core/IconButton'; // Extra
import Addcar from './Addcar.js';
import Editcar from './Editcar.js';

export default function Carlist() {

    const [cars, setCars] = useState([]);

    useEffect(() => fetchData(), []);

    const fetchData = () => {
        fetch('https://carstockrest.herokuapp.com/cars')
        .then(response => response.json())
        .then(data => setCars(data._embedded.cars))
    }

    const deleteCar = (link) => {
        //console.log(link);
        if (window.confirm('Are you sure?')) {
            fetch(link, {method: 'DELETE'})
            .then(res => fetchData())
            .catch(err => console.error(err))
            setOpen(true) // Extra
        }
    }

    // Extra
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
      };

    const [open, setOpen] = React.useState(false); //Extra

    const saveCar = (car) => {
        fetch('https://carstockrest.herokuapp.com/cars', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(car)
        })
        .then(res => fetchData())
        .catch(err => window.error(err))
    }

    const updateCar = (car, link) => {
        fetch(link, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(car)
        })
        .then(res => fetchData())
        .catch(err => window.error(err))
}

    const columns = [
        {
            Header: 'Brand',
            accessor: 'brand'
        },
        {
            Header: 'Model',
            accessor: 'model'
        },
        {
            Header: 'Color',
            accessor: 'color'
        },
        {
            Header: 'Fuel',
            accessor: 'fuel'
        },
        {
            Header: 'Year',
            accessor: 'year'
        },
        {
            sortable: false,
            filterable: false,
            width: 100,
            Cell: row => <Editcar updateCar={updateCar} car={row.original}/>
        },
        {
            sortable: false,
            filterable: false,
            width: 100,
            accessor: '_links.self.href',
            Cell: row => <Button onClick={() => deleteCar(row.value)} color='secondary' size='small'>Delete</Button>
        }
    ]

    // Extra: Added <snackbar> pop-up-window. Following an example, but I'd rather define it as another component and call it like ReactTable, if possible.

    return (
        <div>
            <ReactTable filterable={true} data={cars} columns={columns} />

            <Snackbar
                anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
                }}
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
                message="Car deleted successfully."
                action={
                <React.Fragment>
                    <Button color="secondary" size="small" onClick={handleClose}>
                    UNDO (Doesn't really work!)
                    </Button>
                <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                </IconButton>
                </React.Fragment>
                }
            />

            <Addcar saveCar={saveCar} />
        </div>
    );
}