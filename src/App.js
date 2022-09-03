import { useState, useEffect } from "react";
import {
  format,
  parse,
  differenceInCalendarDays,
  startOfTomorrow,
} from "date-fns";
import Cookies from "js-cookie";
import "./App.css";

const dateFormate = "dd/MM/yyyy";
// a new habit usually takes a little more than 2 months — 66 days to be exact — and as much as 254 days until it’s fully formed
// https://medium.com/swlh/21-day-habit-timeline-how-to-form-a-habit-in-21-days-day-by-day-92298446bf6b
const target = 21;

function App() {
  const [name, setName] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    try {
      setData(JSON.parse(Cookies.get("data")));
    } catch (e) {}
  }, []);

  const onAdd = () => {
    const newData = [
      ...data,
      {
        name,
        startDate: format(new Date(), dateFormate),
      },
    ];
    setData(newData);
    Cookies.set("data", JSON.stringify(newData), { expires: 365 });
  };

  const didIt = (index) => {
    const newDate = [
      ...data.filter((item, i) => i !== index),
      {
        ...data[index],
        startDate: format(startOfTomorrow(), dateFormate),
      },
    ];
    setData(newDate);
    Cookies.set("data", JSON.stringify(newDate), { expires: 365 });
  };

  return (
    <>
      <input
        value={name}
        onChange={(event) => setName(event.target.value)}
        type="text"
        placeholder="to don't"
      />{" "}
      <button onClick={onAdd}>Add</button>
      <ul>
        {data.map((item, index) => (
          <li key={index}>
            You have not done "{item.name}" for{" "}
            {differenceInCalendarDays(
              new Date(),
              parse(item.startDate, dateFormate, new Date())
            ) + 1}{" "}
            consecutive day(s) <button onClick={() => didIt(index)}>:(</button>
            <br />
            <progress
              max={target}
              value={
                differenceInCalendarDays(
                  new Date(),
                  parse(item.startDate, dateFormate, new Date())
                ) + 1
              }
            />
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;
