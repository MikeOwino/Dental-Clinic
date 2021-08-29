import React, { useState, useEffect, useContext } from 'react'
import API from '../API'
import SessionContext from "./session/SessionContext"

import { TextField } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'

export default function Doctors(props) {

  let { session: { user: { id, token, isAdmin } } } = useContext(SessionContext);

  const [doctors, setdoctors] = useState([]);

  const fetchdata = async () => {
    await API.get(`doctor`, {
      headers: {
        id: id,
        token: token,
        isAdmin: isAdmin
      }
    })
      .then(res => {
        const result = res.data.result;
        setdoctors(result);
      });
  }

  useEffect(() => {
    fetchdata();
  }, []);

  return (
    <Autocomplete
      options={doctors}
      getOptionLabel={(option) => option.first_name + " " + option.middle_name + " " + option.last_name}
      // defaultvalue={doctors.find(p => p.id == props.value)}
      // defaultValue={props.value}
      variant="outlined"
      onChange={props.onChange}
      renderInput={(params) =>
        <TextField
          fullWidth
          {...params}
          variant="outlined"
          label="Doctor"
          className={props.className}
        />
      }
    />
  );
}