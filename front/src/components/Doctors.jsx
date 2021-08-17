import React, { useState, useEffect } from 'react';
import API from '../API';

export default function Doctors(props) {

  const [doctors, setdoctors] = useState([]);

  const fetchdata = async () => {
    await API.get(`doctor`)
      .then(res => {
        const result = res.data.result;
        let data = [];
        result.map(res =>
          data.push({
            id: res.id,
            name: res.first_name + " " + res.middle_name + " " + res.last_name
          })
        )
        setdoctors(data);
      });
  }

  function handleBlur(value) {
    let isTrue = doctors.filter(p => p.name + " - " + p.id === value)
    if (!isTrue.length) {
      props.resetValue();
    }
  }

  useEffect(() => {
    fetchdata();
  }, []);

  return (
    <div>
      <input
        list="doctor"
        name={props.name}
        value={props.value}
        placeholder="Doctor"
        onChange={props.onChange}
        onBlur={e => handleBlur(e.target.value)}
      />

      <datalist
        id="doctor"
      >

        {doctors.map(doctor =>
          <option key={doctor.id}>
            {doctor.name} - {doctor.id}
          </option>
        )}

      </datalist>
    </div>
  );
}