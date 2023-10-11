import logo from './logo.svg';
import './App.css';
import { db } from './firebase';
import { useEffect, useState } from 'react';
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";

function App() {

  const [record, setRecord] = useState([]);
  const [list, setList] = useState("");
  const [edit, setEdit] = useState("");

  let tbl = collection(db, "to_do_list");

  const getList = async () => {
    const data = await getDocs(tbl);
    setRecord(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  }
  const onsubmit = async () => {
    if (edit) {
      const userDoc = doc(db, "to_do_list", edit);
      const newFields = { list: list };
      await updateDoc(userDoc, newFields);
    } else {
      let add = await addDoc(tbl, { list: list });
      if (add) {
        alert("Record successfully insert")
      } else {
        alert("Record not successfully insert")
      }
    }
    setList("");
    setEdit("");
    getList();
  }

  const onremove = async (id) => {
    const userDoc = doc(db, "to_do_list", id);
    alert("user successfully delete");
    let res = await deleteDoc(userDoc);
    getList();
  }

  const onupdate = (id, list) => {
    setList(list);
    setEdit(id)
    getList();
  }

  useEffect(() => {
    getList();
  }, [])

  return (
    <center>
      <h1>To Do List</h1>
      <table cellspacing="10" cellpadding="20">
        <thead>
          <tr>
            <td>
              <input type='text' name='list' onChange={(e) => setList(e.target.value)} value={list} />
            </td>
            <td style={{display:"flex",justifyContent:"center"}}>
              {
                edit ? (<button onClick={() => onsubmit()} >Up Date</button>) : (<button onClick={() => onsubmit()} >Submit</button>)
              }

            </td>
          </tr>
        </thead>
      
        <tbody>
          {
            record.map((val) => {
              const { list, id } = val
              return (
                <tr key={list}>
                  <td>{list}</td>
                  <td>
                    <button onClick={() => onremove(id)}>Remove</button>
                    <button onClick={() => onupdate(id, list)}>Up Date</button>
                  </td>
                </tr>
              )
            })

          }
        </tbody>
      </table>
    </center >
  );
}

export default App;
