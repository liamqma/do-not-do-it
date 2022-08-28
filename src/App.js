import { useState, useEffect } from "react";
import { format, parse, differenceInCalendarDays } from "date-fns";
import Cookies from "js-cookie";
import "./App.css";

const dateFormate = "dd/MM/yyyy";

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
        datesDidIt: [],
      },
    ];
    setData(newData);
    Cookies.set("data", JSON.stringify(newData), { expires: 365 });
  };

  const didIt = (index) => {
    const datesDidIt = data[index].datesDidIt;
    const dateDidIt = format(new Date(), dateFormate);

    if (datesDidIt.includes(dateDidIt)) return;

    const newDate = [
      ...data.filter((item, i) => i !== index),
      {
        ...data[index],
        datesDidIt: [
          ...data[index].datesDidIt,
          format(new Date(), dateFormate),
        ],
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
            {item.name}{" "}
            {differenceInCalendarDays(
              new Date(),
              parse(item.startDate, dateFormate, new Date())
            ) +
              1 -
              item.datesDidIt.length}{" "}
            days <button onClick={() => didIt(index)}>:(</button>
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;
